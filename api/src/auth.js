// Contas: e-mail/senha, Google (ID token verificado no servidor) e redefinição de senha.
import { CONTACT_PATTERN, EMAIL_PATTERN, HttpError, decodeJsonPart, encoder, fromBase64, fromBase64Url, json, nowIso, publicUser, readBody, requireUser, sha256Hex, signSession, text, timingSafeEqual, toBase64, toBase64Url } from './lib.js';

const PBKDF2_ITERATIONS = 100000;
const MIN_PASSWORD_LENGTH = 8;
const RESET_TTL_MS = 60 * 60 * 1000;
export const ROLES = new Set(['comprador', 'vendedor', 'ambos', 'pesador']);
const GOOGLE_ISSUERS = new Set(['accounts.google.com', 'https://accounts.google.com']);
const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

async function hashPassword(password, salt = crypto.getRandomValues(new Uint8Array(16)), iterations = PBKDF2_ITERATIONS) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
  return `pbkdf2$${iterations}$${toBase64(salt)}$${toBase64(bits)}`;
}

async function verifyPassword(password, stored) {
  const [scheme, iterations, salt] = (stored || '').split('$');
  if (scheme !== 'pbkdf2') return false;
  return timingSafeEqual(await hashPassword(password, fromBase64(salt), Number(iterations)), stored);
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH || password.length > 200) throw new HttpError(400, `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  return password;
}

let googleKeysCache = { keys: [], expiresAt: 0 };

async function googleKeys(force = false) {
  if (!force && googleKeysCache.expiresAt > Date.now()) return googleKeysCache.keys;
  const response = await fetch(GOOGLE_CERTS_URL);
  if (!response.ok) throw new HttpError(502, 'Não foi possível validar o login do Google agora.');
  const maxAge = Number(/max-age=(\d+)/.exec(response.headers.get('Cache-Control') || '')?.[1] || 3600);
  googleKeysCache = { keys: (await response.json()).keys, expiresAt: Date.now() + maxAge * 1000 };
  return googleKeysCache.keys;
}

async function verifyGoogleCredential(credential, env) {
  const parts = typeof credential === 'string' ? credential.split('.') : [];
  if (parts.length !== 3) throw new HttpError(400, 'Credencial do Google inválida.');
  const [header, payload, signature] = parts;
  const { alg, kid } = decodeJsonPart(header);
  if (alg !== 'RS256') throw new HttpError(401, 'Credencial do Google inválida.');
  const jwk = (await googleKeys()).find((key) => key.kid === kid) || (await googleKeys(true)).find((key) => key.kid === kid);
  if (!jwk) throw new HttpError(401, 'Credencial do Google inválida.');
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, fromBase64Url(signature), encoder.encode(`${header}.${payload}`));
  const claims = valid ? decodeJsonPart(payload) : null;
  if (!claims || claims.aud !== env.GOOGLE_CLIENT_ID || !GOOGLE_ISSUERS.has(claims.iss) || claims.exp * 1000 < Date.now()) throw new HttpError(401, 'Não foi possível confirmar sua conta Google.');
  if (!claims.email_verified) throw new HttpError(403, 'Seu e-mail do Google ainda não foi verificado.');
  return claims;
}

const findUserByEmail = (env, email) => env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
const touchLogin = (env, id) => env.DB.prepare("UPDATE users SET last_login_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?").bind(id).run();

async function sessionResponse(user, env, status = 200, extra = {}) {
  return json({ token: await signSession(user, env), user: publicUser(user, env), ...extra }, status);
}

async function register(request, env) {
  const body = await readBody(request);
  const name = text(body.name, 120);
  const email = text(body.email, 254).toLowerCase();
  const phone = text(body.phone, 30);
  const password = validatePassword(body.password);
  const role = ROLES.has(body.role) ? body.role : 'comprador';
  if (name.length < 2) throw new HttpError(400, 'Informe seu nome.');
  if (!EMAIL_PATTERN.test(email)) throw new HttpError(400, 'Informe um e-mail válido.');
  const existing = await findUserByEmail(env, email);
  if (existing) throw new HttpError(409, existing.password_hash ? 'Este e-mail já tem conta. Entre com sua senha.' : 'Este e-mail já tem conta com o Google. Use "Entrar com Google".');
  await env.DB.prepare('INSERT INTO users (id, name, email, phone, role, password_hash) VALUES (?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), name, email, phone || null, role, await hashPassword(password)).run();
  const user = await findUserByEmail(env, email);
  await touchLogin(env, user.id);
  return sessionResponse(user, env, 201);
}

async function login(request, env) {
  const body = await readBody(request);
  const email = text(body.email, 254).toLowerCase();
  const user = EMAIL_PATTERN.test(email) ? await findUserByEmail(env, email) : null;
  if (user && !user.password_hash) throw new HttpError(409, 'Esta conta usa o Google. Use "Entrar com Google".');
  if (!user || !(await verifyPassword(typeof body.password === 'string' ? body.password : '', user.password_hash))) throw new HttpError(401, 'E-mail ou senha incorretos.');
  await touchLogin(env, user.id);
  return sessionResponse(user, env);
}

async function googleLogin(request, env) {
  const body = await readBody(request);
  const claims = await verifyGoogleCredential(body.credential, env);
  const email = claims.email.toLowerCase();
  const existing = await env.DB.prepare('SELECT * FROM users WHERE google_sub = ?').bind(claims.sub).first() || await findUserByEmail(env, email);
  if (existing) {
    // E-mail verificado pelo Google: vincula o Google à conta existente com o mesmo e-mail.
    await env.DB.prepare('UPDATE users SET google_sub = ?, avatar_url = COALESCE(avatar_url, ?) WHERE id = ?').bind(claims.sub, claims.picture || null, existing.id).run();
  } else {
    const role = ROLES.has(body.role) ? body.role : 'comprador';
    await env.DB.prepare('INSERT INTO users (id, name, email, role, google_sub, avatar_url) VALUES (?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), text(claims.name || claims.given_name || email, 120), email, role, claims.sub, claims.picture || null).run();
  }
  const user = await findUserByEmail(env, email);
  await touchLogin(env, user.id);
  return sessionResponse(user, env, existing ? 200 : 201, { created: !existing });
}

async function me(request, env) {
  return json({ user: publicUser(await requireUser(request, env), env) });
}

async function updateMe(request, env) {
  const user = await requireUser(request, env);
  const body = await readBody(request);
  const name = body.name === undefined ? user.name : text(body.name, 120);
  if (name.length < 2) throw new HttpError(400, 'Informe seu nome.');
  const phone = body.phone === undefined ? user.phone : text(body.phone, 30) || null;
  const location = body.location === undefined ? user.location : text(body.location, 80) || null;
  const role = ROLES.has(body.role) ? body.role : user.role;
  await env.DB.prepare('UPDATE users SET name = ?, phone = ?, location = ?, role = ? WHERE id = ?').bind(name, phone, location, role, user.id).run();
  return json({ user: publicUser(await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first(), env) });
}

async function changePassword(request, env) {
  const user = await requireUser(request, env);
  const body = await readBody(request);
  const password = validatePassword(body.password);
  if (user.password_hash && !(await verifyPassword(typeof body.currentPassword === 'string' ? body.currentPassword : '', user.password_hash))) throw new HttpError(401, 'A senha atual não confere.');
  await env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(await hashPassword(password), user.id).run();
  return json({ ok: true });
}

// Redefinição de senha: exige o envio de e-mail da Cloudflare (binding EMAIL, plano Workers Paid).
async function forgotPassword(request, env) {
  const body = await readBody(request);
  const email = text(body.email, 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new HttpError(400, 'Informe um e-mail válido.');
  if (!env.EMAIL) throw new HttpError(503, 'A redefinição de senha por e-mail ainda não está disponível. Entre com Google ou fale com contato@gadon.com.br.');
  const user = await findUserByEmail(env, email);
  if (user) {
    const token = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
    await env.DB.prepare('INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha256Hex(token), user.id, new Date(Date.now() + RESET_TTL_MS).toISOString()).run();
    const link = `${env.APP_URL}/?redefinir=${token}`;
    await env.EMAIL.send({ to: email, from: { email: env.EMAIL_FROM, name: 'GadOn' }, subject: 'Redefinir sua senha do GadOn', text: `Olá, ${user.name.split(' ')[0]}.\n\nPara criar uma nova senha, abra o link abaixo (válido por 1 hora):\n${link}\n\nSe você não pediu, ignore este e-mail.`, html: `<p>Olá, ${user.name.split(' ')[0]}.</p><p>Para criar uma nova senha, clique no botão abaixo (válido por 1 hora):</p><p><a href="${link}" style="background:#B0591B;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Criar nova senha</a></p><p>Se você não pediu, ignore este e-mail.</p>` });
  }
  // Mesma resposta exista ou não a conta, para não revelar quais e-mails estão cadastrados.
  return json({ ok: true });
}

async function resetPassword(request, env) {
  const body = await readBody(request);
  const password = validatePassword(body.password);
  const tokenHash = await sha256Hex(text(body.token, 200));
  const reset = await env.DB.prepare('SELECT * FROM password_resets WHERE token_hash = ?').bind(tokenHash).first();
  if (!reset || reset.used_at || reset.expires_at < nowIso()) throw new HttpError(400, 'Este link de redefinição é inválido ou expirou. Peça um novo.');
  await env.DB.batch([
    env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(await hashPassword(password), reset.user_id),
    env.DB.prepare('UPDATE password_resets SET used_at = ? WHERE token_hash = ?').bind(nowIso(), tokenHash),
  ]);
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(reset.user_id).first();
  return sessionResponse(user, env);
}

// Pré-cadastro público (gadon.com.br/pre-cadastro): guarda o interesse antes do lançamento.
async function preRegister(request, env) {
  const body = await readBody(request);
  if (text(body.website, 200)) return json({ ok: true }, 201); // campo isca contra robôs
  const name = text(body.name, 120);
  const email = text(body.email, 254).toLowerCase();
  const phone = text(body.phone, 30);
  const city = text(body.city, 80);
  const state = text(body.state, 2).toUpperCase();
  const profiles = Array.isArray(body.profiles) ? body.profiles.map((item) => text(item, 30)).filter((item) => ['comprador', 'vendedor', 'pesador', 'transportador'].includes(item)) : [];
  const herdSize = text(body.herdSize, 40);
  if (name.length < 2) throw new HttpError(400, 'Informe seu nome.');
  if (!EMAIL_PATTERN.test(email)) throw new HttpError(400, 'Informe um e-mail válido.');
  if (phone.replace(/\D/g, '').length < 10) throw new HttpError(400, 'Informe um celular/WhatsApp com DDD.');
  if (!profiles.length) throw new HttpError(400, 'Escolha como você pretende usar o GadOn.');
  if (!body.consent) throw new HttpError(400, 'É preciso concordar com o uso dos dados para o contato do GadOn.');
  if (CONTACT_PATTERN.test(name)) throw new HttpError(400, 'Informe apenas o seu nome no campo Nome.');
  await env.DB.prepare(`INSERT INTO pre_registrations (email, name, phone, city, state, profiles, herd_size, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET name = excluded.name, phone = excluded.phone, city = excluded.city, state = excluded.state, profiles = excluded.profiles, herd_size = excluded.herd_size, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`).bind(email, name, phone, city || null, state || null, JSON.stringify(profiles), herdSize || null, text(body.source, 60) || 'pre-cadastro').run();
  return json({ ok: true }, 201);
}

export const authRoutes = {
  'POST /auth/register': register,
  'POST /auth/login': login,
  'POST /auth/google': googleLogin,
  'POST /auth/forgot': forgotPassword,
  'POST /auth/reset': resetPassword,
  'GET /auth/me': me,
  'PATCH /me': updateMe,
  'POST /me/password': changePassword,
  'POST /pre-cadastro': preRegister,
};

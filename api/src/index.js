// API do GadOn: contas com e-mail/senha ou Google e sessões assinadas (JWT HS256).
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const PBKDF2_ITERATIONS = 100000;
const MIN_PASSWORD_LENGTH = 8;
const ROLES = new Set(['comprador', 'vendedor', 'ambos', 'pesador']);
const GOOGLE_ISSUERS = new Set(['accounts.google.com', 'https://accounts.google.com']);
const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const PREVIEW_ORIGIN = /^https:\/\/[a-z0-9-]+\.gadon-marketplace\.pages\.dev$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes));
const fromBase64 = (text) => Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
const toBase64Url = (bytes) => toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromBase64Url = (text) => fromBase64(text.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(text.length / 4) * 4, '='));
function decodeJsonPart(part) {
  try { return JSON.parse(decoder.decode(fromBase64Url(part))); } catch { throw new HttpError(400, 'Credencial inválida.'); }
}

function timingSafeEqual(a, b) {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) diff |= (left[i] || 0) ^ (right[i] || 0);
  return diff === 0;
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGINS.split(',').map((item) => item.trim());
  if (!allowed.includes(origin) && !PREVIEW_ORIGIN.test(origin)) return { Vary: 'Origin' };
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '86400', Vary: 'Origin' };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
}

async function readBody(request) {
  try { return await request.json(); } catch { throw new HttpError(400, 'Corpo da requisição inválido.'); }
}

function text(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// Senhas: PBKDF2-SHA256 com sal aleatório por usuário.
async function hashPassword(password, salt = crypto.getRandomValues(new Uint8Array(16)), iterations = PBKDF2_ITERATIONS) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
  return `pbkdf2$${iterations}$${toBase64(salt)}$${toBase64(bits)}`;
}

async function verifyPassword(password, stored) {
  const [scheme, iterations, salt] = stored.split('$');
  if (scheme !== 'pbkdf2') return false;
  return timingSafeEqual(await hashPassword(password, fromBase64(salt), Number(iterations)), stored);
}

async function sessionKey(env) {
  if (!env.SESSION_SECRET) throw new HttpError(500, 'Serviço de autenticação sem configuração.');
  return crypto.subtle.importKey('raw', encoder.encode(env.SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function signSession(user, env) {
  const now = Math.floor(Date.now() / 1000);
  const header = toBase64Url(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const payload = toBase64Url(encoder.encode(JSON.stringify({ sub: user.id, role: user.role, iat: now, exp: now + SESSION_TTL_SECONDS })));
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', await sessionKey(env), encoder.encode(`${header}.${payload}`)));
  return `${header}.${payload}.${toBase64Url(signature)}`;
}

async function readSession(request, env) {
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const [header, payload, signature] = token.split('.');
  if (!signature) throw new HttpError(401, 'Sessão ausente.');
  let valid = false;
  try { valid = await crypto.subtle.verify('HMAC', await sessionKey(env), fromBase64Url(signature), encoder.encode(`${header}.${payload}`)); } catch (error) { if (error instanceof HttpError) throw error; }
  if (!valid) throw new HttpError(401, 'Sessão inválida. Entre novamente.');
  const claims = decodeJsonPart(payload);
  if (claims.exp * 1000 < Date.now()) throw new HttpError(401, 'Sessão expirada. Entre novamente.');
  return claims;
}

// Login com Google: assinatura RS256 conferida com as chaves públicas do Google.
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

const publicUser = (row) => ({ id: row.id, name: row.name, email: row.email, phone: row.phone || '', role: row.role, avatarUrl: row.avatar_url || '', providers: [row.password_hash ? 'senha' : null, row.google_sub ? 'google' : null].filter(Boolean), createdAt: row.created_at });
const findUserByEmail = (env, email) => env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
const touchLogin = (env, id) => env.DB.prepare("UPDATE users SET last_login_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?").bind(id).run();

async function sessionResponse(user, env, headers, status = 200, extra = {}) {
  return json({ token: await signSession(user, env), user: publicUser(user), ...extra }, status, headers);
}

async function register(request, env, headers) {
  const body = await readBody(request);
  const name = text(body.name, 120);
  const email = text(body.email, 254).toLowerCase();
  const phone = text(body.phone, 30);
  const password = typeof body.password === 'string' ? body.password : '';
  const role = ROLES.has(body.role) ? body.role : 'comprador';
  if (name.length < 2) throw new HttpError(400, 'Informe seu nome.');
  if (!EMAIL_PATTERN.test(email)) throw new HttpError(400, 'Informe um e-mail válido.');
  if (password.length < MIN_PASSWORD_LENGTH || password.length > 200) throw new HttpError(400, `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  const existing = await findUserByEmail(env, email);
  if (existing) throw new HttpError(409, existing.password_hash ? 'Este e-mail já tem conta. Entre com sua senha.' : 'Este e-mail já tem conta com o Google. Use "Entrar com Google".');
  const user = { id: crypto.randomUUID(), name, email, phone, role, password_hash: await hashPassword(password) };
  await env.DB.prepare('INSERT INTO users (id, name, email, phone, role, password_hash) VALUES (?, ?, ?, ?, ?, ?)').bind(user.id, name, email, phone || null, role, user.password_hash).run();
  await touchLogin(env, user.id);
  return sessionResponse(await findUserByEmail(env, email), env, headers, 201);
}

async function login(request, env, headers) {
  const body = await readBody(request);
  const email = text(body.email, 254).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const user = EMAIL_PATTERN.test(email) ? await findUserByEmail(env, email) : null;
  if (user && !user.password_hash) throw new HttpError(409, 'Esta conta usa o Google. Use "Entrar com Google".');
  if (!user || !(await verifyPassword(password, user.password_hash))) throw new HttpError(401, 'E-mail ou senha incorretos.');
  await touchLogin(env, user.id);
  return sessionResponse(user, env, headers);
}

async function googleLogin(request, env, headers) {
  const body = await readBody(request);
  const claims = await verifyGoogleCredential(body.credential, env);
  const email = claims.email.toLowerCase();
  let user = await env.DB.prepare('SELECT * FROM users WHERE google_sub = ?').bind(claims.sub).first() || await findUserByEmail(env, email);
  const created = !user;
  if (created) {
    const role = ROLES.has(body.role) ? body.role : 'comprador';
    await env.DB.prepare('INSERT INTO users (id, name, email, role, google_sub, avatar_url) VALUES (?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), text(claims.name || claims.given_name || email, 120), email, role, claims.sub, claims.picture || null).run();
  } else {
    // E-mail verificado pelo Google: vincula o Google à conta existente com o mesmo e-mail.
    await env.DB.prepare('UPDATE users SET google_sub = ?, avatar_url = COALESCE(avatar_url, ?) WHERE id = ?').bind(claims.sub, claims.picture || null, user.id).run();
  }
  user = await findUserByEmail(env, email);
  await touchLogin(env, user.id);
  return sessionResponse(user, env, headers, created ? 201 : 200, { created });
}

async function me(request, env, headers) {
  const claims = await readSession(request, env);
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(claims.sub).first();
  if (!user) throw new HttpError(401, 'Conta não encontrada. Entre novamente.');
  return json({ user: publicUser(user) }, 200, headers);
}

const routes = {
  'GET /health': (request, env, headers) => json({ ok: true, service: 'gadon-api' }, 200, headers),
  'POST /auth/register': register,
  'POST /auth/login': login,
  'POST /auth/google': googleLogin,
  'GET /auth/me': me,
};

export default {
  async fetch(request, env) {
    const headers = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    const { pathname } = new URL(request.url);
    const handler = routes[`${request.method} ${pathname}`];
    if (!handler) return json({ error: 'Rota não encontrada.' }, 404, headers);
    try {
      if (request.method === 'POST' && pathname.startsWith('/auth/')) {
        const { success } = await env.AUTH_LIMITER.limit({ key: `${request.headers.get('CF-Connecting-IP') || 'anon'}:${pathname}` });
        if (!success) throw new HttpError(429, 'Muitas tentativas. Aguarde um minuto e tente novamente.');
      }
      return await handler(request, env, headers);
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.message }, error.status, headers);
      console.error('Erro inesperado na API', error);
      return json({ error: 'Erro interno. Tente novamente em instantes.' }, 500, headers);
    }
  },
};

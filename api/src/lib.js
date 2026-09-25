// Utilitários compartilhados da API: respostas, validação, sessão e usuários.
export const encoder = new TextEncoder();
const decoder = new TextDecoder();
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const PREVIEW_ORIGIN = /^https:\/\/[a-z0-9-]+\.gadon-marketplace\.pages\.dev$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Perguntas e respostas públicas não podem levar contato para fora da plataforma.
export const CONTACT_PATTERN = /(\S+@\S+\.\S+)|(https?:\/\/|www\.)|(\(?\d{2}\)?\s?9?\d{4}[-.\s]?\d{4})|whats\s?app|\bzap\b/i;

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes));
export const fromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
export const toBase64Url = (bytes) => toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const fromBase64Url = (value) => fromBase64(value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '='));
export const nowIso = () => new Date().toISOString();

export function decodeJsonPart(part) {
  try { return JSON.parse(decoder.decode(fromBase64Url(part))); } catch { throw new HttpError(400, 'Credencial inválida.'); }
}

export function parseJson(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export function timingSafeEqual(a, b) {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) diff |= (left[i] || 0) ^ (right[i] || 0);
  return diff === 0;
}

export async function sha256Hex(value) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
  return [...digest].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGINS.split(',').map((item) => item.trim());
  if (!allowed.includes(origin) && !PREVIEW_ORIGIN.test(origin)) return { Vary: 'Origin' };
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '86400', Vary: 'Origin' };
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
}

export async function readBody(request) {
  try { return await request.json(); } catch { throw new HttpError(400, 'Corpo da requisição inválido.'); }
}

export function text(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function integer(value, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const number = Math.round(Number(value));
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

// Sessão: JWT HS256 assinado com SESSION_SECRET.
async function sessionKey(env) {
  if (!env.SESSION_SECRET) throw new HttpError(500, 'Serviço de autenticação sem configuração.');
  return crypto.subtle.importKey('raw', encoder.encode(env.SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signSession(user, env) {
  const now = Math.floor(Date.now() / 1000);
  const header = toBase64Url(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const payload = toBase64Url(encoder.encode(JSON.stringify({ sub: user.id, iat: now, exp: now + SESSION_TTL_SECONDS })));
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', await sessionKey(env), encoder.encode(`${header}.${payload}`)));
  return `${header}.${payload}.${toBase64Url(signature)}`;
}

async function readSession(request, env) {
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const [header, payload, signature] = token.split('.');
  if (!signature) return null;
  let valid = false;
  try { valid = await crypto.subtle.verify('HMAC', await sessionKey(env), fromBase64Url(signature), encoder.encode(`${header}.${payload}`)); } catch (error) { if (error instanceof HttpError) throw error; }
  if (!valid) throw new HttpError(401, 'Sessão inválida. Entre novamente.');
  const claims = decodeJsonPart(payload);
  if (claims.exp * 1000 < Date.now()) throw new HttpError(401, 'Sessão expirada. Entre novamente.');
  return claims;
}

export const isAdmin = (user, env) => Boolean(user) && (env.ADMIN_EMAILS || '').split(',').map((item) => item.trim().toLowerCase()).includes(user.email.toLowerCase());

export async function optionalUser(request, env) {
  const claims = await readSession(request, env);
  if (!claims) return null;
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(claims.sub).first();
  if (!user) throw new HttpError(401, 'Conta não encontrada. Entre novamente.');
  return user;
}

export async function requireUser(request, env) {
  const user = await optionalUser(request, env);
  if (!user) throw new HttpError(401, 'Entre na sua conta para continuar.');
  return user;
}

export async function requireAdmin(request, env) {
  const user = await requireUser(request, env);
  if (!isAdmin(user, env)) throw new HttpError(403, 'Acesso restrito à administração.');
  return user;
}

export const publicUser = (row, env) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone || '',
  role: row.role,
  location: row.location || '',
  avatarUrl: row.avatar_url || '',
  providers: [row.password_hash ? 'senha' : null, row.google_sub ? 'google' : null].filter(Boolean),
  sellerStatus: row.seller_status,
  isAdmin: isAdmin(row, env),
  createdAt: row.created_at,
});

export async function notify(env, userId, { type, title, body, target }) {
  await env.DB.prepare('INSERT INTO notifications (user_id, type, title, body, target) VALUES (?, ?, ?, ?, ?)').bind(userId, type, title, body, target ? JSON.stringify(target) : null).run();
}

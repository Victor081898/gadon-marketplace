// Conta: notificações, perfil vendedor, progresso do pesador, mídia e administração.
import { HttpError, integer, isAdmin, json, notify, nowIso, parseJson, publicUser, readBody, requireAdmin, requireUser, text } from './lib.js';

// ---------- Notificações ----------
async function listNotifications(request, env) {
  const user = await requireUser(request, env);
  const rows = (await env.DB.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 50').bind(user.id).all()).results;
  return json({ notifications: rows.map((row) => ({ id: row.id, type: row.type, title: row.title, body: row.body, target: parseJson(row.target, null), unread: !row.read, createdAt: row.created_at })) });
}

async function readNotifications(request, env) {
  const user = await requireUser(request, env);
  const body = await readBody(request);
  const ids = Array.isArray(body.ids) ? body.ids.map((id) => integer(id, { min: 1 })).filter(Boolean).slice(0, 100) : [];
  if (ids.length) await env.DB.prepare(`UPDATE notifications SET read = 1 WHERE user_id = ? AND id IN (${ids.map(() => '?').join(', ')})`).bind(user.id, ...ids).run();
  else await env.DB.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').bind(user.id).run();
  return json({ ok: true });
}

// ---------- Perfil vendedor (documentos ficam privados: só o próprio vendedor e a administração veem) ----------
const SELLER_FIELDS = ['producerName', 'producerType', 'documentType', 'documentNumber', 'commercialEmail', 'commercialPhone', 'farmName', 'municipality', 'state', 'propertyRegistry', 'stateRegistration', 'sanitaryStatus', 'traceability'];

async function getSellerProfile(request, env) {
  const user = await requireUser(request, env);
  return json({ profile: parseJson(user.seller_profile, {}), status: user.seller_status });
}

async function saveSellerProfile(request, env) {
  const user = await requireUser(request, env);
  const body = await readBody(request);
  const profile = Object.fromEntries(SELLER_FIELDS.map((field) => [field, text(body[field], 120)]));
  const files = (list) => (Array.isArray(list) ? list.filter((item) => item && typeof item.url === 'string' && item.url.includes('/media/private/')).map((item) => ({ url: text(item.url, 300), name: text(item.name, 120) })).slice(0, 10) : []);
  profile.vaccinationDocuments = files(body.vaccinationDocuments);
  profile.farmDocuments = files(body.farmDocuments);
  const missing = ['producerName', 'documentNumber', 'farmName', 'municipality', 'state', 'sanitaryStatus'].filter((field) => !profile[field]);
  if (missing.length) throw new HttpError(400, 'Preencha os campos obrigatórios do perfil vendedor.');
  await env.DB.prepare("UPDATE users SET seller_profile = ?, seller_status = 'em_analise', role = CASE WHEN role = 'comprador' THEN 'ambos' ELSE role END WHERE id = ?").bind(JSON.stringify(profile), user.id).run();
  return json({ profile, status: 'em_analise' });
}

// ---------- Pesador: aulas → conclusão → mini treinamento (corrigido no servidor) ----------
const WEIGHER_LESSONS = [1, 2, 3, 4];
const WEIGHER_ANSWERS = { q1: 0, q2: 1, q3: 1 };

async function getWeigherProgress(request, env) {
  const user = await requireUser(request, env);
  return json({ progress: { watched: [], lessonsConcluded: false, training: null, ...parseJson(user.weigher_progress, {}) } });
}

async function saveWeigherProgress(env, user, progress) {
  await env.DB.prepare('UPDATE users SET weigher_progress = ? WHERE id = ?').bind(JSON.stringify(progress), user.id).run();
  return json({ progress });
}

async function updateWeigherProgress(request, env) {
  const user = await requireUser(request, env);
  const current = { watched: [], lessonsConcluded: false, training: null, ...parseJson(user.weigher_progress, {}) };
  const body = await readBody(request);
  const watched = [...new Set([...current.watched, ...(Array.isArray(body.watched) ? body.watched.map(Number).filter((id) => WEIGHER_LESSONS.includes(id)) : [])])];
  const allWatched = WEIGHER_LESSONS.every((id) => watched.includes(id));
  if (body.lessonsConcluded && !allWatched) throw new HttpError(409, 'Assista a todas as aulas antes de concluir.');
  return saveWeigherProgress(env, user, { ...current, watched, lessonsConcluded: current.lessonsConcluded || Boolean(body.lessonsConcluded && allWatched) });
}

async function submitWeigherTraining(request, env) {
  const user = await requireUser(request, env);
  const current = { watched: [], lessonsConcluded: false, training: null, ...parseJson(user.weigher_progress, {}) };
  if (!current.lessonsConcluded) throw new HttpError(409, 'O mini treinamento é liberado depois de concluir as aulas.');
  const answers = (await readBody(request)).answers || {};
  const wrong = Object.entries(WEIGHER_ANSWERS).filter(([question, answer]) => Number(answers[question]) !== answer).map(([question]) => question);
  const score = Object.keys(WEIGHER_ANSWERS).length - wrong.length;
  return saveWeigherProgress(env, user, { ...current, training: { passed: wrong.length === 0, score, total: Object.keys(WEIGHER_ANSWERS).length, wrong, at: nowIso() } });
}

// ---------- Mídia (R2): fotos dos lotes e anexos públicos; documentos do vendedor privados ----------
const MEDIA_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf', 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mp4': 'm4a', 'audio/mpeg': 'mp3' };
const MEDIA_MAX_BYTES = 10 * 1024 * 1024;

async function uploadMedia(request, env) {
  const user = await requireUser(request, env);
  const type = (request.headers.get('Content-Type') || '').split(';')[0].trim();
  const extension = MEDIA_TYPES[type];
  if (!extension) throw new HttpError(415, 'Formato não aceito. Envie JPG, PNG, WEBP, PDF ou áudio.');
  const size = Number(request.headers.get('Content-Length') || 0);
  if (size > MEDIA_MAX_BYTES) throw new HttpError(413, 'O arquivo deve ter no máximo 10 MB.');
  const data = await request.arrayBuffer();
  if (!data.byteLength || data.byteLength > MEDIA_MAX_BYTES) throw new HttpError(413, 'O arquivo deve ter no máximo 10 MB.');
  const scope = new URL(request.url).searchParams.get('privado') === '1' ? 'private' : 'public';
  const key = `${scope}/${user.id}/${crypto.randomUUID()}.${extension}`;
  await env.MEDIA.put(key, data, { httpMetadata: { contentType: type } });
  return json({ url: `${env.PUBLIC_API_URL || new URL(request.url).origin}/media/${key}`, path: `/media/${key}`, type, size: data.byteLength }, 201);
}

async function getMedia(request, env, { key }) {
  if (key.startsWith('private/')) {
    const user = await requireUser(request, env);
    const ownerId = key.split('/')[1];
    if (ownerId !== user.id && !isAdmin(user, env)) throw new HttpError(403, 'Documento privado.');
  }
  const object = await env.MEDIA.get(key);
  if (!object) throw new HttpError(404, 'Arquivo não encontrado.');
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Cache-Control', key.startsWith('private/') ? 'private, no-store' : 'public, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
}

// ---------- Administração ----------
async function adminSellers(request, env) {
  await requireAdmin(request, env);
  const status = new URL(request.url).searchParams.get('status') || 'em_analise';
  const rows = (await env.DB.prepare('SELECT * FROM users WHERE seller_status = ? ORDER BY created_at ASC LIMIT 200').bind(status).all()).results;
  return json({ sellers: rows.map((row) => ({ ...publicUser(row, env), sellerProfile: parseJson(row.seller_profile, {}) })) });
}

async function reviewSeller(request, env, { id }) {
  await requireAdmin(request, env);
  const body = await readBody(request);
  const approve = body.decision === 'aprovar';
  const note = text(body.note, 300);
  if (!approve && !note) throw new HttpError(400, 'Explique o motivo para o vendedor.');
  const result = await env.DB.prepare('UPDATE users SET seller_status = ? WHERE id = ?').bind(approve ? 'aprovado' : 'recusado', text(id, 60)).run();
  if (!result.meta.changes) throw new HttpError(404, 'Vendedor não encontrado.');
  await notify(env, text(id, 60), { type: 'file', title: approve ? 'Perfil vendedor aprovado' : 'Perfil vendedor precisa de ajustes', body: approve ? 'Seus documentos foram conferidos. Você já é um vendedor verificado.' : note, target: { page: 'sellerProfile' } });
  return json({ ok: true });
}

async function adminPreRegistrations(request, env) {
  await requireAdmin(request, env);
  const rows = (await env.DB.prepare('SELECT * FROM pre_registrations ORDER BY created_at DESC LIMIT 5000').all()).results;
  const list = rows.map((row) => ({ ...row, profiles: parseJson(row.profiles, []) }));
  if (new URL(request.url).searchParams.get('formato') !== 'csv') return json({ total: list.length, preRegistrations: list });
  const cell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csv = ['Nome;E-mail;Celular;Cidade;UF;Perfis;Rebanho;Origem;Data', ...list.map((row) => [row.name, row.email, row.phone, row.city, row.state, row.profiles.join(', '), row.herd_size, row.source, row.created_at].map(cell).join(';'))].join('\r\n');
  return new Response(`﻿${csv}`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="pre-cadastros-gadon.csv"', 'Cache-Control': 'no-store' } });
}

async function adminStats(request, env) {
  await requireAdmin(request, env);
  const count = async (sql) => (await env.DB.prepare(sql).first()).total;
  return json({
    users: await count('SELECT COUNT(*) AS total FROM users'),
    preRegistrations: await count('SELECT COUNT(*) AS total FROM pre_registrations'),
    lotsPending: await count("SELECT COUNT(*) AS total FROM lots WHERE status = 'em_analise'"),
    lotsPublished: await count("SELECT COUNT(*) AS total FROM lots WHERE status = 'publicado'"),
    sellersPending: await count("SELECT COUNT(*) AS total FROM users WHERE seller_status = 'em_analise'"),
    orders: await count('SELECT COUNT(*) AS total FROM orders'),
    freightRequests: await count("SELECT COUNT(*) AS total FROM freight_requests WHERE status = 'novo'"),
  });
}

export const accountRoutes = {
  'GET /notifications': listNotifications,
  'POST /notifications/read': readNotifications,
  'GET /me/seller-profile': getSellerProfile,
  'PUT /me/seller-profile': saveSellerProfile,
  'GET /me/weigher': getWeigherProgress,
  'PUT /me/weigher': updateWeigherProgress,
  'POST /me/weigher/training': submitWeigherTraining,
  'POST /media': uploadMedia,
  'GET /media/*key': getMedia,
  'GET /admin/sellers': adminSellers,
  'POST /admin/sellers/:id/review': reviewSeller,
  'GET /admin/pre-cadastros': adminPreRegistrations,
  'GET /admin/stats': adminStats,
};

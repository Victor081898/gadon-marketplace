// Anúncios de lotes, perguntas públicas, favoritos e moderação.
import { geocodeCity } from './geo.js';
import { CONTACT_PATTERN, HttpError, integer, isAdmin, json, notify, nowIso, optionalUser, parseJson, readBody, requireAdmin, requireUser, text } from './lib.js';
import { recordView } from './radar.js';

const CATEGORIES = ['Nelore', 'Angus', 'Cruza', 'Bezerros', 'Outros'];
const SEXES = ['Machos', 'Fêmeas', 'Misto'];
const EDITABLE_STATUSES = new Set(['em_analise', 'publicado', 'recusado', 'pausado']);
const UFS = new Set(['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']);

// O comprador só vê o nome da fazenda e o primeiro nome do proprietário (nada de nome completo ou documentos).
export function publicLot(row, viewer, env) {
  const mine = Boolean(viewer) && viewer.id === row.seller_id;
  const lot = {
    id: row.id, status: row.status, name: row.name, category: row.category, breed: row.breed, sex: row.sex, heads: row.heads,
    weight: row.weight_arroba, age: row.age_label || '', ageMonths: row.age_months, purpose: row.purpose || '', pricePerHead: row.price_per_head,
    farm: row.farm_name, owner: row.owner_first_name, city: row.city, state: row.state, place: `${row.city} - ${row.state}`,
    coords: row.lat === null || row.lng === null ? null : [row.lng, row.lat], feeding: row.feeding || '', vaccination: row.vaccination || '',
    traceability: row.traceability || '', gtaStatus: row.gta_status || '', description: row.description || '', photos: parseJson(row.photos, []),
    isDemo: Boolean(row.is_demo), mine, publishedAt: row.published_at, createdAt: row.created_at,
  };
  if (mine || isAdmin(viewer, env)) Object.assign(lot, { reviewNote: row.review_note || '', updatedAt: row.updated_at });
  if (row.question_count !== undefined) lot.questionCount = row.question_count;
  if (row.pending_questions !== undefined) lot.pendingQuestions = row.pending_questions;
  return lot;
}

async function geocode(city, state) {
  const coords = await geocodeCity(city, state);
  return coords ? { lng: coords[0], lat: coords[1] } : { lat: null, lng: null };
}

function lotFields(body, seller) {
  const name = text(body.name, 80);
  const category = CATEGORIES.includes(body.category) ? body.category : null;
  const breed = text(body.breed, 60);
  const sex = SEXES.includes(body.sex) ? body.sex : null;
  const heads = integer(body.heads, { min: 1, max: 100000 });
  const pricePerHead = integer(body.pricePerHead, { min: 1, max: 10000000 });
  const city = text(body.city, 80);
  const state = text(body.state, 2).toUpperCase();
  const farm = text(body.farm, 100);
  const problems = [!name && 'nome do lote', !category && 'categoria', !breed && 'raça', !sex && 'sexo', !heads && 'quantidade de cabeças', !pricePerHead && 'preço por cabeça', !farm && 'fazenda', !city && 'município', !UFS.has(state) && 'UF'].filter(Boolean);
  if (problems.length) throw new HttpError(400, `Revise: ${problems.join(', ')}.`);
  const description = text(body.description, 2000);
  if (CONTACT_PATTERN.test(description) || CONTACT_PATTERN.test(name)) throw new HttpError(400, 'Não inclua telefone, e-mail ou links no anúncio. O contato acontece depois do pagamento.');
  const photos = Array.isArray(body.photos) ? body.photos.map((item) => text(item, 300)).filter((item) => item.startsWith('/media/') || item.startsWith('https://')).slice(0, 12) : [];
  const weight = Number(body.weight);
  return {
    name, category, breed, sex, heads, price_per_head: pricePerHead, farm_name: farm, owner_first_name: seller.name.split(' ')[0], city, state,
    weight_arroba: Number.isFinite(weight) && weight > 0 ? Math.min(weight, 100) : null, age_label: text(body.age, 40) || null,
    age_months: integer(body.ageMonths, { min: 0, max: 400 }), purpose: text(body.purpose, 40) || null, feeding: text(body.feeding, 120) || null,
    vaccination: text(body.vaccination, 160) || null, traceability: text(body.traceability, 120) || null, gta_status: text(body.gtaStatus, 60) || null,
    description: description || null, photos: JSON.stringify(photos),
  };
}

const LOT_SELECT = `SELECT l.*, (SELECT COUNT(*) FROM questions q WHERE q.lot_id = l.id) AS question_count FROM lots l`;

async function listLots(request, env) {
  const viewer = await optionalUser(request, env);
  const rows = (await env.DB.prepare(`${LOT_SELECT} WHERE l.status = 'publicado' ORDER BY l.published_at DESC LIMIT 500`).all()).results;
  return json({ lots: rows.map((row) => publicLot(row, viewer, env)) });
}

async function findLot(env, id) {
  const lot = await env.DB.prepare(`${LOT_SELECT} WHERE l.id = ?`).bind(integer(id, { min: 1 })).first();
  if (!lot) throw new HttpError(404, 'Anúncio não encontrado.');
  return lot;
}

async function getLot(request, env, { id }) {
  const viewer = await optionalUser(request, env);
  const lot = await findLot(env, id);
  const visible = lot.status === 'publicado' || lot.status === 'vendido' || viewer?.id === lot.seller_id || isAdmin(viewer, env);
  if (!visible) throw new HttpError(404, 'Anúncio não encontrado.');
  return json({ lot: publicLot(lot, viewer, env) });
}

async function viewLot(request, env, { id }) {
  const user = await requireUser(request, env);
  const lot = await findLot(env, id);
  if (lot.status !== 'publicado' || lot.seller_id === user.id) return json({ opportunities: [] });
  return json({ opportunities: await recordView(env, user, lot) });
}

async function createLot(request, env) {
  const seller = await requireUser(request, env);
  const fields = lotFields(await readBody(request), seller);
  const { lat, lng } = await geocode(fields.city, fields.state);
  const columns = { ...fields, seller_id: seller.id, lat, lng };
  const keys = Object.keys(columns);
  const result = await env.DB.prepare(`INSERT INTO lots (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).bind(...Object.values(columns)).run();
  if (seller.role === 'comprador') await env.DB.prepare("UPDATE users SET role = 'ambos' WHERE id = ?").bind(seller.id).run();
  return json({ lot: publicLot(await findLot(env, result.meta.last_row_id), seller, env) }, 201);
}

async function updateLot(request, env, { id }) {
  const seller = await requireUser(request, env);
  const lot = await findLot(env, id);
  if (lot.seller_id !== seller.id) throw new HttpError(403, 'Você só pode editar os seus anúncios.');
  const body = await readBody(request);
  if (body.action === 'pausar' || body.action === 'reativar') {
    if (!['publicado', 'pausado'].includes(lot.status)) throw new HttpError(409, 'Só anúncios publicados podem ser pausados ou reativados.');
    await env.DB.prepare('UPDATE lots SET status = ?, updated_at = ? WHERE id = ?').bind(body.action === 'pausar' ? 'pausado' : 'publicado', nowIso(), lot.id).run();
  } else if (body.action === 'remover') {
    if (lot.status === 'vendido') throw new HttpError(409, 'Anúncios vendidos não podem ser removidos.');
    await env.DB.prepare("UPDATE lots SET status = 'removido', updated_at = ? WHERE id = ?").bind(nowIso(), lot.id).run();
  } else {
    if (!EDITABLE_STATUSES.has(lot.status)) throw new HttpError(409, 'Este anúncio não pode mais ser editado.');
    const fields = lotFields(body, seller);
    const location = fields.city !== lot.city || fields.state !== lot.state ? await geocode(fields.city, fields.state) : { lat: lot.lat, lng: lot.lng };
    // Toda edição volta para análise antes de reaparecer no marketplace.
    const columns = { ...fields, ...location, status: 'em_analise', review_note: null, updated_at: nowIso() };
    await env.DB.prepare(`UPDATE lots SET ${Object.keys(columns).map((key) => `${key} = ?`).join(', ')} WHERE id = ?`).bind(...Object.values(columns), lot.id).run();
  }
  return json({ lot: publicLot(await findLot(env, lot.id), seller, env) });
}

async function myLots(request, env) {
  const seller = await requireUser(request, env);
  const rows = (await env.DB.prepare(`SELECT l.*, (SELECT COUNT(*) FROM questions q WHERE q.lot_id = l.id) AS question_count, (SELECT COUNT(*) FROM questions q WHERE q.lot_id = l.id AND q.answer IS NULL) AS pending_questions FROM lots l WHERE l.seller_id = ? AND l.status != 'removido' ORDER BY l.created_at DESC`).bind(seller.id).all()).results;
  return json({ lots: rows.map((row) => publicLot(row, seller, env)) });
}

// ---------- Perguntas públicas ----------
function publicQuestion(row, viewer) {
  return { id: row.id, lotId: row.lot_id, question: row.question, answer: row.answer || '', createdAt: row.created_at, answeredAt: row.answered_at, mine: Boolean(viewer) && viewer.id === row.author_id, lotName: row.lot_name };
}

async function listQuestions(request, env, { id }) {
  const viewer = await optionalUser(request, env);
  const rows = (await env.DB.prepare('SELECT * FROM questions WHERE lot_id = ? ORDER BY created_at DESC LIMIT 200').bind(integer(id, { min: 1 })).all()).results;
  return json({ questions: rows.map((row) => publicQuestion(row, viewer)) });
}

async function askQuestion(request, env, { id }) {
  const user = await requireUser(request, env);
  const lot = await findLot(env, id);
  if (lot.status !== 'publicado') throw new HttpError(409, 'Este anúncio não está recebendo perguntas.');
  if (lot.seller_id === user.id) throw new HttpError(409, 'Você não pode perguntar no seu próprio anúncio.');
  const question = text((await readBody(request)).question, 300);
  if (question.length < 8) throw new HttpError(400, 'Escreva a pergunta com um pouco mais de detalhe.');
  if (CONTACT_PATTERN.test(question)) throw new HttpError(400, 'Não inclua telefone, e-mail ou links. A conversa privada com a fazenda é liberada após o pagamento.');
  const result = await env.DB.prepare('INSERT INTO questions (lot_id, author_id, question) VALUES (?, ?, ?)').bind(lot.id, user.id, question).run();
  await notify(env, lot.seller_id, { type: 'message', title: 'Nova pergunta no seu anúncio', body: `${lot.name}: "${question}"`, target: { page: 'announcements', lotId: lot.id } });
  const row = await env.DB.prepare('SELECT * FROM questions WHERE id = ?').bind(result.meta.last_row_id).first();
  return json({ question: publicQuestion(row, user) }, 201);
}

async function answerQuestion(request, env, { id }) {
  const seller = await requireUser(request, env);
  const row = await env.DB.prepare('SELECT q.*, l.seller_id, l.name AS lot_name FROM questions q JOIN lots l ON l.id = q.lot_id WHERE q.id = ?').bind(integer(id, { min: 1 })).first();
  if (!row) throw new HttpError(404, 'Pergunta não encontrada.');
  if (row.seller_id !== seller.id) throw new HttpError(403, 'Só o anunciante pode responder.');
  const answer = text((await readBody(request)).answer, 600);
  if (answer.length < 2) throw new HttpError(400, 'Escreva a resposta.');
  if (CONTACT_PATTERN.test(answer)) throw new HttpError(400, 'Não inclua telefone, e-mail ou links na resposta pública.');
  await env.DB.prepare('UPDATE questions SET answer = ?, answered_at = ? WHERE id = ?').bind(answer, nowIso(), row.id).run();
  await notify(env, row.author_id, { type: 'message', title: 'Sua pergunta foi respondida', body: `${row.lot_name}: "${answer}"`, target: { lotId: row.lot_id } });
  return json({ question: publicQuestion({ ...row, answer, answered_at: nowIso() }, seller) });
}

async function sellerQuestions(request, env) {
  const seller = await requireUser(request, env);
  const rows = (await env.DB.prepare('SELECT q.*, l.name AS lot_name FROM questions q JOIN lots l ON l.id = q.lot_id WHERE l.seller_id = ? ORDER BY (q.answer IS NOT NULL), q.created_at DESC LIMIT 200').bind(seller.id).all()).results;
  return json({ questions: rows.map((row) => publicQuestion(row, seller)) });
}

// ---------- Favoritos ----------
async function listFavorites(request, env) {
  const user = await requireUser(request, env);
  const rows = (await env.DB.prepare('SELECT lot_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC').bind(user.id).all()).results;
  return json({ lotIds: rows.map((row) => row.lot_id) });
}

async function addFavorite(request, env, { id }) {
  const user = await requireUser(request, env);
  const lot = await findLot(env, id);
  await env.DB.prepare('INSERT OR IGNORE INTO favorites (user_id, lot_id) VALUES (?, ?)').bind(user.id, lot.id).run();
  return json({ ok: true });
}

async function removeFavorite(request, env, { id }) {
  const user = await requireUser(request, env);
  await env.DB.prepare('DELETE FROM favorites WHERE user_id = ? AND lot_id = ?').bind(user.id, integer(id, { min: 1 })).run();
  return json({ ok: true });
}

// ---------- Moderação ----------
async function adminLots(request, env) {
  const admin = await requireAdmin(request, env);
  const status = new URL(request.url).searchParams.get('status') || 'em_analise';
  const rows = (await env.DB.prepare(`SELECT l.*, u.name AS seller_name, u.email AS seller_email FROM lots l JOIN users u ON u.id = l.seller_id WHERE l.status = ? ORDER BY l.updated_at ASC LIMIT 200`).bind(status).all()).results;
  return json({ lots: rows.map((row) => ({ ...publicLot(row, admin, env), sellerName: row.seller_name, sellerEmail: row.seller_email })) });
}

async function reviewLot(request, env, { id }) {
  await requireAdmin(request, env);
  const lot = await findLot(env, id);
  const body = await readBody(request);
  const approve = body.decision === 'aprovar';
  const note = text(body.note, 300);
  if (!approve && !note) throw new HttpError(400, 'Explique o motivo da recusa para o vendedor.');
  await env.DB.prepare('UPDATE lots SET status = ?, review_note = ?, published_at = COALESCE(published_at, ?), updated_at = ? WHERE id = ?').bind(approve ? 'publicado' : 'recusado', note || null, approve ? nowIso() : null, nowIso(), lot.id).run();
  await notify(env, lot.seller_id, approve
    ? { type: 'file', title: 'Anúncio publicado', body: `O lote ${lot.name} foi aprovado e já aparece no marketplace.`, target: { page: 'announcements', lotId: lot.id } }
    : { type: 'file', title: 'Anúncio precisa de ajustes', body: `O lote ${lot.name} não foi aprovado: ${note}`, target: { page: 'announcements', lotId: lot.id } });
  return json({ ok: true });
}

export const lotRoutes = {
  'GET /lots': listLots,
  'POST /lots': createLot,
  'GET /lots/:id': getLot,
  'PATCH /lots/:id': updateLot,
  'POST /lots/:id/view': viewLot,
  'GET /lots/:id/questions': listQuestions,
  'POST /lots/:id/questions': askQuestion,
  'POST /questions/:id/answer': answerQuestion,
  'GET /me/lots': myLots,
  'GET /me/questions': sellerQuestions,
  'GET /me/favorites': listFavorites,
  'PUT /me/favorites/:id': addFavorite,
  'DELETE /me/favorites/:id': removeFavorite,
  'GET /admin/lots': adminLots,
  'POST /admin/lots/:id/review': reviewLot,
};

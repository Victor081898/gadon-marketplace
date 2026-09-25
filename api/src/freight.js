// Central de fretes: cotação avulsa, pedidos às transportadoras (inclusive nas voltas vazias do Radar),
// agenda de viagens e documentos de transporte de cada conta.
import { FREIGHT_PARTNERS, freightPrice } from './commerce.js';
import { geocodePlace } from './geo.js';
import { HttpError, integer, isAdmin, json, notify, nowIso, readBody, requireAdmin, requireUser, text } from './lib.js';
import { haversineKm, radarRoutes, roadRoute } from './radar.js';

const REQUEST_STATUSES = ['novo', 'contatado', 'fechado', 'cancelado'];
const TRIP_STATUSES = ['Programada', 'Em andamento', 'Concluída', 'Cancelada'];
const DOC_TYPES = ['GTA', 'CT-e', 'NF-e', 'CDE', 'Vacinação', 'Exames', 'Outro'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

const phoneOk = (phone) => phone.replace(/\D/g, '').length >= 10;

async function estimateRoute(origin, destination) {
  const [from, to] = await Promise.all([geocodePlace(origin), geocodePlace(destination)]);
  if (!from) throw new HttpError(400, 'Não encontramos a origem. Informe como "Cidade - UF".');
  if (!to) throw new HttpError(400, 'Não encontramos o destino. Informe como "Cidade - UF".');
  const road = await roadRoute(from, to);
  return road ? { distanceKm: Math.round(road.distanceKm), hours: Math.round(road.hours * 10) / 10, real: true } : { distanceKm: Math.round(haversineKm(from, to) * 1.3), hours: null, real: false };
}

const quotesFor = (route, heads) => FREIGHT_PARTNERS.map((partner) => ({ id: partner.id, partner: partner.name, price: freightPrice(partner, route.distanceKm, heads), distanceKm: route.distanceKm, hours: route.hours, real: route.real }));

async function notifyAdmins(env, message) {
  const admins = (await env.DB.prepare('SELECT id, email FROM users').all()).results.filter((row) => isAdmin(row, env));
  await Promise.all(admins.map((admin) => notify(env, admin.id, { type: 'truck', ...message, target: { page: 'admin', tab: 'freight' } })));
}

// Cotação avulsa (sem lote do marketplace): origem, destino e quantidade de cabeças.
async function estimate(request, env) {
  await requireUser(request, env);
  const body = await readBody(request);
  const origin = text(body.origin, 80);
  const destination = text(body.destination, 80);
  const heads = integer(body.heads, { min: 1, max: 5000 });
  if (!origin || !destination || !heads) throw new HttpError(400, 'Informe origem, destino e quantidade de cabeças.');
  const route = await estimateRoute(origin, destination);
  return json({ origin, destination, heads, ...route, quotes: quotesFor(route, heads) });
}

// Pedido de frete a uma transportadora parceira. O valor é recalculado aqui, nunca vem do navegador.
async function requestFreight(request, env) {
  const user = await requireUser(request, env);
  const body = await readBody(request);
  const origin = text(body.origin, 80);
  const destination = text(body.destination, 80);
  const heads = integer(body.heads, { min: 1, max: 5000 });
  const phone = text(body.phone, 30);
  const pickupDate = DATE_PATTERN.test(body.pickupDate || '') ? body.pickupDate : null;
  const partner = FREIGHT_PARTNERS.find((item) => item.id === body.partnerId);
  if (!origin || !destination || !heads || !partner) throw new HttpError(400, 'Revise origem, destino, cabeças e transportadora.');
  if (!phoneOk(phone)) throw new HttpError(400, 'Informe um telefone com DDD para a transportadora falar com você.');
  const route = await estimateRoute(origin, destination);
  const price = freightPrice(partner, route.distanceKm, heads);
  const cargoType = text(body.purpose, 40) || 'Bovinos';
  const created = await env.DB.prepare('INSERT INTO freight_requests (user_id, kind, origin, destination, cargo_type, heads, quantity, pickup_date, carrier, price, distance_km, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id')
    .bind(user.id, 'cotacao', origin, destination, cargoType, heads, `${heads} cabeças`, pickupDate, partner.name, price, route.distanceKm, phone, nowIso()).first();
  await notifyAdmins(env, { title: 'Novo pedido de frete', body: `${user.name}: ${heads} cabeças de ${origin} para ${destination}${pickupDate ? ` em ${pickupDate.split('-').reverse().join('/')}` : ''}.` });
  return json({ ok: true, id: created.id, price, distanceKm: route.distanceKm }, 201);
}

// Produtor pede espaço em uma volta vazia do Radar de Frete.
async function requestReturnFreight(request, env) {
  const user = await requireUser(request, env);
  const body = await readBody(request);
  const route = radarRoutes.find((item) => item.id === integer(body.routeId, { min: 1 }) && item.type === 'volta');
  if (!route) throw new HttpError(404, 'Volta não encontrada no Radar.');
  const cargoType = text(body.cargoType, 60);
  const quantity = text(body.quantity, 60);
  const phone = text(body.phone, 30);
  if (!cargoType || !phoneOk(phone)) throw new HttpError(400, 'Informe o tipo de carga e um telefone com DDD.');
  const created = await env.DB.prepare('INSERT INTO freight_requests (user_id, kind, route_id, origin, destination, cargo_type, quantity, carrier, price, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id')
    .bind(user.id, 'volta', route.id, route.origin, route.dest, cargoType, quantity || null, route.carrier, route.price || null, phone, nowIso()).first();
  await notifyAdmins(env, { title: 'Pedido de carga na volta', body: `${user.name} quer enviar ${cargoType}${quantity ? ` (${quantity})` : ''} na volta ${route.origin} → ${route.dest}.` });
  return json({ ok: true, id: created.id }, 201);
}

const requestView = (row) => ({ id: row.id, kind: row.kind, origin: row.origin, destination: row.destination, cargoType: row.cargo_type, heads: row.heads, quantity: row.quantity || '', pickupDate: row.pickup_date, carrier: row.carrier, price: row.price, distanceKm: row.distance_km, phone: row.phone, status: row.status, createdAt: row.created_at });
const tripView = (row) => ({ id: row.id, date: row.trip_date, time: row.trip_time || '', origin: row.origin, destination: row.destination, animals: row.animals, carrier: row.carrier || '', status: row.status });
const documentView = (row) => ({ id: row.id, type: row.doc_type, name: row.name, trip: row.trip_label || '', url: row.file_url, fileName: row.file_name, fileType: row.file_type || '', size: row.file_size, expiresAt: row.expires_at || '', notes: row.notes || '', status: row.status, createdAt: row.created_at });

async function myFreight(request, env) {
  const user = await requireUser(request, env);
  const [requests, trips, documents] = await Promise.all([
    env.DB.prepare('SELECT * FROM freight_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 200').bind(user.id).all(),
    env.DB.prepare('SELECT * FROM freight_trips WHERE user_id = ? ORDER BY trip_date, trip_time LIMIT 500').bind(user.id).all(),
    env.DB.prepare('SELECT * FROM freight_documents WHERE user_id = ? ORDER BY created_at DESC LIMIT 500').bind(user.id).all(),
  ]);
  return json({ requests: requests.results.map(requestView), trips: trips.results.map(tripView), documents: documents.results.map(documentView), returnRoutes: radarRoutes.filter((route) => route.type === 'volta').length });
}

function tripFields(body) {
  const date = DATE_PATTERN.test(body.date || '') ? body.date : null;
  const origin = text(body.origin, 80);
  const destination = text(body.destination, 80);
  if (!date || !origin || !destination) throw new HttpError(400, 'Informe data, origem e destino da viagem.');
  return { date, time: TIME_PATTERN.test(body.time || '') ? body.time : null, origin, destination, animals: integer(body.animals, { min: 1, max: 5000 }), carrier: text(body.carrier, 80) || null };
}

async function createTrip(request, env) {
  const user = await requireUser(request, env);
  const trip = tripFields(await readBody(request));
  const row = await env.DB.prepare('INSERT INTO freight_trips (user_id, trip_date, trip_time, origin, destination, animals, carrier, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *')
    .bind(user.id, trip.date, trip.time, trip.origin, trip.destination, trip.animals, trip.carrier, nowIso()).first();
  return json({ trip: tripView(row) }, 201);
}

async function updateTrip(request, env, { id }) {
  const user = await requireUser(request, env);
  const status = (await readBody(request)).status;
  if (!TRIP_STATUSES.includes(status)) throw new HttpError(400, 'Status inválido.');
  const row = await env.DB.prepare('UPDATE freight_trips SET status = ? WHERE id = ? AND user_id = ? RETURNING *').bind(status, integer(id, { min: 1 }), user.id).first();
  if (!row) throw new HttpError(404, 'Viagem não encontrada.');
  return json({ trip: tripView(row) });
}

async function deleteTrip(request, env, { id }) {
  const user = await requireUser(request, env);
  const result = await env.DB.prepare('DELETE FROM freight_trips WHERE id = ? AND user_id = ?').bind(integer(id, { min: 1 }), user.id).run();
  if (!result.meta.changes) throw new HttpError(404, 'Viagem não encontrada.');
  return json({ ok: true });
}

// O arquivo já foi enviado ao armazenamento privado da própria conta (POST /media?privado=1).
async function createDocument(request, env) {
  const user = await requireUser(request, env);
  const body = await readBody(request);
  const url = text(body.url, 400);
  if (!url.includes(`/media/private/${user.id}/`)) throw new HttpError(400, 'Envie o arquivo antes de registrar o documento.');
  const type = DOC_TYPES.includes(body.type) ? body.type : 'Outro';
  const fileName = text(body.fileName, 160) || 'documento';
  const row = await env.DB.prepare('INSERT INTO freight_documents (user_id, doc_type, name, trip_label, file_url, file_name, file_type, file_size, expires_at, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *')
    .bind(user.id, type, text(body.name, 120) || fileName.replace(/\.[^.]+$/, ''), text(body.trip, 160) || null, url, fileName, text(body.fileType, 80) || null, integer(body.size, { min: 0 }), DATE_PATTERN.test(body.expiresAt || '') ? body.expiresAt : null, text(body.notes, 500) || null, body.status === 'emitido' ? 'emitido' : 'pendente', nowIso()).first();
  return json({ document: documentView(row) }, 201);
}

async function updateDocument(request, env, { id }) {
  const user = await requireUser(request, env);
  const status = (await readBody(request)).status;
  if (!['pendente', 'emitido'].includes(status)) throw new HttpError(400, 'Status inválido.');
  const row = await env.DB.prepare('UPDATE freight_documents SET status = ? WHERE id = ? AND user_id = ? RETURNING *').bind(status, integer(id, { min: 1 }), user.id).first();
  if (!row) throw new HttpError(404, 'Documento não encontrado.');
  return json({ document: documentView(row) });
}

async function deleteDocument(request, env, { id }) {
  const user = await requireUser(request, env);
  const row = await env.DB.prepare('DELETE FROM freight_documents WHERE id = ? AND user_id = ? RETURNING file_url').bind(integer(id, { min: 1 }), user.id).first();
  if (!row) throw new HttpError(404, 'Documento não encontrado.');
  const key = row.file_url.split('/media/')[1];
  if (key) await env.MEDIA.delete(key);
  return json({ ok: true });
}

async function adminFreightRequests(request, env) {
  await requireAdmin(request, env);
  const rows = (await env.DB.prepare('SELECT f.*, u.name AS user_name, u.email AS user_email FROM freight_requests f JOIN users u ON u.id = f.user_id ORDER BY f.created_at DESC LIMIT 500').all()).results;
  return json({ requests: rows.map((row) => ({ ...requestView(row), route: `${row.origin} → ${row.destination}`, name: row.user_name, email: row.user_email })) });
}

async function updateFreightRequest(request, env, { id }) {
  await requireAdmin(request, env);
  const status = (await readBody(request)).status;
  if (!REQUEST_STATUSES.includes(status)) throw new HttpError(400, 'Status inválido.');
  const row = await env.DB.prepare('UPDATE freight_requests SET status = ? WHERE id = ? RETURNING *').bind(status, integer(id, { min: 1 })).first();
  if (!row) throw new HttpError(404, 'Pedido não encontrado.');
  if (status !== 'novo') {
    const labels = { contatado: 'A transportadora vai falar com você', fechado: 'Frete fechado', cancelado: 'Pedido de frete cancelado' };
    await notify(env, row.user_id, { type: 'truck', title: labels[status], body: `${row.origin} → ${row.destination} · ${row.carrier}.`, target: { page: 'freight' } });
  }
  return json({ ok: true });
}

export const freightRoutes = {
  'POST /freight/estimate': estimate,
  'POST /freight/requests': requestFreight,
  'POST /freight/return-requests': requestReturnFreight,
  'GET /me/freight': myFreight,
  'POST /me/freight/trips': createTrip,
  'PATCH /me/freight/trips/:id': updateTrip,
  'DELETE /me/freight/trips/:id': deleteTrip,
  'POST /me/freight/documents': createDocument,
  'PATCH /me/freight/documents/:id': updateDocument,
  'DELETE /me/freight/documents/:id': deleteDocument,
  'GET /admin/freight-requests': adminFreightRequests,
  'PATCH /admin/freight-requests/:id': updateFreightRequest,
};

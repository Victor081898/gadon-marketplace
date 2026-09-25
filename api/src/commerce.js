// Compra dentro da negociação: frete, pedido, pagamento protegido e conversas liberadas após o pagamento.
import { geocodeCity, geocodePlace } from './geo.js';
import { HttpError, integer, json, notify, nowIso, parseJson, readBody, requireUser, text } from './lib.js';
import { RADAR_DISCOUNT, haversineKm, radarOpportunities, radarRoutes, roadRoute } from './radar.js';

// Parceiros de frete ativos. Hoje existe um; novos parceiros entram nesta lista.
export const FREIGHT_PARTNERS = [{ id: 'boiadeiro', name: 'Transportadora Boiadeiro', base: 780, perKm: 3.65, perHead: 14 }];
export const freightPrice = (partner, distanceKm, heads) => Math.round(partner.base + distanceKm * partner.perKm + heads * partner.perHead);
const PAYMENT_METHODS = { pix: 'Pix', boleto: 'Boleto', cartao: 'Cartão de crédito' };
const PAID_STATUSES = new Set(['retido', 'liberado']);

// Provedor de pagamento. "simulado" confirma e retém o valor na hora; um provedor real entra aqui
// (criação da cobrança + webhook confirmando a retenção + liberação após o aceite).
const paymentProviders = {
  simulado: {
    async create(order) { return { status: 'retido', reference: `SIM-${order.id}` }; },
    async release() { return { status: 'liberado' }; },
  },
};
const paymentProvider = (env) => paymentProviders[env.PAYMENT_PROVIDER || 'simulado'] || paymentProviders.simulado;

async function loadLots(env, lotIds) {
  const ids = [...new Set((Array.isArray(lotIds) ? lotIds : []).map((id) => integer(id, { min: 1 })).filter(Boolean))].slice(0, 20);
  if (!ids.length) throw new HttpError(400, 'Escolha ao menos um lote.');
  const rows = (await env.DB.prepare(`SELECT * FROM lots WHERE id IN (${ids.map(() => '?').join(', ')})`).bind(...ids).all()).results;
  if (rows.length !== ids.length) throw new HttpError(404, 'Algum lote não foi encontrado.');
  return rows;
}

async function freightQuotes(env, user, lots, destination) {
  const to = await geocodePlace(destination);
  if (!to) throw new HttpError(400, 'Não encontramos esse destino. Informe como "Cidade - UF".');
  const legs = await Promise.all(lots.map(async (lot) => {
    const from = lot.lng === null ? await geocodeCity(lot.city, lot.state) : [lot.lng, lot.lat];
    if (!from) throw new HttpError(422, `Não foi possível localizar a origem do lote ${lot.name}.`);
    const road = await roadRoute(from, to);
    return road ? { distanceKm: road.distanceKm, hours: road.hours, real: true } : { distanceKm: haversineKm(from, to) * 1.3, hours: null, real: false };
  }));
  const distanceKm = Math.round(legs.reduce((sum, leg) => sum + leg.distanceKm, 0));
  const hours = legs.every((leg) => leg.hours) ? Math.round(Math.max(...legs.map((leg) => leg.hours)) * 10) / 10 : null;
  const quotes = FREIGHT_PARTNERS.map((partner) => ({ id: partner.id, partner: partner.name, label: 'Parceiro de frete GadOn', price: legs.reduce((sum, leg, index) => sum + freightPrice(partner, leg.distanceKm, lots[index].heads), 0), distanceKm, hours, real: legs.every((leg) => leg.real), promo: false }));
  if (lots.length === 1) {
    const [opportunity] = await radarOpportunities(env, user.id, lots[0].id);
    const route = opportunity && radarRoutes.find((item) => item.id === opportunity.routeId);
    const base = route && (quotes.find((quote) => quote.partner === route.carrier) || quotes[0]);
    if (base) quotes.push({ ...base, id: `radar-${route.id}`, label: `Retorno vazio pelo Radar de Frete (${route.origin} → ${route.dest})`, price: Math.round(base.price * (1 - RADAR_DISCOUNT)), promo: true });
  }
  return quotes.sort((a, b) => a.price - b.price);
}

async function quote(request, env) {
  const user = await requireUser(request, env);
  const body = await readBody(request);
  const destination = text(body.destination, 120);
  if (destination.length < 3) throw new HttpError(400, 'Informe o destino dos animais.');
  return json({ quotes: await freightQuotes(env, user, await loadLots(env, body.lotIds), destination) });
}

const orderCode = () => `GDN-${[...crypto.getRandomValues(new Uint8Array(4))].map((byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase()}`;

async function onOrderPaid(env, order) {
  const items = (await env.DB.prepare('SELECT i.*, l.name, l.farm_name FROM order_items i JOIN lots l ON l.id = i.lot_id WHERE i.order_id = ?').bind(order.id).all()).results;
  const sellers = [...new Set(items.map((item) => item.seller_id))];
  const method = PAYMENT_METHODS[order.payment_method] || order.payment_method;
  for (const sellerId of sellers) {
    const sellerItems = items.filter((item) => item.seller_id === sellerId);
    const created = await env.DB.prepare('INSERT INTO conversations (order_id, buyer_id, seller_id) VALUES (?, ?, ?) ON CONFLICT(order_id, seller_id) DO UPDATE SET updated_at = excluded.updated_at RETURNING id').bind(order.id, order.buyer_id, sellerId).first();
    await env.DB.prepare("INSERT INTO messages (conversation_id, kind, body) VALUES (?, 'sistema', ?)").bind(created.id, `Pagamento do pedido ${order.id} confirmado (${method}). O valor fica retido pela GadOn até a entrega e o aceite do comprador. Frete: ${order.freight_partner} → ${order.freight_destination}.`).run();
    await notify(env, sellerId, { type: 'message', title: 'Lote vendido', body: `${sellerItems.map((item) => item.name).join(', ')} · pedido ${order.id}. O pagamento está retido até a entrega e o aceite.`, target: { page: 'messages', conversationId: created.id } });
    if (sellerId === sellers[0]) await notify(env, order.buyer_id, { type: 'message', title: 'Pagamento confirmado', body: `Pedido ${order.id}: a conversa com a ${sellerItems[0].farm_name} está liberada.`, target: { page: 'messages', conversationId: created.id } });
  }
}

async function createOrder(request, env) {
  const buyer = await requireUser(request, env);
  const body = await readBody(request);
  const lots = await loadLots(env, body.lotIds);
  if (lots.some((lot) => lot.seller_id === buyer.id)) throw new HttpError(409, 'Você não pode comprar o seu próprio lote.');
  if (lots.some((lot) => lot.status !== 'publicado')) throw new HttpError(409, 'Algum lote não está mais disponível.');
  const destination = text(body.destination, 120);
  const method = PAYMENT_METHODS[body.paymentMethod] ? body.paymentMethod : null;
  if (!method) throw new HttpError(400, 'Escolha a forma de pagamento.');
  const selected = (await freightQuotes(env, buyer, lots, destination)).find((item) => item.id === body.freightOptionId);
  if (!selected) throw new HttpError(409, 'A cotação de frete mudou. Calcule o frete novamente.');
  // Lotes de demonstração só podem ser "comprados" enquanto o pagamento for simulado e continuam anunciados.
  if (lots.some((lot) => lot.is_demo) && (env.PAYMENT_PROVIDER || 'simulado') !== 'simulado') throw new HttpError(409, 'Lotes de demonstração não podem ser comprados.');
  // Reserva os lotes reais antes de cobrar (evita dois compradores no mesmo lote).
  const ids = lots.filter((lot) => !lot.is_demo).map((lot) => lot.id);
  const reserved = ids.length ? await env.DB.prepare(`UPDATE lots SET status = 'vendido', updated_at = ? WHERE status = 'publicado' AND id IN (${ids.map(() => '?').join(', ')})`).bind(nowIso(), ...ids).run() : { meta: { changes: 0 } };
  if (reserved.meta.changes !== ids.length) {
    await env.DB.prepare(`UPDATE lots SET status = 'publicado' WHERE status = 'vendido' AND id IN (${ids.map(() => '?').join(', ')}) AND id NOT IN (SELECT lot_id FROM order_items)`).bind(...ids).run();
    throw new HttpError(409, 'Algum lote acabou de ser vendido para outra pessoa.');
  }
  const lotsTotal = lots.reduce((sum, lot) => sum + lot.heads * lot.price_per_head, 0);
  const order = { id: orderCode(), buyer_id: buyer.id, lots_total: lotsTotal, freight_partner: selected.partner, freight_price: selected.price, freight_destination: destination, freight_distance_km: selected.distanceKm, freight_promo: selected.promo ? 1 : 0, total: lotsTotal + selected.price, payment_method: method, payment_provider: env.PAYMENT_PROVIDER || 'simulado' };
  const payment = await paymentProvider(env).create(order, env);
  Object.assign(order, { payment_status: payment.status, payment_reference: payment.reference, paid_at: PAID_STATUSES.has(payment.status) ? nowIso() : null });
  const keys = Object.keys(order);
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO orders (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).bind(...Object.values(order)),
    ...lots.map((lot) => env.DB.prepare('INSERT INTO order_items (order_id, lot_id, seller_id, price) VALUES (?, ?, ?, ?)').bind(order.id, lot.id, lot.seller_id, lot.heads * lot.price_per_head)),
  ]);
  if (PAID_STATUSES.has(order.payment_status)) await onOrderPaid(env, order);
  const firstConversation = await env.DB.prepare('SELECT id FROM conversations WHERE order_id = ? ORDER BY id LIMIT 1').bind(order.id).first();
  return json({ order: await orderView(env, order.id, buyer.id), conversationId: firstConversation?.id || null, checkout: payment.checkout || null }, 201);
}

async function orderView(env, orderId, viewerId) {
  const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
  const items = (await env.DB.prepare('SELECT i.lot_id, i.seller_id, i.price, l.name, l.farm_name, l.city, l.state, l.heads, l.photos FROM order_items i JOIN lots l ON l.id = i.lot_id WHERE i.order_id = ?').bind(orderId).all()).results;
  const role = order.buyer_id === viewerId ? 'comprador' : 'vendedor';
  const visibleItems = role === 'comprador' ? items : items.filter((item) => item.seller_id === viewerId);
  return {
    id: order.id, role, lots: visibleItems.map((item) => ({ id: item.lot_id, name: item.name, farm: item.farm_name, place: `${item.city} - ${item.state}`, heads: item.heads, price: item.price, photo: parseJson(item.photos, [])[0] || '' })),
    farm: [...new Set(visibleItems.map((item) => item.farm_name))].join(', '), heads: visibleItems.reduce((sum, item) => sum + item.heads, 0), origin: [...new Set(visibleItems.map((item) => `${item.city} - ${item.state}`))].join(', '), lotsTotal: order.lots_total,
    freight: { partner: order.freight_partner, price: order.freight_price, destination: order.freight_destination, distanceKm: order.freight_distance_km, promo: Boolean(order.freight_promo) },
    total: order.total, payment: { method: PAYMENT_METHODS[order.payment_method] || order.payment_method, status: order.payment_status, provider: order.payment_provider },
    gta: order.gta_status, createdAt: order.created_at, paidAt: order.paid_at, releasedAt: order.released_at,
  };
}

async function listOrders(request, env) {
  const user = await requireUser(request, env);
  const rows = (await env.DB.prepare('SELECT DISTINCT o.id, o.created_at FROM orders o LEFT JOIN order_items i ON i.order_id = o.id WHERE o.buyer_id = ? OR i.seller_id = ? ORDER BY o.created_at DESC LIMIT 100').bind(user.id, user.id).all()).results;
  return json({ orders: await Promise.all(rows.map((row) => orderView(env, row.id, user.id))) });
}

async function acceptDelivery(request, env, { id }) {
  const buyer = await requireUser(request, env);
  const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(text(id, 20)).first();
  if (!order || order.buyer_id !== buyer.id) throw new HttpError(404, 'Pedido não encontrado.');
  if (order.payment_status !== 'retido') throw new HttpError(409, 'Este pedido não tem pagamento retido para liberar.');
  await paymentProvider(env).release(order, env);
  await env.DB.prepare("UPDATE orders SET payment_status = 'liberado', released_at = ? WHERE id = ?").bind(nowIso(), order.id).run();
  const conversations = (await env.DB.prepare('SELECT * FROM conversations WHERE order_id = ?').bind(order.id).all()).results;
  for (const conversation of conversations) {
    await env.DB.prepare("INSERT INTO messages (conversation_id, kind, body) VALUES (?, 'sistema', ?)").bind(conversation.id, `Entrega aceita pelo comprador. Pagamento do pedido ${order.id} liberado.`).run();
    await env.DB.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?').bind(nowIso(), conversation.id).run();
    await notify(env, conversation.seller_id, { type: 'message', title: 'Pagamento liberado', body: `O comprador confirmou a entrega do pedido ${order.id}.`, target: { page: 'messages', conversationId: conversation.id } });
  }
  return json({ order: await orderView(env, order.id, buyer.id) });
}

// ---------- Conversas ----------
async function participantConversation(env, user, id) {
  const conversation = await env.DB.prepare('SELECT c.*, o.payment_status FROM conversations c JOIN orders o ON o.id = c.order_id WHERE c.id = ?').bind(integer(id, { min: 1 })).first();
  if (!conversation || (conversation.buyer_id !== user.id && conversation.seller_id !== user.id)) throw new HttpError(404, 'Conversa não encontrada.');
  return conversation;
}

async function listConversations(request, env) {
  const user = await requireUser(request, env);
  const rows = (await env.DB.prepare(`SELECT c.*, o.payment_status, o.total, o.payment_method,
      buyer.name AS buyer_name,
      (SELECT l.farm_name FROM order_items i JOIN lots l ON l.id = i.lot_id WHERE i.order_id = c.order_id AND i.seller_id = c.seller_id LIMIT 1) AS farm_name,
      (SELECT group_concat(l.name, ', ') FROM order_items i JOIN lots l ON l.id = i.lot_id WHERE i.order_id = c.order_id AND i.seller_id = c.seller_id) AS lot_names,
      (SELECT i.lot_id FROM order_items i WHERE i.order_id = c.order_id AND i.seller_id = c.seller_id LIMIT 1) AS lot_id,
      (SELECT m.body FROM messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) AS last_message,
      (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.id > CASE WHEN c.buyer_id = ?1 THEN c.buyer_last_read ELSE c.seller_last_read END AND (m.sender_id IS NULL OR m.sender_id != ?1)) AS unread
    FROM conversations c JOIN orders o ON o.id = c.order_id JOIN users buyer ON buyer.id = c.buyer_id
    WHERE c.buyer_id = ?1 OR c.seller_id = ?1 ORDER BY c.updated_at DESC LIMIT 100`).bind(user.id).all()).results;
  return json({ conversations: rows.map((row) => {
    const asBuyer = row.buyer_id === user.id;
    return { id: row.id, orderId: row.order_id, lotId: row.lot_id, role: asBuyer ? 'comprador' : 'vendedor', name: asBuyer ? row.farm_name : row.buyer_name, subtitle: `${asBuyer ? 'Fazenda' : 'Comprador'} · ${row.lot_names}`, lastMessage: row.last_message || '', unread: row.unread, updatedAt: row.updated_at, payment: { status: row.payment_status, amount: row.total, method: PAYMENT_METHODS[row.payment_method] || row.payment_method } };
  }) });
}

async function listMessages(request, env, { id }) {
  const user = await requireUser(request, env);
  const conversation = await participantConversation(env, user, id);
  const rows = (await env.DB.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY id ASC LIMIT 500').bind(conversation.id).all()).results;
  const lastId = rows.length ? rows[rows.length - 1].id : 0;
  await env.DB.prepare(`UPDATE conversations SET ${conversation.buyer_id === user.id ? 'buyer_last_read' : 'seller_last_read'} = ? WHERE id = ?`).bind(lastId, conversation.id).run();
  return json({ messages: rows.map((row) => ({ id: row.id, from: row.sender_id === null ? 'system' : row.sender_id === user.id ? 'me' : 'them', kind: row.kind, body: row.body, attachment: parseJson(row.attachment, null), createdAt: row.created_at })) });
}

async function sendMessage(request, env, { id }) {
  const user = await requireUser(request, env);
  const conversation = await participantConversation(env, user, id);
  if (!PAID_STATUSES.has(conversation.payment_status)) throw new HttpError(403, 'A conversa é liberada depois da confirmação do pagamento.');
  const body = await readBody(request);
  const kind = ['texto', 'anexo', 'audio'].includes(body.kind) ? body.kind : 'texto';
  const message = text(body.body, 2000);
  const attachment = body.attachment && typeof body.attachment.url === 'string' && body.attachment.url.includes('/media/') ? { url: text(body.attachment.url, 300), name: text(body.attachment.name, 120), type: text(body.attachment.type, 80), size: integer(body.attachment.size) } : null;
  if (!message && !attachment) throw new HttpError(400, 'Escreva uma mensagem.');
  const previous = await env.DB.prepare('SELECT MAX(id) AS id FROM messages WHERE conversation_id = ?').bind(conversation.id).first();
  const result = await env.DB.prepare('INSERT INTO messages (conversation_id, sender_id, kind, body, attachment) VALUES (?, ?, ?, ?, ?)').bind(conversation.id, user.id, kind, message || attachment?.name || 'Anexo', attachment ? JSON.stringify(attachment) : null).run();
  const asBuyer = conversation.buyer_id === user.id;
  await env.DB.prepare(`UPDATE conversations SET updated_at = ?, ${asBuyer ? 'buyer_last_read' : 'seller_last_read'} = ? WHERE id = ?`).bind(nowIso(), result.meta.last_row_id, conversation.id).run();
  // Avisa a outra parte só quando ela já tinha lido tudo (evita uma notificação por mensagem).
  const counterpartRead = asBuyer ? conversation.seller_last_read : conversation.buyer_last_read;
  if (!previous?.id || counterpartRead >= previous.id) await notify(env, asBuyer ? conversation.seller_id : conversation.buyer_id, { type: 'message', title: 'Nova mensagem', body: `${user.name.split(' ')[0]}: ${(message || 'enviou um anexo').slice(0, 120)}`, target: { page: 'messages', conversationId: conversation.id } });
  return json({ message: { id: result.meta.last_row_id, from: 'me', kind, body: message || attachment?.name || 'Anexo', attachment, createdAt: nowIso() } }, 201);
}

export const commerceRoutes = {
  'POST /freight/quote': quote,
  'POST /orders': createOrder,
  'GET /orders': listOrders,
  'POST /orders/:id/accept': acceptDelivery,
  'GET /conversations': listConversations,
  'GET /conversations/:id/messages': listMessages,
  'POST /conversations/:id/messages': sendMessage,
};

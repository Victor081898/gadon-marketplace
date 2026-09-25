// Radar de Frete: rotas previstas e oportunidades de retorno vazio perto da fazenda do lote visto.
import { json, notify, nowIso, requireUser } from './lib.js';

export const RADAR_WINDOW_MS = 48 * 60 * 60 * 1000;
export const RADAR_RADIUS_KM = 30;
export const RADAR_DISCOUNT = 0.3;

// Previsões de viagem do parceiro de frete. Enquanto não há integração com o parceiro, ficam configuradas aqui.
export const radarRoutes = [
  { id: 1, type: 'ida', origin: 'Campo Verde - MT', dest: 'Goiânia - GO', from: [-55.16, -15.55], to: [-49.25, -16.68], carrier: 'Transportadora Boiadeiro', cargo: '80 cabeças · Nelore', departs: 'Hoje · 06:20', status: 'Em trânsito', progress: 0.45 },
  { id: 2, type: 'ida', origin: 'Dourados - MS', dest: 'São Paulo - SP', from: [-54.81, -22.22], to: [-46.63, -23.55], carrier: 'Transportadora Boiadeiro', cargo: '50 cabeças · Angus', departs: 'Hoje · 08:00', status: 'Em trânsito', progress: 0.2 },
  { id: 3, type: 'ida', origin: 'Rondonópolis - MT', dest: 'Campo Grande - MS', from: [-54.64, -16.47], to: [-54.65, -20.47], carrier: 'Transportadora Boiadeiro', cargo: '40 bezerros', departs: 'Hoje · 07:30', status: 'Em trânsito', progress: 0.68 },
  { id: 4, type: 'volta', origin: 'Goiânia - GO', dest: 'Campo Grande - MS', from: [-49.25, -16.68], to: [-54.65, -20.47], carrier: 'Transportadora Boiadeiro', cargo: 'Volta vazio · espaço para 80 cabeças', departs: 'Hoje · 18:30', status: 'Retorno vazio previsto', price: 3850 },
  { id: 5, type: 'volta', origin: 'Primavera do Leste - MT', dest: 'Cuiabá - MT', from: [-54.3, -15.56], to: [-56.1, -15.6], carrier: 'Transportadora Boiadeiro', cargo: 'Volta vazio · espaço para 60 cabeças', departs: 'Amanhã · 05:00', status: 'Retorno vazio previsto', price: 1450 },
  { id: 6, type: 'volta', origin: 'São Paulo - SP', dest: 'Dourados - MS', from: [-46.63, -23.55], to: [-54.81, -22.22], carrier: 'Transportadora Boiadeiro', cargo: 'Volta vazio · espaço para 55 cabeças', departs: 'Amanhã · 09:30', status: 'Retorno vazio previsto', price: 4210 },
];

export function haversineKm([lng1, lat1], [lng2, lat2]) {
  const rad = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * rad) / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lng2 - lng1) * rad) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Geometria rodoviária (OSRM) com cache de 1 dia na borda.
export async function roadRoute(from, to) {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=geojson`;
  const cache = caches.default;
  const cacheKey = new Request(url);
  let response = await cache.match(cacheKey);
  if (!response) {
    response = await fetch(url, { headers: { 'User-Agent': 'GadOn/1.0 (contato@gadon.com.br)' } });
    if (!response.ok) return null;
    response = new Response(response.body, response);
    response.headers.set('Cache-Control', 'public, max-age=86400');
    await cache.put(cacheKey, response.clone());
  }
  const data = await response.json().catch(() => null);
  const road = data?.routes?.[0];
  return road ? { points: road.geometry.coordinates, distanceKm: road.distance / 1000, hours: road.duration / 3600 } : null;
}

const distanceToRouteKm = (point, points) => points.reduce((min, routePoint) => Math.min(min, haversineKm(point, routePoint)), Infinity);

// Oportunidades para os lotes vistos pelo usuário nas últimas 48 h.
export async function radarOpportunities(env, userId, onlyLotId = null) {
  const since = new Date(Date.now() - RADAR_WINDOW_MS).toISOString();
  const views = (await env.DB.prepare(`SELECT v.lot_id, v.viewed_at, l.lat, l.lng FROM lot_views v JOIN lots l ON l.id = v.lot_id
    WHERE v.user_id = ? AND v.viewed_at >= ? AND l.status = 'publicado' AND l.lat IS NOT NULL ${onlyLotId ? 'AND v.lot_id = ?' : ''}`).bind(...[userId, since, onlyLotId].filter((value) => value !== null)).all()).results;
  if (!views.length) return [];
  const returns = radarRoutes.filter((route) => route.type === 'volta');
  const geometries = await Promise.all(returns.map((route) => roadRoute(route.from, route.to)));
  const opportunities = [];
  views.forEach((view) => returns.forEach((route, index) => {
    const points = geometries[index]?.points;
    if (!points) return;
    const km = distanceToRouteKm([view.lng, view.lat], points);
    if (km <= RADAR_RADIUS_KM) opportunities.push({ lotId: view.lot_id, routeId: route.id, km: Math.round(km), viewedAt: view.viewed_at, expiresAt: new Date(new Date(view.viewed_at).getTime() + RADAR_WINDOW_MS).toISOString() });
  }));
  return opportunities.sort((a, b) => a.km - b.km);
}

// Registra a visualização do anúncio e avisa (uma vez por lote + rota) quando há retorno vazio perto da fazenda.
export async function recordView(env, user, lot) {
  await env.DB.prepare('INSERT INTO lot_views (user_id, lot_id, viewed_at) VALUES (?, ?, ?) ON CONFLICT(user_id, lot_id) DO UPDATE SET viewed_at = excluded.viewed_at').bind(user.id, lot.id, nowIso()).run();
  const opportunities = await radarOpportunities(env, user.id, lot.id);
  const fresh = [];
  for (const item of opportunities) {
    const inserted = await env.DB.prepare('INSERT OR IGNORE INTO radar_notified (user_id, lot_id, route_id) VALUES (?, ?, ?)').bind(user.id, item.lotId, item.routeId).run();
    if (!inserted.meta.changes) continue;
    const route = radarRoutes.find((entry) => entry.id === item.routeId);
    const distance = item.km < 1 ? 'menos de 1 km' : `${item.km} km`;
    await notify(env, user.id, { type: 'truck', title: 'Radar de Frete: retorno vazio perto da fazenda', body: `Caminhão da ${route.carrier} volta vazio de ${route.origin} para ${route.dest} (${route.departs.toLowerCase()}) e passa a ${distance} da ${lot.farm_name}. Frete com 30% de desconto no lote ${lot.name}.`, target: { page: 'radar', lotId: lot.id } });
    fresh.push(item);
  }
  return fresh;
}

async function radar(request, env) {
  const user = await requireUser(request, env);
  return json({ routes: radarRoutes, radiusKm: RADAR_RADIUS_KM, windowHours: RADAR_WINDOW_MS / 3600000, opportunities: await radarOpportunities(env, user.id) });
}

export const radarRoutesApi = { 'GET /radar': radar };

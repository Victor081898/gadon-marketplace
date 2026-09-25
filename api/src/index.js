// API do GadOn (api.gadon.com.br): roteamento, CORS, limites de tentativas e tratamento de erros.
import { accountRoutes } from './account.js';
import { authRoutes } from './auth.js';
import { commerceRoutes } from './commerce.js';
import { freightRoutes } from './freight.js';
import { HttpError, corsHeaders, json } from './lib.js';
import { lotRoutes } from './lots.js';
import { radarRoutesApi } from './radar.js';

const routes = Object.entries({
  'GET /health': () => json({ ok: true, service: 'gadon-api' }),
  ...authRoutes,
  ...lotRoutes,
  ...commerceRoutes,
  ...freightRoutes,
  ...accountRoutes,
  ...radarRoutesApi,
}).map(([key, handler]) => {
  const [method, path] = key.split(' ');
  const names = [];
  const source = path.replace(/\/:(\w+)/g, (_, name) => { names.push(name); return '/([^/]+)'; }).replace(/\/\*(\w+)/g, (_, name) => { names.push(name); return '/(.+)'; });
  return { method, pattern: new RegExp(`^${source}$`), names, handler };
});

// Rotas públicas sensíveis a abuso (login, cadastro, pré-cadastro, perguntas) têm limite por IP.
const LIMITED = /^\/(auth\/(login|register|google|forgot|reset)|pre-cadastro|lots\/\d+\/questions|freight\/(estimate|requests|return-requests))$/;

function match(method, pathname) {
  for (const route of routes) {
    if (route.method !== method) continue;
    const found = route.pattern.exec(pathname);
    if (found) return { handler: route.handler, params: Object.fromEntries(route.names.map((name, index) => [name, decodeURIComponent(found[index + 1])])) };
  }
  return null;
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const { pathname } = new URL(request.url);
    const route = match(request.method, pathname);
    let response;
    try {
      if (!route) throw new HttpError(404, 'Rota não encontrada.');
      if (request.method === 'POST' && LIMITED.test(pathname)) {
        const { success } = await env.AUTH_LIMITER.limit({ key: `${request.headers.get('CF-Connecting-IP') || 'anon'}:${pathname}` });
        if (!success) throw new HttpError(429, 'Muitas tentativas. Aguarde um minuto e tente novamente.');
      }
      response = await route.handler(request, env, route.params);
    } catch (error) {
      if (!(error instanceof HttpError)) console.error('Erro inesperado na API', error);
      response = error instanceof HttpError ? json({ error: error.message }, error.status) : json({ error: 'Erro interno. Tente novamente em instantes.' }, 500);
    }
    const headers = new Headers(response.headers);
    Object.entries(cors).forEach(([key, value]) => headers.set(key, value));
    return new Response(response.body, { status: response.status, headers });
  },
};

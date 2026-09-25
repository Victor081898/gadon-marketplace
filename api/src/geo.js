// Localização de municípios brasileiros (Nominatim/OpenStreetMap) com cache de 30 dias na borda.
export const UF_NAMES = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco',
  PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
  SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
};

async function nominatim(params) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&${new URLSearchParams(params)}`;
  const cache = caches.default;
  const cacheKey = new Request(url);
  let response = await cache.match(cacheKey);
  if (!response) {
    try { response = await fetch(url, { headers: { 'User-Agent': 'GadOn/1.0 (contato@gadon.com.br)' } }); } catch { return null; }
    if (!response.ok) return null;
    response = new Response(response.body, response);
    response.headers.set('Cache-Control', 'public, max-age=2592000');
    await cache.put(cacheKey, response.clone());
  }
  const [hit] = await response.json().catch(() => []);
  return hit ? [Number(hit.lon), Number(hit.lat)] : null;
}

// "Goiânia - GO", "Goiânia, GO", "Goiânia/GO" → { city, uf }
export function parsePlace(value) {
  const match = String(value || '').trim().match(/^(.+?)\s*[-,/]\s*([A-Za-z]{2})$/);
  const uf = match?.[2].toUpperCase();
  return match && UF_NAMES[uf] ? { city: match[1].trim(), uf } : null;
}

// Busca estruturada por município: evita confundir a cidade com ruas homônimas ("Avenida Goiânia").
export async function geocodeCity(city, uf) {
  return nominatim({ city, state: UF_NAMES[uf] || uf, country: 'Brasil' });
}

export async function geocodePlace(value) {
  const place = parsePlace(value);
  return (place && await geocodeCity(place.city, place.uf)) || nominatim({ q: `${value}, Brasil` });
}

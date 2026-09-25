import './styles.css';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

maplibregl.setWorkerUrl(maplibreWorkerUrl);

const formatBRL = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
// Preço total = cabeças × preço por cabeça. `seller` é o nome da fazenda; do proprietário só se exibe o primeiro nome.
const withLotPricing = (lot) => ({ ...lot, price: formatBRL(lot.heads * lot.pricePerHead), unit: `${formatBRL(lot.pricePerHead)} / cabeça` });
// Lotes publicados vêm da API (GET /lots) e são convertidos para o formato usado pelas telas.
let lots = [];
const lotCache = {};
const mediaUrl = (path) => (typeof path === 'string' && path.startsWith('/media/') ? `${API_URL}${path}` : path);
const lotAccents = { Nelore: 'blue', Angus: 'orange', Cruza: 'purple', Bezerros: 'blue', Outros: 'orange' };
const sexWords = { Machos: 'machos', 'Fêmeas': 'fêmeas', Misto: 'animais' };
function toViewLot(lot) {
  const photos = (lot.photos || []).map(mediaUrl);
  return withLotPricing({ ...lot, seller: lot.farm, weight: lot.weight || 0, meta: `${lot.heads} ${sexWords[lot.sex] || 'animais'}${lot.weight ? ` · ${String(lot.weight).replace('.', ',')}@` : ''}`, image: photos[0] || '/nelore-cadastro.png', gallery: photos, accent: lotAccents[lot.category] || 'green' });
}
const findLotById = (id) => lots.find((lot) => lot.id === Number(id)) || lotCache[Number(id)];


const auctionLots = [
  { id: 1, name: 'Nelore PO Elite', tag: 'LOTE 01', desc: '45 machos · 20@ média · Genética avaliada', place: 'Campo Verde - MT', seller: 'Fazenda Santa Rita', startBid: 92000, increment: 1000, image: '/home-hero-nelore.png',
    cameras: [{ type: 'video', src: '/videos/lote-nelore.mp4' }, { type: 'image', src: '/home-hero-nelore.png' }, { type: 'image', src: '/nelore-cadastro.png' }],
    ficha: { 'Raça': 'Nelore PO', 'Categoria': '45 machos', 'Peso médio': '20@ (≈600 kg)', 'Idade': '24 a 30 meses', 'Procedência': 'Fazenda Santa Rita · Campo Verde/MT', 'Vacinação': 'Em dia · aftosa e clostridiose', 'GTA': 'Emitida para o leilão', 'Regime': 'Pasto + suplementação mineral', 'Avaliação genética': 'Deca 1 · sumário ANCP' } },
  { id: 2, name: 'Matrizes Angus Prenhes', tag: 'LOTE 02', desc: '30 fêmeas prenhes · 16@ média · Prenhez confirmada', place: 'Dourados - MS', seller: 'Agro Boa Vista', startBid: 78000, increment: 1000, image: 'https://images.unsplash.com/photo-1662486750674-5cba308b8dab?auto=format&fit=crop&w=1200&q=85',
    cameras: [{ type: 'video', src: '/videos/lote-matrizes.mp4' }, { type: 'image', src: 'https://images.unsplash.com/photo-1662486750674-5cba308b8dab?auto=format&fit=crop&w=1200&q=85' }, { type: 'image', src: 'https://images.unsplash.com/photo-1554145707-80e42bdaaa4a?auto=format&fit=crop&w=1200&q=85' }],
    ficha: { 'Raça': 'Angus', 'Categoria': '30 fêmeas prenhes', 'Peso médio': '16@ (≈480 kg)', 'Idade': '30 a 36 meses', 'Prenhez': 'Confirmada por ultrassom', 'Procedência': 'Agro Boa Vista · Dourados/MS', 'Vacinação': 'Em dia · aftosa e brucelose', 'GTA': 'Emitida para o leilão', 'Regime': 'Pasto rotacionado' } },
  { id: 3, name: 'Touro Nelore Reprodutor', tag: 'LOTE 03', desc: '1 touro PO · 32@ · Registro e avaliação genética', place: 'Rondonópolis - MT', seller: 'Fazenda Horizonte', startBid: 46000, increment: 500, image: '/nelore-cadastro.png',
    cameras: [{ type: 'video', src: '/videos/lote-touro.mp4' }, { type: 'image', src: '/nelore-cadastro.png' }, { type: 'image', src: '/home-hero-nelore.png' }],
    ficha: { 'Raça': 'Nelore PO', 'Categoria': 'Touro reprodutor', 'Peso': '32@ (≈960 kg)', 'Idade': '48 meses', 'Registro': 'RGD definitivo ABCZ', 'Procedência': 'Fazenda Horizonte · Rondonópolis/MT', 'Exame andrológico': 'Aprovado (últimos 60 dias)', 'Vacinação': 'Em dia', 'Avaliação genética': 'TOP 3% · sumário ANCP' } },
  { id: 4, name: 'Bezerros Desmama Premium', tag: 'LOTE 04', desc: '60 machos · 9@ média · Desmame recente', place: 'Goiânia - GO', seller: 'Fazenda São Miguel', startBid: 54000, increment: 500, image: 'https://images.unsplash.com/photo-1661562862223-ff3e853feafb?auto=format&fit=crop&w=1200&q=85',
    cameras: [{ type: 'video', src: '/videos/lote-bezerros.mp4' }, { type: 'image', src: 'https://images.unsplash.com/photo-1661562862223-ff3e853feafb?auto=format&fit=crop&w=1200&q=85' }, { type: 'image', src: 'https://images.unsplash.com/photo-1554145707-80e42bdaaa4a?auto=format&fit=crop&w=1200&q=85' }],
    ficha: { 'Raça': 'Nelore', 'Categoria': '60 machos desmamados', 'Peso médio': '9@ (≈270 kg)', 'Idade': '10 a 12 meses', 'Procedência': 'Fazenda São Miguel · Goiânia/GO', 'Vacinação': 'Protocolo completo de desmama', 'GTA': 'Emitida para o leilão', 'Regime': 'Creep feeding até a desmama' } },
];
const auctionCameraLabels = ['CAM 01 · Ao vivo', 'CAM 02 · Pista', 'CAM 03 · Detalhe'];
function ensureAuctionFeedPlays() {
  const video = document.querySelector('#auction-cam video');
  if (!video) return;
  if (userAuctionStream && currentAuctionLot().live && !video.srcObject) video.srcObject = userAuctionStream;
  video.muted = true;
  video.onpause = () => { if (video.isConnected && state.page === 'auction') video.play().catch(() => { /* autoplay bloqueado */ }); };
  const playing = video.play();
  if (playing) playing.catch(() => { /* autoplay bloqueado pelo navegador */ });
}

const auctionFeedMarkup = (lot, index) => {
  const camera = lot.cameras[index % lot.cameras.length];
  if (camera.type === 'live') return `<video class="cam-feed cam-live ${userBroadcastFacing === 'user' ? 'is-mirrored' : ''}" autoplay muted playsinline></video>`;
  if (camera.type === 'video') return `<video class="cam-feed" src="${camera.src}" autoplay muted loop playsinline></video>`;
  return `<img class="cam-feed" src="${camera.src}" alt="${escapeHtml(lot.name)} ao vivo" />`;
};
const auctionBotNames = ['Fazenda Ouro Branco', 'Agro Sete Lagoas', 'Pecuária JLM', 'Haras Boa Sorte', 'Grupo Taboado', 'Fazenda Três Irmãos'];

const shopProducts = [
  { id: 1, category: 'Rações & Nutrição', name: 'Ração Engorda Premium 40kg', unit: 'saco 40kg', price: 189, image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=700&q=80', badge: 'Mais vendido' },
  { id: 2, category: 'Rações & Nutrição', name: 'Sal Mineral Bovino 25kg', unit: 'saco 25kg', price: 96, image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=700&q=80' },
  { id: 3, category: 'Rações & Nutrição', name: 'Ração Bezerro Desmama 30kg', unit: 'saco 30kg', price: 148, image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=80' },
  { id: 4, category: 'Rações & Nutrição', name: 'Suplemento Proteico Seca 30kg', unit: 'saco 30kg', price: 132, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=700&q=80' },
  { id: 5, category: 'Sementes & Plantio', name: 'Semente Brachiaria Brizantha 20kg', unit: 'saco 20kg', price: 420, image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=80', badge: 'Alta procura' },
  { id: 6, category: 'Sementes & Plantio', name: 'Semente Milho Silagem 60mil', unit: 'saco 60 mil sementes', price: 890, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80' },
  { id: 7, category: 'Sementes & Plantio', name: 'Capim Mombaça 15kg', unit: 'saco 15kg', price: 385, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80' },
  { id: 8, category: 'Terras & Fazendas', name: 'Fazenda 520 hectares', unit: 'Campo Verde - MT · dupla aptidão', price: 18200000, land: true, image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=700&q=80', badge: 'Oportunidade' },
  { id: 9, category: 'Terras & Fazendas', name: 'Sítio 85 hectares', unit: 'Jaciara - MT · pasto formado', price: 3400000, land: true, image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=700&q=80' },
  { id: 10, category: 'Terras & Fazendas', name: 'Arrendamento 300 ha/ano', unit: 'Rio Verde - GO · lavoura', price: 540000, land: true, image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=700&q=80' },
  { id: 11, category: 'Equipamentos', name: 'Balança Digital Bovinos 2t', unit: 'unidade', price: 4890, image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=700&q=80' },
  { id: 12, category: 'Equipamentos', name: 'Kit Cerca Elétrica 5km', unit: 'kit completo', price: 1290, image: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=700&q=80' },
  { id: 13, category: 'Equipamentos', name: 'Brinco Eletrônico c/ 100un', unit: 'caixa 100 unidades', price: 780, image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=700&q=80' },
  { id: 14, category: 'Queijos & Laticínios', name: 'Queijo Minas Artesanal 1kg', unit: 'peça 1kg', price: 68, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80', badge: 'Produtor local' },
  { id: 15, category: 'Queijos & Laticínios', name: 'Leite Fresco da Fazenda 10L', unit: 'galão 10L', price: 55, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80' },
  { id: 16, category: 'Queijos & Laticínios', name: 'Manteiga de Leite Cru 500g', unit: 'pote 500g', price: 38, image: 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?auto=format&fit=crop&w=700&q=80' },
  { id: 17, category: 'Mel & Doces', name: 'Mel Silvestre Puro 1kg', unit: 'pote 1kg', price: 48, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=700&q=80', badge: 'Produtor local' },
  { id: 18, category: 'Mel & Doces', name: 'Doce de Leite Caseiro 800g', unit: 'pote 800g', price: 32, image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=700&q=80' },
];
const shopCategories = ['Todos', 'Rações & Nutrição', 'Sementes & Plantio', 'Queijos & Laticínios', 'Mel & Doces', 'Terras & Fazendas', 'Equipamentos'];
const haversineKm = ([lng1, lat1], [lng2, lat2]) => {
  const rad = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * rad) / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lng2 - lng1) * rad) / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};
const routeArc = (from, to, curvature = 0.18) => {
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;
  const controlX = midX - (to[1] - from[1]) * curvature;
  const controlY = midY + (to[0] - from[0]) * curvature;
  return Array.from({ length: 49 }, (_, i) => {
    const t = i / 48;
    const a = 1 - t;
    return [a * a * from[0] + 2 * a * t * controlX + t * t * to[0], a * a * from[1] + 2 * a * t * controlY + t * t * to[1]];
  });
};
const nowTime = () => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());

const icon = (name, size = 18) => {
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/>',
    cow: '<path d="M5 10c0-2 2-3 4-3h4c2 0 4 1 4 3v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z"/><path d="M7 7 5 4m12 3 2-3M9 18v3m6-3v3m-8-7h.01m6 0h.01M12 10v3"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
    message: '<path d="M20 15a3 3 0 0 1-3 3H8l-5 3v-9a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3Z"/><path d="M8 5V4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6"/>',
    heart: '<path d="M20.8 8.6c0 5.4-8.8 10.2-8.8 10.2S3.2 14 3.2 8.6A4.4 4.4 0 0 1 12 6.4a4.4 4.4 0 0 1 8.8 2.2Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    flag: '<path d="M5 21V4m0 0c4-3 7 3 14 0v9c-7 3-10-3-14 0"/>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    filter: '<path d="M4 5h16M7 12h10m-7 7h4"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    back: '<path d="M19 12H5m7 7-7-7 7-7"/>',
    upload: '<path d="M12 16V4m0 0L8 8m4-4 4 4M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    chart: '<path d="M4 19V5m0 14h17"/><path d="m7 15 3-4 3 2 5-7"/>',
    user: '<circle cx="12" cy="8" r="3"/><path d="M5 21a7 7 0 0 1 14 0"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    share: '<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/>',
    play: '<path d="m8 5 11 7-11 7Z"/>',
    dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2m7 9v3m-3 0h6"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
    route: '<circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 18c6 0 3-8 10-12"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M7 3h3l1.5 4-2 1.5a14 14 0 0 0 6 6L17 12l4 1.5v3A2.5 2.5 0 0 1 18.5 19C10.5 18.5 5.5 13.5 5 5.5A2.5 2.5 0 0 1 7 3Z"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    camera: '<path d="M4 7h3l1.5-2h7L17 7h3v12H4Z"/><circle cx="12" cy="13" r="3.5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    cart: '<path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/>',
    bag: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    logout: '<path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5"/><path d="m14 16 4-4-4-4m4 4H8"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    moon: '<path d="M20.5 15.3A8.5 8.5 0 0 1 8.7 3.5 8.5 8.5 0 1 0 20.5 15.3Z"/>',
    gavel: '<path d="m14.5 12.5-8 8a2.1 2.1 0 1 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/>',
    store: '<path d="m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.6-.6.7.7 0 0 0-.8 0 2.7 2.7 0 0 1-3.2 0 .7.7 0 0 0-.8 0 2.7 2.7 0 0 1-3.2 0 .7.7 0 0 0-.8 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2Z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
    minus: '<path d="M5 12h14"/>',
    scale: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0Zm14 0-3 6a3 3 0 0 0 6 0Z"/>',
    tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14m0 3h.01"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 19V5m4 3h7"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.home}</svg>`;
};

const historyStorageKey = 'gadon.lot-history.v1';
const profileStorageKey = 'gadon.profile.v1';
const sellerProfileStorageKey = 'gadon.seller-profile.v1';
const modeStorageKey = 'gadon.active-mode.v1';
const sessionStorageKey = 'gadon.session.v1';
const themeStorageKey = 'gadon.theme.v1';
let audioRecorder = null;
let audioChunks = [];
let audioStream = null;
let audioTimer = null;
const loadLotHistory = () => { try { const parsed = JSON.parse(localStorage.getItem(historyStorageKey) || '[]'); return Array.isArray(parsed) ? parsed.map(Number) : []; } catch { return []; } };
const defaultProfile = () => ({ name: 'João Pecuarista', email: 'joao@pecuarista.com.br', phone: '(65) 99999-1234', location: 'Campo Verde, MT', avatar: '', passwordChangedAt: null });
const loadProfile = () => { try { const parsed = JSON.parse(localStorage.getItem(profileStorageKey) || 'null'); return { ...defaultProfile(), ...(parsed && typeof parsed === 'object' ? parsed : {}) }; } catch { return defaultProfile(); } };
const defaultSellerProfile = () => ({ farmName: '', producerType: 'Produtor rural', documentType: 'CPF', documentNumber: '', stateRegistration: '', municipality: '', state: '', propertyRegistry: '', sanitaryStatus: '', sellerStatus: 'Não iniciado', cattlePhotos: [], vaccinationDocuments: [], farmDocuments: [], updatedAt: null });
const loadSellerProfile = () => { try { const parsed = JSON.parse(localStorage.getItem(sellerProfileStorageKey) || 'null'); return { ...defaultSellerProfile(), ...(parsed && typeof parsed === 'object' ? parsed : {}) }; } catch { return defaultSellerProfile(); } };
const loadMode = () => { try { const mode = localStorage.getItem(modeStorageKey); return mode === 'seller' || mode === 'weigher' ? mode : 'buyer'; } catch { return 'buyer'; } };
const loadSessionToken = () => { try { localStorage.removeItem('gadon.auth.v1'); return localStorage.getItem(sessionStorageKey) || ''; } catch { return ''; } };
const saveSessionToken = (token) => { try { if (token) localStorage.setItem(sessionStorageKey, token); else localStorage.removeItem(sessionStorageKey); } catch { /* sessão local indisponível */ } };
const loadDarkMode = () => { try { return localStorage.getItem(themeStorageKey) === 'dark'; } catch { return false; } };
const saveDarkMode = (enabled) => { try { localStorage.setItem(themeStorageKey, enabled ? 'dark' : 'light'); } catch { /* preferência local indisponível */ } };
const toggleTheme = (keepMobileMenuOpen = false) => { state.darkMode = !state.darkMode; saveDarkMode(state.darkMode); if (keepMobileMenuOpen) state.mobileMenuOpen = true; applyTheme(); render(); };
const defaultAdvancedFilters = () => ({ region: 'Todos', sex: 'Todos', farm: 'Todos', location: 'Todos', purpose: 'Todos', minWeight: '', maxWeight: '', minAge: '', maxAge: '' });
const initialAuthenticated = Boolean(loadSessionToken());
try { ['gadon.freight-trips.v1', 'gadon.freight-documents.v1', 'gadon.freight.routes.v1'].forEach((key) => localStorage.removeItem(key)); } catch { /* armazenamento local indisponível */ }
const state = { activeNav: ({ seller: 'Painel vendedor', weigher: 'Painel do pesador' }[loadMode()] || 'Início'), query: '', category: 'Todos', collectionView: 'all', mode: loadMode(), favorites: new Set(), selectedLots: new Set(), filterOpen: false, advancedFilters: defaultAdvancedFilters(), sort: 'relevance', lotHistory: loadLotHistory(), profile: loadProfile(), sellerProfile: loadSellerProfile(), authenticated: initialAuthenticated, darkMode: loadDarkMode(), authError: '', lotId: null, lotMediaIndex: 0, freightSimulationOpen: false, freightSimulationLots: [], freightOrigin: '', freightDestination: '', freightEstimate: null, toast: '', page: !initialAuthenticated ? 'login' : ({ seller: 'sellerMarketplace', weigher: 'weigher' }[loadMode()] || 'home'), conversations: [], chatMessages: [], activeConversationId: null, messageQuery: '', recording: false, freightHub: { requests: [], trips: [], documents: [], returnRoutes: 0, loaded: false }, freightEstimate: null,  freightCalendarOpen: false,  freightDocumentsOpen: false, freightDocumentsFullOpen: false, freightRoutesOpen: false, freightDocumentsView: 'all', calendarYear: new Date().getFullYear(), calendarMonth: new Date().getMonth(), notifications: [], notificationsOpen: false };
const userProductsKey = 'gadon.user-products.v1';
const loadUserProducts = () => { try { const parsed = JSON.parse(localStorage.getItem(userProductsKey) || '[]'); return Array.isArray(parsed) ? parsed : []; } catch { return []; } };
const cartStorageKey = 'gadon.cart.v1';
const loadCart = () => { try { const parsed = JSON.parse(localStorage.getItem(cartStorageKey) || '[]'); return Array.isArray(parsed) ? parsed : []; } catch { return []; } };
const saveCart = () => { try { localStorage.setItem(cartStorageKey, JSON.stringify(state.cart)); } catch { /* armazenamento local indisponível */ } };
Object.assign(state, {
  welcomeOpen: !initialAuthenticated,
  auctionIndex: 0, auctionBid: 0, auctionLeader: '', auctionHistory: [], auctionEndsAt: null, auctionStatus: 'live', auctionViewers: 214, auctionUserBids: 0,
  cart: loadCart(), shopCategory: 'Todos', cartOpen: false, checkoutOpen: false, checkoutDone: false,
  voiceActive: false, voiceFields: {},
  cameraOpen: false, cattlePhotos: [],
  radarSelected: null,
  broadcastOpen: false, userAuctionLot: null,
  shopQuery: '', userProducts: loadUserProducts(), sellOpen: false, checkoutStep: 1, checkoutData: {}, lastOrderId: '', myStoreEditing: null,
});

const loadJson = (key, fallback) => { try { const parsed = JSON.parse(localStorage.getItem(key) || 'null'); return parsed ?? fallback; } catch { return fallback; } };
const saveJson = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* armazenamento local indisponível */ } };
const radarFollowingKey = 'gadon.radar-following.v1';
Object.assign(state, {
  isAdmin: false, lotsStatus: 'idle', sellerStatus: 'nao_iniciado', sellerDataLoaded: false, editingLotId: null, registrationPrefilled: false, existingPhotos: [], resetToken: new URLSearchParams(window.location.search).get('redefinir') || '', lotQuestions: {}, orders: [], myLots: [], sellerQuestions: [],
  radar: { routes: [], opportunities: [], radiusKm: 30, loaded: false }, radarFollowing: loadJson('gadon.radar-following.v1', []),
  accountMenuOpen: false, locationMenuOpen: false, purchase: null,
  weigherProgress: { watched: [], lessonsConcluded: false, training: null }, weigherAnswers: {},
  admin: { tab: 'lots', lots: [], sellers: [], preRegistrations: [], freightRequests: [], stats: null, loaded: false },
});

function saveProfile() {
  try { localStorage.setItem(profileStorageKey, JSON.stringify(state.profile)); } catch { /* armazenamento local indisponível */ }
}

function saveSellerProfile() {
  try { localStorage.setItem(sellerProfileStorageKey, JSON.stringify(state.sellerProfile)); } catch { /* armazenamento local indisponível */ }
}

function saveMode() {
  try { localStorage.setItem(modeStorageKey, state.mode); } catch { /* preferência local indisponível */ }
}

function syncSellerIdentity() {
  state.sellerProfile = {
    ...state.sellerProfile,
    producerName: state.sellerProfile.producerName || state.profile.name,
    commercialEmail: state.sellerProfile.commercialEmail || state.profile.email,
    commercialPhone: state.sellerProfile.commercialPhone || state.profile.phone,
  };
}

function switchProfileMode(mode) {
  state.mode = mode === 'seller' || mode === 'weigher' ? mode : 'buyer';
  const [activeNav, page] = { seller: ['Painel vendedor', 'sellerMarketplace'], weigher: ['Painel do pesador', 'weigher'], buyer: ['Início', 'home'] }[state.mode];
  Object.assign(state, { activeNav, page, mobileMenuOpen: false, accountMenuOpen: false, notificationsOpen: false });
  state.selectedLots.clear();
  if (state.mode === 'seller') { syncSellerIdentity(); saveSellerProfile(); }
  saveMode();
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function saveLotHistory() {
  try { localStorage.setItem(historyStorageKey, JSON.stringify(state.lotHistory)); } catch { /* armazenamento local indisponível */ }
}

function getNotificationCount() {
  return state.notifications.filter((notification) => notification.unread).length;
}

function relativeTime(value) {
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (!Number.isFinite(minutes)) return '';
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  if (minutes < 1440) return `há ${Math.round(minutes / 60)} h`;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(value));
}

function notificationPopover() {
  if (!state.notificationsOpen) return '';
  const unread = getNotificationCount();
  const items = state.notifications.length ? state.notifications.map((notification) => `<button type="button" class="notification-item ${notification.unread ? 'unread' : ''}" data-notification-id="${notification.id}"><span class="notification-icon ${notification.type}">${icon(notification.type, 17)}</span><span class="notification-copy"><strong>${escapeHtml(notification.title)}</strong><small>${escapeHtml(relativeTime(notification.createdAt))}</small><p>${escapeHtml(notification.body)}</p></span>${notification.unread ? '<i class="notification-dot"></i>' : ''}</button>`).join('') : '<div class="notification-empty">Nenhuma notificação por aqui.</div>';
  return `<div class="notification-popover" role="dialog" aria-label="Notificações"><div class="notification-popover-head"><div><strong>Notificações</strong><span>${unread ? `${unread} não lidas` : 'Tudo em dia'}</span></div>${unread ? '<button type="button" data-notification-action="read-all">Marcar como lidas</button>' : ''}</div><div class="notification-list">${items}</div></div>`;
}

function formatShortDate(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  return { day: new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(date), month: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '').toUpperCase() };
}

function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readAsDataUrl(blob) {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob); });
}

async function fileToAttachment(file) {
  const isImage = file.type.startsWith('image/');
  const preview = isImage && file.size <= 2 * 1024 * 1024 ? await readAsDataUrl(file) : null;
  return { name: file.name, size: file.size, sizeLabel: formatFileSize(file.size), type: file.type || 'application/octet-stream', url: preview };
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

function formatAuditDate(value) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

function getFilteredLots() {
  const q = state.query.trim().toLowerCase();
  const { region, sex, farm, location, purpose, minWeight, maxWeight, minAge, maxAge } = state.advancedFilters;
  const filtered = lots.filter((lot) => {
    const searchable = `${lot.name} ${lot.place} ${lot.category} ${lot.seller} ${lot.sex} ${lot.purpose}`.toLowerCase();
    const lotRegion = lot.place.split(' - ').pop();
    const matchesQuery = !q || searchable.includes(q);
    const matchesCategory = state.category === 'Todos' || lot.category === state.category;
    const matchesRegion = region === 'Todos' || lotRegion === region;
    const matchesSex = sex === 'Todos' || lot.sex === sex;
    const matchesFarm = farm === 'Todos' || lot.seller === farm;
    const matchesLocation = location === 'Todos' || lot.place === location;
    const matchesPurpose = purpose === 'Todos' || lot.purpose === purpose;
    const matchesMin = !minWeight || lot.weight >= Number(minWeight);
    const matchesMax = !maxWeight || lot.weight <= Number(maxWeight);
    const matchesMinAge = !minAge || lot.ageMonths >= Number(minAge);
    const matchesMaxAge = !maxAge || lot.ageMonths <= Number(maxAge);
    const matchesCollection = state.collectionView === 'favorites' ? state.favorites.has(lot.id) : state.collectionView === 'history' ? state.lotHistory.includes(lot.id) : true;
    return matchesQuery && matchesCategory && matchesRegion && matchesSex && matchesFarm && matchesLocation && matchesPurpose && matchesMin && matchesMax && matchesMinAge && matchesMaxAge && matchesCollection;
  });
  return filtered.sort((a, b) => {
    if (state.sort === 'price-low') return Number(a.price.replace(/\D/g, '')) - Number(b.price.replace(/\D/g, ''));
    if (state.sort === 'weight-high') return b.weight - a.weight;
    if (state.sort === 'recent') return b.id - a.id;
    return a.id - b.id;
  });
}

function activeFilterCount() {
  return Object.entries(state.advancedFilters).filter(([key, value]) => value && value !== 'Todos' && !['minWeight', 'maxWeight', 'minAge', 'maxAge'].includes(key) || ['minWeight', 'maxWeight', 'minAge', 'maxAge'].includes(key) && Boolean(value)).length;
}

function filterDrawerTemplate() {
  const values = (items, selected) => items.map((item) => `<option value="${escapeHtml(item)}" ${selected === item ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('');
  const regions = ['Todos', ...new Set(lots.map((lot) => lot.place.split(' - ').pop()))];
  const farms = ['Todos', ...new Set(lots.map((lot) => lot.seller))];
  const locations = ['Todos', ...new Set(lots.map((lot) => lot.place))];
  const sexes = ['Todos', 'Machos', 'Fêmeas'];
  const purposes = ['Todos', ...new Set(lots.map((lot) => lot.purpose))];
  const filters = state.advancedFilters;
  return `<div class="filter-backdrop" data-filter-action="close"><section class="filter-drawer filter-drawer-expanded" role="dialog" aria-modal="true" aria-label="Filtros de pesquisa"><div class="filter-drawer-head"><div><p class="eyebrow">BUSCA INTELIGENTE</p><h2>Filtre os lotes</h2><p>Combine características para encontrar o gado ideal.</p></div><button type="button" class="modal-close" data-filter-action="close">${icon('close', 18)}</button></div><form id="advanced-filters"><div class="filter-form-grid"><label><span>Sexo do animal</span><select name="sex">${values(sexes, filters.sex)}</select></label><label><span>Finalidade</span><select name="purpose">${values(purposes, filters.purpose)}</select></label><label><span>Nome da fazenda</span><select name="farm">${values(farms, filters.farm)}</select></label><label><span>Localização da fazenda</span><select name="location">${values(locations, filters.location)}</select></label><label><span>Região / UF</span><select name="region">${values(regions, filters.region)}</select></label></div><div class="filter-section-label">Peso médio e idade</div><div class="filter-fields"><label><span>Peso mínimo (@)</span><input name="minWeight" type="number" min="0" step="1" value="${escapeHtml(filters.minWeight)}" placeholder="Ex.: 8" /></label><label><span>Peso máximo (@)</span><input name="maxWeight" type="number" min="0" step="1" value="${escapeHtml(filters.maxWeight)}" placeholder="Ex.: 18" /></label><label><span>Idade mínima (meses)</span><input name="minAge" type="number" min="0" step="1" value="${escapeHtml(filters.minAge)}" placeholder="Ex.: 12" /></label><label><span>Idade máxima (meses)</span><input name="maxAge" type="number" min="0" step="1" value="${escapeHtml(filters.maxAge)}" placeholder="Ex.: 36" /></label></div><div class="filter-drawer-actions"><button type="button" class="secondary-button" data-filter-action="reset">Limpar filtros</button><button type="submit" class="primary-button">Aplicar filtros ${icon('arrow', 15)}</button></div></form></section></div>`;
}

function searchPageTemplate() {
  const results = getFilteredLots();
  const breeds = [...new Set(lots.map((lot) => lot.category))];
  return `<div class="app-shell search-shell">${appSidebarTemplate()}<main class="main-content">${appTopbarTemplate('Buscar gado')}<div class="search-page ${!state.query.trim() && state.category === 'Todos' && activeFilterCount() === 0 ? 'search-page-empty' : ''}"><div class="search-page-heading"><div><p class="eyebrow">PESQUISA DE GADO</p><h1>Encontre a raça ideal para sua compra.</h1><p>Pesquise pelo nome da raça, veja os lotes disponíveis e selecione os animais para iniciar uma negociação.</p></div><span class="search-result-pill">${results.length} ${results.length === 1 ? 'lote encontrado' : 'lotes encontrados'}</span></div><section class="breed-search-panel"><div class="search-empty-hero">${icon('search', 48)}<p class="eyebrow">BUSCAR GADO</p><h2>Qual raça você procura?</h2><p>Digite o nome de uma raça para começar a pesquisa.</p></div><form id="breed-search-form" class="breed-search-form"><div class="breed-search-input">${icon('search', 19)}<input id="breed-search" value="${escapeHtml(state.query)}" placeholder="Digite o nome da raça: Nelore, Angus..." autocomplete="off" /><button type="button" data-action="search-clear" aria-label="Limpar pesquisa">${icon('close', 15)}</button></div><button type="submit" class="primary-button">Buscar gado ${icon('arrow', 15)}</button></form><div class="search-suggestions"><span>Raças populares</span>${breeds.map((breed) => `<button type="button" class="breed-chip ${state.category === breed && !state.query ? 'selected' : ''}" data-search-category="${escapeHtml(breed)}">${escapeHtml(breed)} <small>${lots.filter((lot) => lot.category === breed).length}</small></button>`).join('')}</div></section><div class="search-results-heading"><div><p class="eyebrow">CATÁLOGO DISPONÍVEL</p><h2>${state.query ? `Resultados para “${escapeHtml(state.query)}”` : 'Todos os lotes'}</h2></div><div class="search-results-actions"><button class="filter-button" data-action="filters">${icon('filter', 16)} Filtros <span>${activeFilterCount()}</span></button><select class="sort-select" id="lot-sort" aria-label="Ordenar resultados"><option value="relevance" ${state.sort === 'relevance' ? 'selected' : ''}>Mais relevantes</option><option value="recent" ${state.sort === 'recent' ? 'selected' : ''}>Mais recentes</option><option value="price-low" ${state.sort === 'price-low' ? 'selected' : ''}>Menor preço</option><option value="weight-high" ${state.sort === 'weight-high' ? 'selected' : ''}>Maior peso</option></select></div></div><div class="lots-grid search-results-grid">${results.length ? results.map(lotCard).join('') : `<div class="empty-state search-empty-state">Nenhum lote encontrado para essa pesquisa.<br><button type="button" class="secondary-button" data-action="search-clear">Limpar pesquisa</button></div>`}</div></div></main></div>${selectionBarTemplate()}${state.filterOpen ? filterDrawerTemplate() : ''}${toastTemplate()}`;
}

const lotStatusLabels = { em_analise: 'Em análise', publicado: 'Publicado', recusado: 'Precisa de ajustes', pausado: 'Pausado', vendido: 'Vendido' };
function getUserAnnouncements() {
  return state.myLots;
}

function announcementCard(lot) {
  const questions = state.sellerQuestions.filter((question) => question.lotId === lot.id);
  const pending = questions.filter((question) => !question.answer);
  const actions = [
    lot.status === 'publicado' || lot.status === 'vendido' ? `<button type="button" class="secondary-button" data-lot="${lot.id}">Ver anúncio</button>` : '',
    ['em_analise', 'publicado', 'recusado', 'pausado'].includes(lot.status) ? `<button type="button" class="secondary-button" data-edit-lot="${lot.id}">Editar</button>` : '',
    lot.status === 'publicado' ? `<button type="button" class="secondary-button" data-lot-action="pausar" data-lot-id="${lot.id}">Pausar</button>` : '',
    lot.status === 'pausado' ? `<button type="button" class="secondary-button" data-lot-action="reativar" data-lot-id="${lot.id}">Reativar</button>` : '',
    lot.status !== 'vendido' ? `<button type="button" class="text-button danger" data-lot-action="remover" data-lot-id="${lot.id}">Remover</button>` : '',
  ].join('');
  const questionList = questions.length ? `<div class="announcement-questions"><strong>${pending.length ? `${pending.length} pergunta${pending.length === 1 ? '' : 's'} aguardando resposta` : 'Perguntas respondidas'}</strong>${questions.map((question) => `<div class="announcement-question"><p>${escapeHtml(question.question)}</p>${question.answer ? `<small>${icon('message', 13)} ${escapeHtml(question.answer)}</small>` : `<form class="answer-form" data-answer-form="${question.id}"><input name="answer" maxlength="600" placeholder="Responder publicamente…" aria-label="Resposta" required /><button type="submit" class="primary-button">Responder</button></form>`}</div>`).join('')}</div>` : '';
  return `<article class="announcement-card"><div class="announcement-card-head"><img class="announcement-photo" src="${lot.image}" alt="" /><span class="announcement-status status-${lot.status}">${lotStatusLabels[lot.status] || lot.status}</span></div><h2>${escapeHtml(lot.name)}</h2><p class="announcement-subtitle">${escapeHtml(lot.breed)} · ${lot.heads} cabeças · ${escapeHtml(lot.place)}</p>${lot.status === 'recusado' && lot.reviewNote ? `<p class="announcement-review">${icon('bell', 14)} ${escapeHtml(lot.reviewNote)}</p>` : ''}<div class="announcement-facts"><div><span>Preço total</span><strong>${lot.price}</strong></div><div><span>Por cabeça</span><strong>${formatBRL(lot.pricePerHead)}</strong></div><div><span>Perguntas</span><strong>${lot.questionCount || 0}</strong></div></div>${questionList}<div class="announcement-card-foot">${actions}</div></article>`;
}

function announcementsTemplate() {
  const announcements = getUserAnnouncements();
  const heading = `<div class="announcements-heading"><div><p class="eyebrow">MEUS ANÚNCIOS</p><h1>Anúncios de gado</h1><p>Acompanhe a análise, responda às perguntas públicas e pause ou edite seus lotes.</p></div><button type="button" class="primary-button" data-seller-action="new-lot">${icon('plus', 16)} Anunciar gado</button></div>`;
  if (!state.sellerDataLoaded) return accountShellTemplate('Meus anúncios', `<div class="announcements-page">${heading}<div class="empty-state">Carregando seus anúncios…</div></div>`);
  if (!announcements.length) return accountShellTemplate('Meus anúncios', `<div class="announcements-page">${heading}<div class="announcements-empty-page"><div class="announcements-empty-content"><div class="announcements-empty-bag">${icon('bag', 46)}</div><h1>Nenhum anúncio ainda</h1><p>Cadastre seu primeiro lote. Depois da análise ele aparece no marketplace.</p></div></div></div>`);
  return accountShellTemplate('Meus anúncios', `<div class="announcements-page">${heading}<div class="announcements-grid">${announcements.map(announcementCard).join('')}</div></div>`);
}

function sellerMarketplaceTemplate() {
  syncSellerIdentity();
  const products = getUserAnnouncements();
  const seller = state.sellerProfile;
  const profileReady = ['em_analise', 'aprovado'].includes(state.sellerStatus);
  const statusLabel = state.sellerStatus === 'aprovado' ? 'Perfil verificado' : state.sellerStatus === 'em_analise' ? 'Documentos em análise' : state.sellerStatus === 'recusado' ? 'Perfil precisa de ajustes' : 'Complete seu cadastro';
  return accountShellTemplate('Painel vendedor', `<div class="seller-marketplace-page"><section class="seller-marketplace-hero"><div><p class="eyebrow">MODO VENDEDOR</p><h1>Venda seu gado com confiança.</h1><p>Tenha em um só lugar as ferramentas essenciais para cadastrar animais, publicar anúncios e acompanhar suas oportunidades.</p><div class="seller-hero-actions"><button type="button" class="primary-button" data-seller-action="new-lot">Cadastrar gado ${icon('arrow', 15)}</button><button type="button" class="secondary-button" data-seller-action="profile">${profileReady ? 'Editar perfil vendedor' : 'Completar perfil vendedor'}</button></div></div><div class="seller-hero-status"><span class="seller-marketplace-icon">${icon('cow', 28)}</span><strong>${escapeHtml(statusLabel)}</strong><small>${escapeHtml(seller.producerName || state.profile.name)}</small><button type="button" class="mode-switch-button" data-profile-mode="buyer">${icon('repeat', 15)} Perfil Comprador</button></div></section>${!profileReady ? `<section class="seller-onboarding-card"><span class="seller-onboarding-icon">${icon('shield', 22)}</span><div><p class="eyebrow">PRÓXIMO PASSO</p><h2>Finalize a verificação da sua conta vendedora.</h2><p>Os dados pessoais, e-mail e telefone do comprador já foram preenchidos para você. Falta confirmar documento, fazenda, sanidade e anexos.</p></div><button type="button" class="primary-button" data-seller-action="profile">Continuar cadastro ${icon('arrow', 15)}</button></section>` : ''}<section class="seller-tool-grid"><article class="seller-tool-card featured"><span class="seller-tool-icon orange">${icon('cow', 22)}</span><div><p class="eyebrow">CATÁLOGO</p><h2>Meus anúncios</h2><strong>${products.length}</strong><small>${products.filter((lot) => lot.status === 'publicado').length} publicados · ${state.sellerQuestions.filter((question) => !question.answer).length} perguntas pendentes</small></div><button type="button" class="secondary-button" data-seller-action="products">Ver produtos ${icon('arrow', 14)}</button></article><article class="seller-tool-card"><span class="seller-tool-icon blue">${icon('plus', 22)}</span><div><p class="eyebrow">PUBLICAÇÃO</p><h2>Anunciar gado</h2><small>Cadastre raça, quantidade, preço, fotos, vacinação e origem.</small></div><button type="button" class="primary-button" data-seller-action="new-lot">Novo anúncio ${icon('arrow', 14)}</button></article><article class="seller-tool-card"><span class="seller-tool-icon purple">${icon('chart', 22)}</span><div><p class="eyebrow">CRESCIMENTO</p><h2>Promoções</h2><small>Destaque seus lotes e acompanhe campanhas para aumentar o alcance.</small></div><button type="button" class="secondary-button" data-seller-action="promotions">Criar promoção ${icon('arrow', 14)}</button></article></section><section class="seller-products-panel"><div class="seller-panel-heading"><div><p class="eyebrow">SEUS ANÚNCIOS</p><h2>Produtos cadastrados</h2><p>O status de cada lote acompanha a análise documental do GadOn.</p></div><button type="button" class="text-button" data-seller-action="new-lot">Cadastrar outro lote ${icon('arrow', 14)}</button></div>${products.length ? `<div class="seller-products-list">${products.slice(0, 4).map((lot) => `<article class="seller-product-row"><img class="seller-product-photo" src="${lot.image}" alt="" /><div><strong>${escapeHtml(lot.name)}</strong><small>${escapeHtml(lot.breed)} · ${lot.heads} cabeças · ${lot.price}</small></div><span class="announcement-status status-${lot.status}">${lotStatusLabels[lot.status] || lot.status}</span><button type="button" class="secondary-button" data-seller-action="products">Gerenciar</button></article>`).join('')}</div>` : `<div class="seller-products-empty"><span>${icon('bag', 28)}</span><strong>Nenhum produto cadastrado</strong><p>Seu primeiro anúncio aparecerá aqui depois do cadastro completo.</p><button type="button" class="primary-button" data-seller-action="new-lot">Cadastrar primeiro lote ${icon('arrow', 14)}</button></div>`}</section></div>`);
}

function bindSellerMarketplaceEvents() {
  bindShellEvents();
  bindLotEvents();
  bindSellerLotActions();
  document.querySelectorAll('[data-seller-action="profile"]').forEach((el) => el.addEventListener('click', () => { syncSellerIdentity(); openAccountPage('sellerProfile'); }));
  document.querySelectorAll('[data-seller-action="products"]').forEach((el) => el.addEventListener('click', () => navigateTo('Meus anúncios')));
  document.querySelectorAll('[data-seller-action="promotions"]').forEach((el) => el.addEventListener('click', () => showToast('Destaques pagos de anúncios chegam em uma próxima etapa.')));
}

function bindSellerLotActions() {
  document.querySelectorAll('[data-seller-action="new-lot"]').forEach((el) => el.addEventListener('click', () => { state.editingLotId = null; navigateTo('Anunciar gado'); }));
  document.querySelectorAll('[data-edit-lot]').forEach((el) => el.addEventListener('click', () => { state.editingLotId = Number(el.dataset.editLot); navigateTo('Anunciar gado'); }));
  document.querySelectorAll('[data-lot-action]').forEach((el) => el.addEventListener('click', async () => {
    const action = el.dataset.lotAction;
    if (action === 'remover' && !window.confirm('Remover este anúncio do GadOn?')) return;
    try {
      await apiRequest(`/lots/${el.dataset.lotId}`, { method: 'PATCH', body: { action } });
      await loadSellerData();
      loadAppData();
      render();
      showToast({ pausar: 'Anúncio pausado.', reativar: 'Anúncio reativado.', remover: 'Anúncio removido.' }[action]);
    } catch (error) { showToast(error.message); }
  }));
  document.querySelectorAll('[data-answer-form]').forEach((form) => form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const answer = String(new FormData(form).get('answer') || '').trim();
    if (contactPattern.test(answer)) { showToast('Não inclua telefone, e-mail ou links na resposta pública.'); return; }
    form.querySelector('button').disabled = true;
    try {
      await apiRequest(`/questions/${form.dataset.answerForm}/answer`, { method: 'POST', body: { answer } });
      await loadSellerData();
      render();
      showToast('Resposta publicada no anúncio.');
    } catch (error) { form.querySelector('button').disabled = false; showToast(error.message); }
  }));
}

function bindAnnouncementsEvents() {
  bindShellEvents();
  bindLotEvents();
  bindSellerLotActions();
}

function registerReferenceDividerTemplate() {
  return `<div class="register-reference-divider" aria-hidden="true"><svg class="register-reference-divider-desktop-svg" viewBox="0 0 220 1000" preserveAspectRatio="none" focusable="false"><path d="M155 0 C65 70 0 130 25 205 C40 265 120 245 137 330 C152 407 70 452 67 570 C65 690 125 770 112 1000"></path></svg><svg class="register-reference-divider-mobile-svg" viewBox="0 0 400 280" preserveAspectRatio="none" focusable="false"><path class="register-reference-divider-mobile-mask" d="M0 34 C46 92 98 102 159 130 C228 162 286 232 400 208 V280 H0 Z"></path><path d="M0 34 C46 92 98 102 159 130 C228 162 286 232 400 208"></path></svg><div class="register-reference-cow-badge">${icon('cow', 30)}</div></div>`;
}

function welcomePopupTemplate() {
  return `<div class="welcome-overlay" data-welcome-overlay><div class="welcome-card" role="dialog" aria-modal="true" aria-label="Boas-vindas ao GadOn"><button type="button" class="welcome-close" data-welcome-action="close" aria-label="Fechar">${icon('close', 18)}</button><div class="welcome-art"><span class="welcome-logo">${themedLogo('vertical')}</span><span class="welcome-spark one"></span><span class="welcome-spark two"></span><span class="welcome-spark three"></span></div><p class="eyebrow">SEJA BEM-VINDO AO GADON</p><h2>O mercado do gado<br/>chegou<span>.</span></h2><p class="welcome-sub">Compra, venda, leilões ao vivo e frete inteligente — tudo em uma única plataforma feita para o pecuarista.</p><ul class="welcome-perks"><li>${icon('gavel', 17)} Leilões ao vivo com lances em tempo real</li><li>${icon('mic', 17)} Cadastre seu gado falando — a plataforma preenche por você</li><li>${icon('route', 17)} Radar de Frete: aviso quando um caminhão volta vazio perto do lote que você viu</li></ul><div class="welcome-actions"><button type="button" class="welcome-create" data-welcome-action="create">Criar minha conta ${icon('arrow', 17)}</button><button type="button" class="welcome-skip" data-welcome-action="close">Já tenho conta</button></div><small class="welcome-note">${icon('shield', 13)} Cadastro gratuito · lançamento oficial</small></div></div>`;
}

function loginReferenceTemplate() {
  const heroImage = '/nelore-cadastro.png';
  return `<div class="register-reference-shell"><main class="register-reference-card"><section class="register-reference-form-panel"><header class="register-reference-header"><div class="register-reference-brand"><img src="/brand/logo-horizontal-escuro.png" alt="GadOn — O mercado do gado" /></div><nav><button type="button" class="register-reference-nav" data-auth-action="welcome">Início</button><button type="button" class="register-reference-nav active" aria-current="page">Entrar</button></nav></header><div class="register-reference-copy"><p>ACESSO SEGURO</p><h1>Entrar na sua conta<span>.</span></h1><span>Ainda não tem uma conta? <button type="button" data-auth-action="register">Criar nova conta</button></span></div>${state.authError ? `<div class="auth-error register-reference-error" role="alert">${icon('bell', 15)} ${escapeHtml(state.authError)}</div>` : ''}<form id="login-reference-form" class="register-reference-form"><div class="register-reference-fields"><label class="register-reference-full"><span>E-mail</span><div>${icon('mail', 17)}<input name="email" type="email" autocomplete="username" placeholder="seu@email.com" required /></div></label><label class="register-reference-full"><span>Senha</span><div class="register-reference-password">${icon('lock', 17)}<input id="reference-login-password" name="password" type="password" autocomplete="current-password" placeholder="••••••••" minlength="6" required /><button type="button" data-auth-action="toggle-login-password" aria-label="Mostrar senha">${icon('eye', 17)}</button></div></label></div><div class="register-reference-login-options"><label class="register-reference-terms"><input type="checkbox" /> <span>Lembrar de mim</span></label><button type="button" class="register-reference-forgot" data-auth-action="forgot">Esqueci minha senha</button></div><div class="register-reference-actions"><div class="google-button-slot" data-google-slot><button type="button" class="google-button" data-auth-action="google"><span>G</span> Entrar com Google</button></div><button type="submit" class="register-reference-submit">Entrar ${icon('arrow', 17)}</button></div><div class="register-reference-security">${icon('shield', 19)} <span>Seus dados estão protegidos com segurança de ponta.</span></div></form></section><section class="register-reference-visual" style="--reference-cattle-image:url('${heroImage}')"><div class="register-reference-curve"></div><div class="register-reference-cow-badge">${icon('cow', 30)}</div><div class="register-reference-visual-logo"><img src="/brand/logo-horizontal-escuro.png" alt="" aria-hidden="true" /></div></section></main></div>`;
}

function accountRegistrationReferenceTemplate() {
  const heroImage = '/nelore-cadastro.png';
  return `<div class="register-reference-shell"><main class="register-reference-card"><section class="register-reference-form-panel"><header class="register-reference-header"><div class="register-reference-brand"><img src="/brand/logo-horizontal-escuro.png" alt="GadOn — O mercado do gado" /></div><nav><button type="button" class="register-reference-nav" data-auth-action="welcome">Início</button><button type="button" class="register-reference-nav" data-auth-action="back-login">Entrar</button></nav></header><div class="register-reference-copy"><p>COMECE AGORA</p><h1>Criar nova conta<span>.</span></h1><span>Já tem uma conta? <button type="button" data-auth-action="back-login">Entrar</button></span></div>${state.authError ? `<div class="auth-error register-reference-error" role="alert">${icon('bell', 15)} ${escapeHtml(state.authError)}</div>` : ''}<form id="account-registration-reference-form" class="register-reference-form"><div class="register-reference-fields"><label><span>Nome</span><div>${icon('user', 17)}<input name="name" autocomplete="given-name" placeholder="Seu nome" required maxlength="60" /></div></label><label><span>Sobrenome</span><div>${icon('user', 17)}<input name="surname" autocomplete="family-name" placeholder="Seu sobrenome" required maxlength="80" /></div></label><label class="register-reference-full"><span>E-mail</span><div>${icon('mail', 17)}<input name="email" type="email" autocomplete="email" placeholder="seu@email.com" required /></div></label><label class="register-reference-full"><span>Celular / WhatsApp</span><div>${icon('phone', 17)}<input name="phone" type="tel" autocomplete="tel" placeholder="(00) 00000-0000" /></div></label><label class="register-reference-full"><span>Senha</span><div class="register-reference-password">${icon('lock', 17)}<input id="reference-password" name="password" type="password" autocomplete="new-password" placeholder="Mínimo de 8 caracteres" minlength="8" required /><button type="button" data-auth-action="toggle-password" aria-label="Mostrar senha">${icon('eye', 17)}</button></div></label></div><div class="register-role-block"><p class="register-role-label">Como você quer usar o GadOn?</p><div class="register-role-options"><label class="register-role-option"><input type="radio" name="role" value="comprador" checked /><span>${icon('cart', 15)} Comprador</span></label><label class="register-role-option"><input type="radio" name="role" value="vendedor" /><span>${icon('cow', 15)} Vendedor</span></label><label class="register-role-option"><input type="radio" name="role" value="ambos" /><span>${icon('repeat', 15)} Os dois</span></label><label class="register-role-option"><input type="radio" name="role" value="pesador" /><span>${icon('scale', 15)} Pesador</span></label></div></div><label class="register-reference-terms"><input name="terms" type="checkbox" required /><span>Eu concordo com os <a href="/termos" target="_blank" rel="noopener">Termos de Uso</a> e a <a href="/privacidade" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label><div class="register-reference-actions"><div class="google-button-slot" data-google-slot><button type="button" class="google-button" data-auth-action="google"><span>G</span> Criar com Google</button></div><button type="submit" class="register-reference-submit">Criar conta ${icon('arrow', 17)}</button></div><div class="register-reference-security">${icon('shield', 19)} <span>Seus dados estão protegidos com segurança de ponta.</span></div></form></section><section class="register-reference-visual" style="--reference-cattle-image:url('${heroImage}')"><div class="register-reference-curve"></div><div class="register-reference-cow-badge">${icon('cow', 30)}</div><div class="register-reference-visual-logo"><img src="/brand/logo-horizontal-escuro.png" alt="" aria-hidden="true" /></div></section></main></div>`;
}

// Client ID público do OAuth (Google Cloud Console) e endereço da API, definidos no build (.env.*).
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_URL = import.meta.env.VITE_API_URL || 'https://api.gadon.com.br';
let googleScriptPromise = null;

async function apiRequest(path, { method = 'GET', body } = {}) {
  const token = loadSessionToken();
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw Object.assign(new Error('Não foi possível conectar. Verifique sua internet e tente de novo.'), { offline: true });
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error || 'Não foi possível concluir agora. Tente novamente.'), { status: response.status });
  return data;
}

function applySession({ token, user }) {
  saveSessionToken(token);
  applyUser(user);
  Object.assign(state, { authenticated: true, authError: '', welcomeOpen: false });
  loadAppData();
  startPolling();
}

// Ao abrir o app, confirma a sessão na API (sem derrubar o usuário se estiver sem internet).
function applyUser(user) {
  // Dados guardados no aparelho pertencem a uma conta: ao trocar de conta, nada da anterior é reaproveitado.
  if (state.profile.userId !== user.id) state.profile = { ...defaultProfile(), userId: user.id, avatar: '' };
  if (state.sellerProfile.userId !== user.id) { state.sellerProfile = { ...defaultSellerProfile(), userId: user.id, producerName: user.name }; saveSellerProfile(); }
  state.profile = { ...state.profile, name: user.name, email: user.email, phone: user.phone || '', role: user.role, location: user.location || state.profile.location, avatar: user.avatarUrl || state.profile.avatar, authProviders: user.providers };
  state.isAdmin = Boolean(user.isAdmin);
  state.sellerStatus = user.sellerStatus;
  saveProfile();
}

// Carrega do servidor tudo o que a conta precisa para as telas principais.
async function loadAppData() {
  if (!state.authenticated) return;
  state.lotsStatus = lots.length ? 'ready' : 'loading';
  const [lotsResult, favorites, notifications, conversations, orders] = await Promise.allSettled([apiRequest('/lots'), apiRequest('/me/favorites'), apiRequest('/notifications'), apiRequest('/conversations'), apiRequest('/orders')]);
  if (lotsResult.status === 'fulfilled') { lots = lotsResult.value.lots.map(toViewLot); state.lotsStatus = 'ready'; } else if (!lots.length) state.lotsStatus = 'error';
  if (favorites.status === 'fulfilled') state.favorites = new Set(favorites.value.lotIds);
  if (notifications.status === 'fulfilled') state.notifications = notifications.value.notifications;
  if (conversations.status === 'fulfilled') state.conversations = conversations.value.conversations;
  if (orders.status === 'fulfilled') state.orders = orders.value.orders;
  if (!state.purchase && !document.querySelector('input:focus, textarea:focus')) render();
}

// Atualiza notificações e conversas a cada 30 s (e o chat aberto a cada 8 s) sem recarregar a página.
let pollTimer = null;
let chatPollTimer = null;
function startPolling() {
  clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    if (!state.authenticated || document.hidden) return;
    const [notifications, conversations] = await Promise.allSettled([apiRequest('/notifications'), apiRequest('/conversations')]);
    const before = `${getNotificationCount()}-${unreadMessagesCount()}`;
    if (notifications.status === 'fulfilled') state.notifications = notifications.value.notifications;
    if (conversations.status === 'fulfilled') state.conversations = conversations.value.conversations;
    if (before !== `${getNotificationCount()}-${unreadMessagesCount()}`) {
      document.querySelectorAll('[data-action="notifications"]').forEach((button) => { const dot = button.querySelector('i'); if (getNotificationCount() && !dot) button.insertAdjacentHTML('beforeend', '<i></i>'); if (!getNotificationCount()) dot?.remove(); });
      document.querySelectorAll('[data-nav="Mensagens"]').forEach((button) => { const count = unreadMessagesCount(); let badge = button.querySelector('b'); if (count && !badge) { button.insertAdjacentHTML('beforeend', `<b>${count}</b>`); badge = null; } else if (badge) { if (count) badge.textContent = count; else badge.remove(); } });
    }
  }, 30000);
}

async function refreshSession() {
  if (!state.authenticated) return;
  try {
    const { user } = await apiRequest('/auth/me');
    applyUser(user);
    await loadAppData();
    startPolling();
  } catch (error) {
    if (error.status === 401) { logout(); showAuthError(error.message); }
  }
}

function setAuthBusy(form, busy, label) {
  const button = form?.querySelector('[type="submit"]');
  if (!button) return;
  button.disabled = busy;
  if (busy) { button.dataset.label = button.innerHTML; button.textContent = label; } else if (button.dataset.label) button.innerHTML = button.dataset.label;
}

function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  googleScriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => { googleScriptPromise = null; reject(new Error('Google Identity Services indisponível')); };
    document.head.appendChild(script);
  });
  return googleScriptPromise;
}

function showAuthError(message) {
  state.authError = message;
  const box = document.querySelector('.auth-error');
  if (box) { box.innerHTML = `${icon('bell', 15)} ${escapeHtml(message)}`; return; }
  document.querySelector('#account-registration-reference-form, #login-reference-form, #reset-password-form')?.insertAdjacentHTML('beforebegin', `<div class="auth-error register-reference-error" role="alert">${icon('bell', 15)} ${escapeHtml(message)}</div>`);
}

async function mountGoogleButton() {
  const slot = document.querySelector('[data-google-slot]');
  if (!slot || !GOOGLE_CLIENT_ID) return;
  try {
    const google = await loadGoogleIdentity();
    if (!slot.isConnected) return;
    const registering = state.page === 'accountRegister';
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleCredential, ux_mode: 'popup', auto_select: false, cancel_on_tap_outside: true, context: registering ? 'signup' : 'signin' });
    slot.innerHTML = '';
    google.accounts.id.renderButton(slot, { type: 'standard', theme: 'outline', size: 'large', shape: 'rectangular', text: registering ? 'signup_with' : 'signin_with', logo_alignment: 'center', locale: 'pt-BR', width: Math.round(Math.max(220, Math.min(400, slot.getBoundingClientRect().width || 320))) });
  } catch {
    // Mantém o botão local, que explica a indisponibilidade ao ser clicado.
  }
}

function startGoogleLogin() {
  if (!GOOGLE_CLIENT_ID) { showAuthError('O acesso com Google ainda não foi ativado neste ambiente. Use e-mail e senha por enquanto.'); return; }
  loadGoogleIdentity().then(() => mountGoogleButton()).catch(() => showAuthError('Não foi possível carregar o login do Google. Verifique a conexão e tente de novo.'));
}

// O token do Google é validado na API (assinatura, público, emissor e validade) antes de criar a sessão.
async function handleGoogleCredential(response) {
  const registering = state.page === 'accountRegister';
  const form = document.querySelector('#account-registration-reference-form');
  if (registering && !form?.querySelector('input[name="terms"]')?.checked) { showAuthError('Para criar a conta com Google, aceite os Termos de Uso e a Política de Privacidade.'); return; }
  const role = registering ? form.querySelector('input[name="role"]:checked')?.value || 'comprador' : undefined;
  try {
    const result = await apiRequest('/auth/google', { method: 'POST', body: { credential: response.credential, role } });
    applySession(result);
    switchProfileMode(result.created ? { vendedor: 'seller', pesador: 'weigher' }[result.user.role] || 'buyer' : state.mode);
    showToast(`Bem-vindo ao GadOn, ${result.user.name.split(' ')[0]}!`);
  } catch (error) {
    showAuthError(error.message);
  }
}

function resetPasswordTemplate() {
  return `<div class="register-reference-shell"><main class="register-reference-card reset-card"><section class="register-reference-form-panel"><header class="register-reference-header"><div class="register-reference-brand"><img src="/brand/logo-horizontal-escuro.png" alt="GadOn — O mercado do gado" /></div></header><div class="register-reference-copy"><p>SEGURANÇA</p><h1>Criar nova senha<span>.</span></h1><span>Escolha uma senha com pelo menos 8 caracteres.</span></div><form id="reset-password-form" class="register-reference-form"><div class="register-reference-fields"><label class="register-reference-full"><span>Nova senha</span><div>${icon('lock', 17)}<input name="password" type="password" autocomplete="new-password" minlength="8" required /></div></label><label class="register-reference-full"><span>Confirmar nova senha</span><div>${icon('lock', 17)}<input name="confirmation" type="password" autocomplete="new-password" minlength="8" required /></div></label></div><div class="register-reference-actions"><button type="submit" class="register-reference-submit">Salvar nova senha ${icon('arrow', 17)}</button><button type="button" class="register-reference-forgot" data-auth-action="back-login">Voltar para o login</button></div></form></section></main></div>`;
}

function bindResetPasswordEvents() {
  document.querySelector('[data-auth-action="back-login"]')?.addEventListener('click', () => { state.resetToken = ''; history.replaceState(null, '', '/'); render(); });
  document.querySelector('#reset-password-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (data.password !== data.confirmation) { showAuthError('A confirmação da senha não confere.'); return; }
    try {
      applySession(await apiRequest('/auth/reset', { method: 'POST', body: { token: state.resetToken, password: data.password } }));
      state.resetToken = '';
      history.replaceState(null, '', '/');
      switchProfileMode(state.mode);
      showToast('Senha redefinida. Bem-vindo de volta!');
    } catch (error) { showAuthError(error.message); }
  });
}

function logout() {
  Object.assign(state, { authenticated: false, authError: '', toast: '', page: 'login', notificationsOpen: false, accountMenuOpen: false, mobileMenuOpen: false, isAdmin: false, conversations: [], chatMessages: [], notifications: [], orders: [], myLots: [], sellerQuestions: [], sellerDataLoaded: false, sellerStatus: 'nao_iniciado', editingLotId: null, weigherProgress: { watched: [], lessonsConcluded: false, training: null }, admin: { tab: 'lots', lots: [], sellers: [], preRegistrations: [], freightRequests: [], stats: null, loaded: false }, freightHub: { requests: [], trips: [], documents: [], returnRoutes: 0, loaded: false }, freightEstimate: null, favorites: new Set() });
  pageDataLoaded.clear();
  clearInterval(pollTimer);
  clearInterval(chatPollTimer);
  saveSessionToken('');
  window.google?.accounts?.id?.disableAutoSelect();
  render();
}

function bindLoginEvents() {
  document.querySelectorAll('[data-auth-action="welcome"]').forEach((el) => el.addEventListener('click', () => { Object.assign(state, { page: 'login', welcomeOpen: true, authError: '' }); render(); }));
  document.querySelector('#login-reference-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const email = String(data.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !data.password) { showAuthError('Informe seu e-mail e sua senha.'); return; }
    setAuthBusy(form, true, 'Entrando…');
    try {
      applySession(await apiRequest('/auth/login', { method: 'POST', body: { email, password: data.password } }));
      switchProfileMode(state.mode);
    } catch (error) {
      setAuthBusy(form, false);
      showAuthError(error.message);
    }
  });
  document.querySelectorAll('[data-auth-action="register"]').forEach((el) => el.addEventListener('click', () => { state.authError = ''; state.page = 'accountRegister'; render(); }));
  document.querySelector('[data-auth-action="forgot"]')?.addEventListener('click', () => { const email = (document.querySelector('#login-reference-form input[name="email"]')?.value || '').trim() || window.prompt('Informe o e-mail da sua conta:') || ''; if (!email) return; apiRequest('/auth/forgot', { method: 'POST', body: { email } }).then(() => showAuthError('Se houver uma conta com esse e-mail, enviamos um link para criar uma nova senha.')).catch((error) => showAuthError(error.message)); });
  document.querySelector('[data-auth-action="toggle-login-password"]')?.addEventListener('click', (event) => { const input = document.querySelector('#reference-login-password'); if (!input) return; input.type = input.type === 'password' ? 'text' : 'password'; event.currentTarget.setAttribute('aria-label', input.type === 'password' ? 'Mostrar senha' : 'Ocultar senha'); });
  document.querySelector('[data-auth-action="google"]')?.addEventListener('click', startGoogleLogin);
  document.querySelectorAll('[data-welcome-action]').forEach((el) => el.addEventListener('click', () => { const create = el.dataset.welcomeAction === 'create'; state.welcomeOpen = false; if (create) { state.authError = ''; state.page = 'accountRegister'; } render(); }));
  document.querySelector('[data-welcome-overlay]')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) { state.welcomeOpen = false; render(); } });
}

function bindAccountRegistrationEvents() {
  document.querySelectorAll('[data-auth-action="welcome"]').forEach((el) => el.addEventListener('click', () => { Object.assign(state, { page: 'login', welcomeOpen: true, authError: '' }); render(); }));
  document.querySelectorAll('[data-auth-action="back-login"]').forEach((el) => el.addEventListener('click', () => { state.authError = ''; state.page = 'login'; render(); }));
  document.querySelector('#account-registration-reference-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.password.length < 8) { showAuthError('A senha precisa ter pelo menos 8 caracteres.'); return; }
    const role = data.role || 'comprador';
    const name = `${data.name.trim()} ${data.surname.trim()}`.trim();
    setAuthBusy(form, true, 'Criando conta…');
    try {
      const result = await apiRequest('/auth/register', { method: 'POST', body: { name, email: data.email.trim(), phone: (data.phone || '').trim(), password: data.password, role } });
      applySession(result);
      switchProfileMode({ vendedor: 'seller', pesador: 'weigher' }[role] || 'buyer');
      showToast(`Bem-vindo ao GadOn, ${data.name.trim()}! Conta de ${role === 'ambos' ? 'comprador e vendedor' : role} criada.`);
    } catch (error) {
      setAuthBusy(form, false);
      showAuthError(error.message);
    }
  });
  document.querySelector('[data-auth-action="toggle-password"]')?.addEventListener('click', (event) => { const input = document.querySelector('#reference-password'); if (!input) return; input.type = input.type === 'password' ? 'text' : 'password'; event.currentTarget.setAttribute('aria-label', input.type === 'password' ? 'Mostrar senha' : 'Ocultar senha'); });
  document.querySelector('[data-auth-action="google"]')?.addEventListener('click', startGoogleLogin);
}

// Logos oficiais da identidade visual (public/brand): versão escura para fundos verdes/escuros e colorida para fundos claros.
const brandLockup = () => '<img class="brand-logo" src="/brand/logo-horizontal-escuro.png" alt="GadOn — O mercado do gado" />';
const themedLogo = (layout = 'horizontal') => `<img class="brand-logo logo-on-light" src="/brand/logo-${layout}.png" alt="GadOn — O mercado do gado" /><img class="brand-logo logo-on-dark" src="/brand/logo-${layout}-escuro.png" alt="" aria-hidden="true" />`;
const profileInitials = () => state.profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'GO';
const unreadMessagesCount = () => state.conversations.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
const toastTemplate = () => (state.toast ? `<div class="toast" role="status" aria-live="polite">${icon('bell', 17)} ${state.toast}</div>` : '');
const profileModeLabels = { buyer: 'Perfil Comprador', seller: 'Perfil Vendedor', weigher: 'Perfil Pesador' };
const profileRoleLabel = () => ({ buyer: 'Comprador verificado', seller: { aprovado: 'Vendedor verificado', em_analise: 'Vendedor em análise', recusado: 'Vendedor com pendências' }[state.sellerStatus] || 'Vendedor em preparação', weigher: state.weigherProgress.training?.passed ? 'Pesador habilitado' : 'Pesador em treinamento' }[state.mode]);
const buyerNavItems = () => [['Início', 'home'], ['Buscar gado', 'search'], ['Leilão ao vivo', 'gavel'], ...(state.isAdmin ? [['Loja rural', 'store']] : []), ['Radar de Frete', 'route'], ['Mensagens', 'message'], ['Fretes', 'truck'], ...(state.isAdmin ? [['Administração', 'shield']] : [])];
const sellerNavItems = [['Painel vendedor', 'home'], ['Meus anúncios', 'bag'], ['Anunciar gado', 'cow'], ['Promoções', 'chart']];
const weigherNavItems = [['Painel do pesador', 'home'], ['Suporte', 'help']];
const navItemsForMode = () => (state.mode === 'seller' ? sellerNavItems : state.mode === 'weigher' ? weigherNavItems : buyerNavItems());
const navSectionLabel = () => ({ buyer: 'MENU PRINCIPAL', seller: 'CENTRAL DE VENDAS', weigher: 'ÁREA DO PESADOR' }[state.mode]);
const navPages = { 'Início': 'home', 'Buscar gado': 'search', 'Leilão ao vivo': 'auction', 'Loja rural': 'shop', 'Radar de Frete': 'radar', 'Mensagens': 'messages', 'Fretes': 'freight', 'Painel vendedor': 'sellerMarketplace', 'Meus anúncios': 'announcements', 'Anunciar gado': 'register', 'Promoções': 'sellerMarketplace', 'Painel do pesador': 'weigher', 'Suporte': 'weigherSupport', 'Administração': 'admin' };

// Dados carregados sob demanda ao abrir cada página (uma vez por visita).
const pageDataLoaded = new Set();
function ensurePageData(page) {
  if (pageDataLoaded.has(page)) return;
  const loaders = { freight: loadFreightHub, sellerMarketplace: () => Promise.all([loadSellerData(), fetchSellerProfile()]), announcements: loadSellerData, sellerProfile: fetchSellerProfile, weigher: loadWeigherProgress, weigherSupport: loadWeigherProgress, admin: loadAdminData, radar: loadRadar };
  if (!loaders[page]) return;
  pageDataLoaded.add(page);
  loaders[page]().then(() => { if (state.page === page) render(); }).finally(() => setTimeout(() => pageDataLoaded.delete(page), 15000));
}

async function loadSellerData() {
  const [mine, questions] = await Promise.allSettled([apiRequest('/me/lots'), apiRequest('/me/questions')]);
  if (mine.status === 'fulfilled') state.myLots = mine.value.lots.map(toViewLot);
  if (questions.status === 'fulfilled') state.sellerQuestions = questions.value.questions;
  state.sellerDataLoaded = true;
}

const sellerStatusLabels = { nao_iniciado: 'Não iniciado', em_analise: 'Em análise', aprovado: 'Aprovado', recusado: 'Recusado' };
async function fetchSellerProfile() {
  try {
    const { profile, status } = await apiRequest('/me/seller-profile');
    state.sellerProfile = { ...defaultSellerProfile(), producerName: state.profile.name, ...profile, userId: state.sellerProfile.userId, sellerStatus: sellerStatusLabels[status] || 'Não iniciado' };
    saveSellerProfile();
    state.sellerStatus = status;
  } catch { /* mantém o que já está na tela */ }
}

async function loadWeigherProgress() {
  try { state.weigherProgress = (await apiRequest('/me/weigher')).progress; } catch { /* mantém o progresso atual */ }
}

function navigateTo(item) {
  Object.assign(state, { activeNav: item, page: navPages[item] || 'home', mobileMenuOpen: false, accountMenuOpen: false, locationMenuOpen: false, notificationsOpen: false });
  if (item === 'Buscar gado') Object.assign(state, { collectionView: 'all', query: '', category: 'Todos', advancedFilters: defaultAdvancedFilters() });
  if (item === 'Promoções') showToast('A área de promoções está pronta para receber suas campanhas.');
  else render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function openAccountPage(page) {
  Object.assign(state, { page, activeNav: page === 'favorites' ? 'Favoritos' : 'Meu perfil', collectionView: 'all', mobileMenuOpen: false, accountMenuOpen: false, notificationsOpen: false });
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function accountNavItems(itemClass, size) {
  const profilePage = state.mode === 'seller' ? 'sellerProfile' : 'profile';
  const switchTo = state.mode === 'buyer' ? 'seller' : 'buyer';
  const isActive = (page) => (state.page === page ? 'active' : '');
  return [
    state.mode === 'buyer' ? `<button type="button" class="${itemClass} ${isActive('favorites')}" data-account-page="favorites">${icon('heart', size)}<span>Favoritos</span>${state.favorites.size ? `<b>${state.favorites.size}</b>` : ''}</button>` : '',
    `<button type="button" class="${itemClass} ${isActive(profilePage)}" data-account-page="${profilePage}">${icon('user', size)}<span>Meu perfil</span></button>`,
    `<button type="button" class="${itemClass} mode-switch-item" data-profile-mode="${switchTo}">${icon('repeat', size)}<span>${profileModeLabels[switchTo]}</span></button>`,
    `<button type="button" class="${itemClass} theme-nav-item" data-action="toggle-theme">${icon(state.darkMode ? 'sun' : 'moon', size)}<span>${state.darkMode ? 'Modo claro' : 'Modo escuro'}</span></button>`,
  ].join('');
}

function appSidebarTemplate() {
  const unread = unreadMessagesCount();
  const profilePage = state.mode === 'seller' ? 'sellerProfile' : 'profile';
  const navButtons = navItemsForMode().map(([item, iconName]) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(iconName, 20)}<span>${item}</span>${item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}${item === 'Loja rural' ? '<em class="nav-tag">ADMIN</em>' : ''}</button>`).join('');
  return `<aside class="sidebar"><div class="brand">${brandLockup()}</div><button class="profile-mini profile-mini-button" data-account-page="${profilePage}"><div class="avatar">${escapeHtml(profileInitials())}</div><div><strong>${escapeHtml(state.profile.name)}</strong><span>${profileRoleLabel()}</span></div><span class="icon-button">${icon('chevron', 15)}</span></button><nav class="main-nav" aria-label="Menu principal"><p class="nav-label">${navSectionLabel()}</p>${navButtons}<p class="nav-label nav-spacer">CONTA</p>${accountNavItems('nav-item', 20)}</nav><div class="sidebar-bottom"><div class="help-card"><div class="help-icon">?</div><div><strong>Precisa de ajuda?</strong><span>Fale com nosso suporte</span></div>${icon('chevron', 15)}</div><div class="sidebar-foot">GadOn <span>•</span> versão 1.0 MVP</div></div></aside>`;
}

function locationControlTemplate() {
  const location = state.profile.location || 'Campo Verde, MT';
  return `<div class="location-wrap"><button type="button" class="location-pill" data-action="location-menu" aria-expanded="${state.locationMenuOpen}" aria-label="Sua localização: ${escapeHtml(location)}">${icon('pin', 17)}<span>${escapeHtml(location)}</span><span class="down">⌄</span></button>${state.locationMenuOpen ? `<form class="location-popover" id="location-form"><label><span>Sua localização</span><input name="location" value="${escapeHtml(location)}" placeholder="Cidade, UF" maxlength="60" required /></label><button type="submit" class="primary-button">Salvar localização</button></form>` : ''}</div>`;
}

function accountMenuTemplate() {
  if (!state.accountMenuOpen) return '';
  const switchTo = state.mode === 'buyer' ? 'seller' : 'buyer';
  const profilePage = state.mode === 'seller' ? 'sellerProfile' : 'profile';
  return `<div class="account-menu" role="menu" aria-label="Menu da conta"><div class="account-menu-head"><span class="top-avatar">${escapeHtml(profileInitials())}</span><div><strong>${escapeHtml(state.profile.name)}</strong><small>${profileModeLabels[state.mode]}</small></div></div><button type="button" role="menuitem" data-account-page="${profilePage}">${icon('user', 19)} Meu perfil</button>${state.mode === 'buyer' ? `<button type="button" role="menuitem" data-account-page="favorites">${icon('heart', 19)} Favoritos</button>` : ''}<hr /><button type="button" role="menuitem" class="account-menu-switch" data-profile-mode="${switchTo}">${icon('repeat', 19)} ${profileModeLabels[switchTo]}</button>${state.mode === 'weigher' ? '' : `<button type="button" role="menuitem" data-profile-mode="weigher">${icon('scale', 19)} Perfil Pesador</button>`}<hr /><button type="button" role="menuitem" data-action="toggle-theme">${icon(state.darkMode ? 'sun' : 'moon', 19)} ${state.darkMode ? 'Modo claro' : 'Modo escuro'}</button><button type="button" role="menuitem" data-action="logout">${icon('logout', 19)} Sair da conta</button></div>`;
}

function appTopbarTemplate(crumb) {
  const actionLabel = state.mode === 'seller' ? 'Anunciar gado' : 'Habilitar lote';
  return `<header class="topbar"><button class="mobile-menu icon-button" aria-label="Abrir menu">${icon('menu', 22)}</button><div class="crumb">Marketplace <span>/</span> ${escapeHtml(crumb)}</div><div class="top-actions">${locationControlTemplate()}${state.mode === 'weigher' ? '' : `<button class="announce-button" data-action="register">${icon('plus', 16)} ${actionLabel}</button>`}<div class="notification-wrap"><button class="circle-action" data-action="notifications" aria-label="Abrir notificações">${icon('bell', 19)}${getNotificationCount() ? '<i></i>' : ''}</button>${notificationPopover()}</div><div class="account-menu-wrap"><button type="button" class="top-account" data-action="account-menu" aria-haspopup="menu" aria-expanded="${state.accountMenuOpen}" aria-label="Menu da conta"><span class="top-avatar">${escapeHtml(profileInitials())}</span><span class="top-user">${escapeHtml(state.profile.name)} <span>⌄</span></span></button>${accountMenuTemplate()}</div></div></header>`;
}

function mobileMenuTemplate() {
  const unread = unreadMessagesCount();
  const profilePage = state.mode === 'seller' ? 'sellerProfile' : 'profile';
  const navButtons = navItemsForMode().map(([item, iconName]) => `<button type="button" class="mobile-drawer-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(iconName, 20)}<span>${item}</span>${item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}</button>`).join('');
  return `<div class="mobile-drawer-backdrop ${state.mobileMenuOpen ? 'is-open' : ''}" data-mobile-menu-close></div><aside class="mobile-drawer ${state.mobileMenuOpen ? 'is-open' : ''}" aria-label="Menu principal" aria-hidden="${state.mobileMenuOpen ? 'false' : 'true'}"><div class="mobile-drawer-head"><div><p class="eyebrow">NAVEGAÇÃO</p><h2>Menu GadOn</h2></div><button type="button" class="mobile-drawer-close" data-mobile-menu-close aria-label="Fechar menu">${icon('close', 20)}</button></div><button type="button" class="mobile-drawer-profile" data-account-page="${profilePage}"><span class="mobile-drawer-avatar">${escapeHtml(profileInitials())}</span><span><strong>${escapeHtml(state.profile.name)}</strong><small>${profileRoleLabel()}</small></span>${icon('chevron', 16)}</button><nav class="mobile-drawer-nav"><p class="mobile-drawer-label">${navSectionLabel()}</p>${navButtons}<p class="mobile-drawer-label">CONTA</p>${accountNavItems('mobile-drawer-item', 20)}<button type="button" class="mobile-drawer-item mobile-logout-action" data-action="logout">${icon('logout', 20)}<span>Sair da conta</span></button></nav><p class="mobile-drawer-foot">GadOn <span>•</span> O mercado do gado</p></aside>`;
}

// Modais e o menu mobile ficam fora do template da página e são montados depois dele.
function mountShellOverlays() {
  const app = document.querySelector('#app');
  if (state.freightSimulationOpen) app.insertAdjacentHTML('beforeend', freightSimulationModalTemplate());
  if (state.purchase) app.insertAdjacentHTML('beforeend', purchaseModalTemplate());
  if (document.querySelector('.mobile-menu')) app.insertAdjacentHTML('beforeend', mobileMenuTemplate());
}

function bindShellEvents() {
  const on = (selector, handler) => document.querySelectorAll(selector).forEach((el) => el.addEventListener('click', (event) => { event.stopImmediatePropagation(); handler(el); }));
  on('[data-nav]', (el) => navigateTo(el.dataset.nav));
  on('[data-account-page]', (el) => openAccountPage(el.dataset.accountPage));
  on('[data-profile-mode]', (el) => switchProfileMode(el.dataset.profileMode));
  on('[data-action="toggle-theme"]', () => toggleTheme(state.mobileMenuOpen));
  on('[data-action="logout"]', () => logout());
  on('[data-action="register"]', () => { Object.assign(state, { page: 'register', toast: '', accountMenuOpen: false }); render(); window.scrollTo({ top: 0, behavior: 'instant' }); });
  on('.mobile-menu', () => { state.mobileMenuOpen = true; render(); });
  on('[data-mobile-menu-close]', () => { state.mobileMenuOpen = false; render(); });
  on('[data-action="account-menu"]', () => { Object.assign(state, { accountMenuOpen: !state.accountMenuOpen, locationMenuOpen: false, notificationsOpen: false }); render(); });
  on('[data-action="location-menu"]', () => { Object.assign(state, { locationMenuOpen: !state.locationMenuOpen, accountMenuOpen: false, notificationsOpen: false }); render(); document.querySelector('#location-form input')?.focus(); });
  document.querySelector('#location-form')?.addEventListener('submit', (event) => { event.preventDefault(); const location = String(new FormData(event.currentTarget).get('location') || '').trim(); if (location) { state.profile.location = location; saveProfile(); apiRequest('/me', { method: 'PATCH', body: { location } }).catch(() => {}); } state.locationMenuOpen = false; render(); });
  bindNotificationEvents();
  bindFreightSimulationEvents();
  bindPurchaseEvents();
}

function accountShellTemplate(crumb, content) {
  return `<div class="app-shell account-shell">${appSidebarTemplate()}<main class="main-content">${appTopbarTemplate(crumb)}${content}</main></div>${toastTemplate()}`;
}

function profileTemplate() {
  const profile = state.profile;
  const initials = profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const avatar = profile.avatar ? `<img src="${escapeHtml(profile.avatar)}" alt="Foto de perfil de ${escapeHtml(profile.name)}" />` : `<span>${escapeHtml(initials)}</span>`;
  return accountShellTemplate('Meu perfil', `<div class="profile-page"><div class="profile-heading"><div><p class="eyebrow">CONTA E SEGURANÇA</p><h1>Meu perfil</h1><p>Atualize seus dados de contato e preferências de acesso ao GadOn.</p></div><span class="profile-status"><i></i> Conta verificada</span></div><div class="profile-layout"><section class="profile-card profile-identity-card"><div class="profile-avatar-panel"><div class="profile-avatar">${avatar}</div><label class="avatar-upload">${icon('camera', 15)} Alterar foto<input id="profile-avatar-file" type="file" accept="image/*" /></label><small>JPG ou PNG · até 2 MB</small></div><div class="profile-identity-copy"><p class="eyebrow">PERFIL DO USUÁRIO</p><h2>${escapeHtml(profile.name)}</h2><p>${profileRoleLabel()}</p><div class="profile-trust"><span>${icon('shield', 14)} Perfil protegido</span><span>${icon('check', 14)} Dados atualizados</span></div></div></section><form id="profile-form" class="profile-card profile-form"><div class="profile-card-heading"><div><p class="eyebrow">DADOS DA CONTA</p><h2>Informações pessoais</h2></div><span class="profile-card-icon">${icon('user', 18)}</span></div><div class="profile-form-grid"><label><span>Nome de usuário <b>*</b></span><input name="name" value="${escapeHtml(profile.name)}" required maxlength="80" /></label><label><span>E-mail cadastrado</span><input name="email" type="email" value="${escapeHtml(profile.email)}" disabled /></label><label><span>Número de celular</span><input name="phone" type="tel" value="${escapeHtml(profile.phone)}" placeholder="(00) 00000-0000" /></label><label><span>Perfil</span><input value="${profileModeLabels[state.mode]}" disabled /></label></div><div class="profile-form-actions"><span>${icon('shield', 14)} Seus dados ficam salvos na sua conta GadOn.</span><button type="submit" class="primary-button">Salvar alterações ${icon('check', 15)}</button></div></form><section class="profile-card profile-security-card"><div class="profile-card-heading"><div><p class="eyebrow">ACESSO</p><h2>Segurança da conta</h2><p>Troque sua senha sempre que precisar reforçar a proteção.</p></div><span class="profile-card-icon">${icon('lock', 18)}</span></div><div class="password-status"><div class="password-status-icon">${icon('lock', 18)}</div><div><strong>Senha cadastrada</strong><span>•••••••••••• ${profile.passwordChangedAt ? `· atualizada em ${new Intl.DateTimeFormat('pt-BR').format(new Date(profile.passwordChangedAt))}` : '· protegida'}</span></div><button type="button" class="secondary-button" data-profile-action="toggle-password">Alterar senha</button></div><form id="password-form" class="password-form" hidden>${(profile.authProviders || []).includes('senha') ? '<label><span>Senha atual <b>*</b></span><input name="currentPassword" type="password" required autocomplete="current-password" /></label>' : ''}<label><span>Nova senha <b>*</b></span><input name="password" type="password" minlength="8" required placeholder="Mínimo de 8 caracteres" /></label><label><span>Confirmar nova senha <b>*</b></span><input name="confirmation" type="password" minlength="8" required placeholder="Repita a nova senha" /></label><div class="password-form-actions"><small>Por segurança, a senha não é armazenada em texto puro nesta demonstração.</small><button type="submit" class="primary-button">Atualizar senha ${icon('check', 15)}</button></div></form></section><section class="profile-card profile-preferences-card"><div><p class="eyebrow">PREFERÊNCIAS</p><h2>Como o GadOn pode ajudar</h2><p>Receba avisos sobre mensagens, favoritos e oportunidades de frete.</p></div><div class="preference-list"><label><input type="checkbox" checked /> <span><strong>Novas mensagens</strong><small>Alertar quando um vendedor responder.</small></span></label><label><input type="checkbox" checked /> <span><strong>Atualizações de favoritos</strong><small>Acompanhar alterações nos lotes salvos.</small></span></label><label><input type="checkbox" checked /> <span><strong>Oportunidades de frete</strong><small>Mostrar cargas compatíveis com suas rotas.</small></span></label></div></section></div></div>`);
}

function sellerProfileAccessTemplate() {
  const status = state.sellerProfile.sellerStatus === 'Em análise' ? 'Em análise' : 'Ainda não ativado';
  return `<section class="profile-card seller-access-card"><div class="seller-access-copy"><p class="eyebrow">VENDA NO GADON</p><h2>Ative seu perfil vendedor</h2><p>Cadastre sua fazenda, comprove a origem dos animais e publique lotes com mais confiança para os compradores.</p><div class="seller-access-points"><span>${icon('cow', 14)} Cadastro completo do gado</span><span>${icon('shield', 14)} Documentos e vacinação</span><span>${icon('file', 14)} Verificação da propriedade</span></div></div><div class="seller-access-action"><span class="seller-access-status"><i></i> ${status}</span><button type="button" class="primary-button" data-seller-action="open-profile">Abrir perfil vendedor ${icon('arrow', 15)}</button></div></section>`;
}

function sellerProfileTemplate() {
  syncSellerIdentity();
  const seller = state.sellerProfile;
  const status = { em_analise: 'Cadastro em análise', aprovado: 'Perfil verificado', recusado: 'Cadastro precisa de ajustes' }[state.sellerStatus] || 'Cadastro em preparação';
  const fileSummary = (files, empty) => files?.length ? files.map((file) => `<span>${icon('file', 12)} ${escapeHtml(file.name || file)}</span>`).join('') : `<small>${empty}</small>`;
  return accountShellTemplate('Perfil vendedor', `<div class="seller-profile-page"><div class="seller-profile-heading"><div><p class="eyebrow">PERFIL COMERCIAL</p><h1>Perfil vendedor</h1><p>Organize sua identidade rural e deixe seus lotes prontos para uma negociação segura.</p></div><span class="seller-profile-status"><i></i> ${status}</span></div><div class="seller-mode-switch"><div><span class="seller-mode-icon">${icon('user', 19)}</span><div><strong>Você está no modo vendedor</strong><small>O comprador continua disponível no seu perfil pessoal.</small></div></div><button type="button" class="secondary-button" data-profile-mode="buyer">${icon('repeat', 15)} Perfil Comprador</button></div><form id="seller-profile-form" class="seller-profile-form"><div class="seller-profile-grid"><section class="profile-card seller-card"><div class="profile-card-heading"><div><p class="eyebrow">IDENTIDADE DO VENDEDOR</p><h2>Dados do produtor</h2><p>Informe os dados que aparecerão na identificação comercial.</p></div><span class="profile-card-icon orange-profile-icon">${icon('user', 18)}</span></div><div class="seller-form-grid"><label><span>Nome do produtor / empresa <b>*</b></span><input name="producerName" value="${escapeHtml(seller.producerName || state.profile.name)}" required maxlength="100" /></label><label><span>Tipo de produtor <b>*</b></span><select name="producerType" required><option ${seller.producerType === 'Produtor rural' ? 'selected' : ''}>Produtor rural</option><option ${seller.producerType === 'Empresa rural' ? 'selected' : ''}>Empresa rural</option><option ${seller.producerType === 'Cooperativa' ? 'selected' : ''}>Cooperativa</option></select></label><label><span>Documento do responsável <b>*</b></span><select name="documentType"><option ${seller.documentType === 'CPF' ? 'selected' : ''}>CPF</option><option ${seller.documentType === 'CNPJ' ? 'selected' : ''}>CNPJ</option></select></label><label><span>Número do documento <b>*</b></span><input name="documentNumber" value="${escapeHtml(seller.documentNumber)}" placeholder="Informe o documento" required /></label><label><span>E-mail comercial <b>*</b></span><input name="commercialEmail" type="email" value="${escapeHtml(seller.commercialEmail || state.profile.email)}" required /></label><label><span>Telefone comercial</span><input name="commercialPhone" type="tel" value="${escapeHtml(seller.commercialPhone || state.profile.phone)}" placeholder="(00) 00000-0000" /></label></div></section><section class="profile-card seller-card"><div class="profile-card-heading"><div><p class="eyebrow">FAZENDA E ORIGEM</p><h2>Comprovação da propriedade</h2><p>Essas informações ajudam a validar a origem e a logística do lote.</p></div><span class="profile-card-icon">${icon('pin', 18)}</span></div><div class="seller-form-grid"><label class="seller-field-full"><span>Nome da fazenda / propriedade <b>*</b></span><input name="farmName" value="${escapeHtml(seller.farmName)}" placeholder="Ex.: Fazenda Santa Rita" required /></label><label><span>Município <b>*</b></span><input name="municipality" value="${escapeHtml(seller.municipality)}" placeholder="Campo Verde" required /></label><label><span>UF <b>*</b></span><select name="state" required><option value="">Selecione</option>${['MT','MS','GO','MG','SP','PR','BA','Outro estado'].map((uf) => `<option ${seller.state === uf ? 'selected' : ''}>${uf}</option>`).join('')}</select></label><label><span>Registro da propriedade</span><input name="propertyRegistry" value="${escapeHtml(seller.propertyRegistry)}" placeholder="CAR, CCIR ou registro estadual" /></label><label><span>Inscrição estadual rural</span><input name="stateRegistration" value="${escapeHtml(seller.stateRegistration)}" placeholder="Se aplicável" /></label></div><div class="seller-legal-note">${icon('shield', 15)} <span>Os documentos serão conferidos antes da publicação. Não inclua dados bancários nem documentos de terceiros.</span></div></section><section class="profile-card seller-card"><div class="profile-card-heading"><div><p class="eyebrow">SANIDADE ANIMAL</p><h2>Vacinação e rastreabilidade</h2><p>Registre o status sanitário e anexe comprovantes legíveis.</p></div><span class="profile-card-icon green-profile-icon">${icon('shield', 18)}</span></div><div class="seller-form-grid"><label><span>Situação das vacinações <b>*</b></span><select name="sanitaryStatus" required><option value="">Selecione</option><option ${seller.sanitaryStatus === 'Vacinações em dia' ? 'selected' : ''}>Vacinações em dia</option><option ${seller.sanitaryStatus === 'Em atualização' ? 'selected' : ''}>Em atualização</option><option ${seller.sanitaryStatus === 'A confirmar com veterinário' ? 'selected' : ''}>A confirmar com veterinário</option></select></label><label><span>Rastreabilidade</span><select name="traceability"><option value="">Selecione</option><option ${seller.traceability === 'Identificação individual' ? 'selected' : ''}>Identificação individual</option><option ${seller.traceability === 'SISBOV' ? 'selected' : ''}>SISBOV</option><option ${seller.traceability === 'Identificação da fazenda' ? 'selected' : ''}>Identificação da fazenda</option><option ${seller.traceability === 'Em processo' ? 'selected' : ''}>Em processo</option></select></label></div><div class="seller-upload-grid"><label class="seller-upload-box"><input type="file" name="vaccinationDocuments" data-seller-files="vaccinationDocuments" accept=".pdf,image/*" multiple /><span class="seller-upload-icon">${icon('upload', 20)}</span><strong>Comprovantes de vacinação</strong><small>PDF ou imagem · múltiplos arquivos</small><em>Adicionar documentos</em><div class="seller-file-list">${fileSummary(seller.vaccinationDocuments, 'Nenhum comprovante adicionado')}</div></label><label class="seller-upload-box"><input type="file" name="farmDocuments" data-seller-files="farmDocuments" accept=".pdf,image/*" multiple /><span class="seller-upload-icon orange-upload-icon">${icon('file', 20)}</span><strong>Documentos da propriedade</strong><small>CAR, CCIR, registro ou declaração</small><em>Adicionar documentos</em><div class="seller-file-list">${fileSummary(seller.farmDocuments, 'Nenhum documento adicionado')}</div></label></div></section></div><div class="seller-profile-actions"><span>${icon('shield', 14)} A validação definitiva depende dos órgãos competentes e da análise documental.</span><button type="submit" class="primary-button">Salvar perfil vendedor ${icon('check', 15)}</button></div></form><section class="profile-card seller-cattle-card"><div><p class="eyebrow">CATÁLOGO DE GADO</p><h2>Cadastre o produto que será vendido</h2><p>Use o cadastro completo para informar raça, quantidade, sexo, idade, peso, preço, origem, sanidade, fotos e documentos do lote.</p><div class="seller-cattle-checks"><span>${icon('cow', 14)} Características do lote</span><span>${icon('camera', 14)} Fotos dos animais</span><span>${icon('file', 14)} GTA e certificados</span></div></div><button type="button" class="primary-button" data-seller-action="new-lot">Cadastrar gado completo ${icon('arrow', 15)}</button></section></div>`);
}

function favoritesTemplate() {
  const favoriteLots = lots.filter((lot) => state.favorites.has(lot.id));
  if (!favoriteLots.length) return accountShellTemplate('Favoritos', `<div class="favorites-empty-page"><div class="favorites-empty-content"><div class="favorites-empty-cart">${icon('heart', 46)}</div><h1>Nenhum favorito ainda</h1><p>Toque no coração de um lote para guardá-lo aqui.</p></div></div>`);
  const totalValue = favoriteLots.reduce((sum, lot) => sum + (Number(lot.price.replace(/\D/g, '')) || 0), 0);
  const totalLabel = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue);
  const content = `<div class="favorites-page"><div class="favorites-heading"><div><p class="eyebrow">SUA SELEÇÃO</p><h1>Favoritos</h1><p>Guarde os lotes que despertaram seu interesse e compare antes de negociar.</p></div><span class="favorites-count">${favoriteLots.length} ${favoriteLots.length === 1 ? 'lote salvo' : 'lotes salvos'}</span></div>${favoriteLots.length ? `<div class="favorites-layout"><section><div class="favorites-toolbar"><div><h2>Produtos favoritados</h2><span>Seu carrinho de oportunidades</span></div><button class="secondary-button" data-nav="Buscar gado">${icon('search', 15)} Buscar mais gado</button></div><div class="favorites-grid">${favoriteLots.map(lotCard).join('')}</div></section><aside class="favorites-summary-card"><div class="favorites-summary-icon">${icon('heart', 20)}</div><p class="eyebrow">RESUMO DA SELEÇÃO</p><h2>Pronto para negociar?</h2><p>Revise os lotes salvos e compre com pagamento protegido pela GadOn.</p><div class="favorites-summary-lines"><div><span>Lotes salvos</span><strong>${favoriteLots.length}</strong></div><div><span>Valor de referência</span><strong>${totalLabel}</strong></div><div><span>Documentação</span><strong>${favoriteLots.length ? 'Disponível em cada lote' : '—'}</strong></div></div><button class="primary-button favorites-buy-button" data-action="buy-favorites">Comprar seleção ${icon('arrow', 15)}</button><small>${icon('shield', 13)} O valor fica retido pela GadOn até a entrega e o seu aceite.</small></aside></div>` : `<section class="favorites-empty"><div class="favorites-empty-icon">${icon('heart', 28)}</div><h2>Você ainda não favoritou nenhum lote.</h2><p>Use o coração nos cards do catálogo para montar sua seleção de compra.</p><button class="primary-button" data-nav="Buscar gado">Buscar gado ${icon('arrow', 15)}</button></section>`}</div>`;
  return accountShellTemplate('Favoritos', content);
}

function bindProfileEvents() {
  if (state.mode === 'buyer') document.querySelector('.profile-page')?.insertAdjacentHTML('beforeend', sellerProfileAccessTemplate());
  bindShellEvents();
  document.querySelector('[data-seller-action="open-profile"]')?.addEventListener('click', () => switchProfileMode('seller'));
  document.querySelector('#profile-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try { applyUser((await apiRequest('/me', { method: 'PATCH', body: { name: data.name.trim(), phone: data.phone.trim() } })).user); render(); showToast('Dados do perfil atualizados.'); } catch (error) { showToast(error.message); }
  });
  document.querySelector('#profile-avatar-file')?.addEventListener('change', async (event) => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) { showToast('Escolha uma imagem para a foto de perfil.'); return; } if (file.size > 2 * 1024 * 1024) { showToast('A foto deve ter no máximo 2 MB.'); return; } state.profile.avatar = await readAsDataUrl(file); saveProfile(); render(); showToast('Foto de perfil atualizada neste aparelho.'); });
  document.querySelector('[data-profile-action="toggle-password"]')?.addEventListener('click', () => { const form = document.querySelector('#password-form'); if (!form) return; form.hidden = !form.hidden; if (!form.hidden) form.querySelector('input')?.focus(); });
  document.querySelector('#password-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (data.password.length < 8) { showToast('A nova senha precisa ter pelo menos 8 caracteres.'); return; }
    if (data.password !== data.confirmation) { showToast('A confirmação da senha não confere.'); return; }
    try {
      await apiRequest('/me/password', { method: 'POST', body: { currentPassword: data.currentPassword || '', password: data.password } });
      state.profile.passwordChangedAt = new Date().toISOString();
      state.profile.authProviders = [...new Set([...(state.profile.authProviders || []), 'senha'])];
      saveProfile();
      render();
      showToast('Senha atualizada com segurança.');
    } catch (error) { showToast(error.message); }
  });
}

function bindSellerProfileEvents() {
  bindShellEvents();
  document.querySelectorAll('[data-seller-files]').forEach((input) => input.addEventListener('change', () => { const list = input.closest('.seller-upload-box')?.querySelector('.seller-file-list'); if (!list) return; const files = [...input.files].map((file) => `<span>${icon('file', 12)} ${escapeHtml(file.name)}</span>`); list.innerHTML = files.length ? files.join('') : '<small>Nenhum arquivo selecionado</small>'; }));
  document.querySelector('[data-seller-action="new-lot"]')?.addEventListener('click', () => navigateTo('Anunciar gado'));
  document.querySelector('#seller-profile-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      // Documentos vão para o armazenamento privado (só o vendedor e a administração acessam).
      const uploadAll = async (name, current) => {
        const files = [...(form.querySelector(`input[name="${name}"]`)?.files || [])];
        if (!files.length) return current || [];
        return Promise.all(files.map(async (file) => ({ url: (await uploadMedia(file, { privateFile: true })).url, name: file.name })));
      };
      const vaccinationDocuments = await uploadAll('vaccinationDocuments', state.sellerProfile.vaccinationDocuments);
      const farmDocuments = await uploadAll('farmDocuments', state.sellerProfile.farmDocuments);
      const { profile, status } = await apiRequest('/me/seller-profile', { method: 'PUT', body: { ...data, vaccinationDocuments, farmDocuments } });
      state.sellerProfile = { ...defaultSellerProfile(), ...profile, userId: state.sellerProfile.userId, sellerStatus: sellerStatusLabels[status] };
      state.sellerStatus = status;
      saveSellerProfile();
      if (state.mode !== 'seller') { state.mode = 'seller'; saveMode(); }
      navigateTo('Painel vendedor');
      showToast('Perfil vendedor enviado para análise documental.');
    } catch (error) { button.disabled = false; showToast(error.message); }
  });
}

function bindFavoritesEvents() {
  bindShellEvents();
  bindLotEvents();
  document.querySelector('[data-action="buy-favorites"]')?.addEventListener('click', () => { const selected = lots.filter((lot) => state.favorites.has(lot.id)); if (selected.length) openPurchase(selected); });
}

function applyTheme() {
  document.documentElement.dataset.theme = state.darkMode ? 'dark' : 'light';
}

function render() {
  destroyRadarMap();
  stopHeroCarousel();
  if (state.page !== 'auction' && userAuctionStream) stopUserBroadcast();
  const app = document.querySelector('#app');
  if (!state.authenticated && state.resetToken) { app.innerHTML = resetPasswordTemplate(); bindResetPasswordEvents(); return; }
  if (!state.authenticated) {
    app.innerHTML = state.page === 'accountRegister' ? accountRegistrationReferenceTemplate() : loginReferenceTemplate();
    document.querySelector('.register-reference-card')?.insertAdjacentHTML('beforeend', registerReferenceDividerTemplate());
    if (state.welcomeOpen && state.page !== 'accountRegister') app.insertAdjacentHTML('beforeend', welcomePopupTemplate());
    if (state.page === 'accountRegister') bindAccountRegistrationEvents();
    else bindLoginEvents();
    mountGoogleButton();
    return;
  }
  // Loja rural fica oculta para usuários (somente administradores) até depois do BETA.
  if ((state.page === 'shop' || state.page === 'myStore') && !state.isAdmin) Object.assign(state, { page: 'home', activeNav: 'Início' });
  const fullscreenPages = {
    radar: () => { app.innerHTML = radarTemplate(); bindRadarEvents(); mountRadarMap(); },
    auction: () => { app.innerHTML = auctionTemplate(); bindAuctionEvents(); startAuctionEngine(); },
    shop: () => { app.innerHTML = shopTemplate(); bindShopEvents(); },
    myStore: () => { app.innerHTML = myStoreTemplate(); bindMyStoreEvents(); },
    register: () => { if (!state.editingLotId) state.registrationPrefilled = false; app.innerHTML = registrationTemplate(); bindRegistrationEvents(); },
  };
  if (fullscreenPages[state.page]) { fullscreenPages[state.page](); return; }
  const shellPages = {
    home: [homeTemplate, bindHomeEvents],
    search: [searchPageTemplate, bindSearchEvents],
    lot: [lotPageTemplate, bindLotPageEvents],
    messages: [messagesTemplate, bindMessagesEvents],
    freight: [freightTemplate, bindFreightEvents],
    announcements: [announcementsTemplate, bindAnnouncementsEvents],
    sellerMarketplace: [sellerMarketplaceTemplate, bindSellerMarketplaceEvents],
    profile: [profileTemplate, bindProfileEvents],
    sellerProfile: [sellerProfileTemplate, bindSellerProfileEvents],
    favorites: [favoritesTemplate, bindFavoritesEvents],
    weigher: [weigherHomeTemplate, bindWeigherEvents],
    weigherSupport: [weigherSupportTemplate, bindWeigherEvents],
    admin: [adminTemplate, bindAdminEvents],
  };
  const [template, bind] = shellPages[state.page] || shellPages.home;
  ensurePageData(state.page);
  app.innerHTML = template();
  mountShellOverlays();
  bind();
}

// ---------- Página inicial ----------
let heroIndex = 0;
let heroTimer = null;

function heroSlides() {
  const totalOf = (lot) => lot.heads * lot.pricePerHead;
  const cheapest = [...lots].sort((a, b) => totalOf(a) - totalOf(b))[0];
  const bestPerHead = [...lots].sort((a, b) => a.pricePerHead - b.pricePerHead)[0];
  const biggest = [...lots].sort((a, b) => b.heads - a.heads)[0];
  if (!lots.length) return [{ kind: 'brand' }];
  return [
    { kind: 'brand' },
    { kicker: 'MENOR PREÇO AGORA', lot: cheapest, highlight: cheapest.price, note: 'O lote mais barato disponível neste momento' },
    { kicker: 'MELHOR PREÇO POR CABEÇA', lot: bestPerHead, highlight: bestPerHead.unit, note: `${bestPerHead.heads} cabeças · total ${bestPerHead.price}` },
    { kicker: 'GRANDE OPORTUNIDADE', lot: biggest, highlight: `${biggest.heads} cabeças`, note: `Maior lote disponível agora · ${biggest.unit}` },
  ];
}

function heroSlideTemplate(slide, index) {
  const active = index === heroIndex;
  const attrs = `class="hero-slide ${slide.kind === 'brand' ? 'hero-slide-brand' : ''} ${active ? 'active' : ''}" aria-roledescription="slide" aria-label="Destaque ${index + 1}" aria-hidden="${!active}" ${active ? '' : 'inert'}`;
  if (slide.kind === 'brand') return `<article ${attrs} style="--hero-image:url('/home-hero-nelore.png')"><div class="hero-slide-copy"><span class="hero-kicker">GADON MARKETPLACE</span><h2>O gado certo.<br><em>Do seu jeito.</em></h2><p>Compra, venda e frete inteligente em um só lugar.</p><button class="primary-button" data-scroll="lots">Buscar lotes ${icon('arrow', 18)}</button></div><div class="hero-note"><span class="status-dot"></span> 2.351 lotes ativos agora</div></article>`;
  const { lot } = slide;
  return `<article ${attrs} style="--hero-image:url('${lot.image}')"><div class="hero-slide-copy"><span class="hero-kicker">${slide.kicker}</span><h2>${escapeHtml(lot.name)}</h2><p>${escapeHtml(lot.meta)} · ${escapeHtml(lot.seller)} · ${escapeHtml(lot.place)}</p><div class="hero-price"><strong>${escapeHtml(slide.highlight)}</strong><span>${escapeHtml(slide.note)}</span></div><button class="primary-button" data-lot="${lot.id}">Ver lote ${icon('arrow', 18)}</button></div><span class="hero-tagline">O gado certo. Do seu jeito.</span></article>`;
}

function heroCarouselTemplate() {
  const slides = heroSlides();
  heroIndex %= slides.length;
  return `<section class="hero-carousel" aria-roledescription="carrossel" aria-label="Destaques do GadOn"><div class="hero-track">${slides.map(heroSlideTemplate).join('')}</div><button type="button" class="hero-nav prev" data-hero-nav="-1" aria-label="Destaque anterior">${icon('back', 22)}</button><button type="button" class="hero-nav next" data-hero-nav="1" aria-label="Próximo destaque">${icon('chevron', 22)}</button><div class="hero-dots">${slides.map((_, index) => `<button type="button" class="hero-dot ${index === heroIndex ? 'active' : ''}" data-hero-dot="${index}" aria-label="Ir para o destaque ${index + 1}"></button>`).join('')}</div></section>`;
}

function showHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  heroIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { const active = i === heroIndex; slide.classList.toggle('active', active); slide.setAttribute('aria-hidden', String(!active)); slide.inert = !active; });
  document.querySelectorAll('.hero-dot').forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));
}

function stopHeroCarousel() {
  clearInterval(heroTimer);
  heroTimer = null;
}

function startHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;
  const autoplay = () => { stopHeroCarousel(); if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) heroTimer = setInterval(() => showHeroSlide(heroIndex + 1), 6000); };
  carousel.querySelectorAll('[data-hero-nav]').forEach((el) => el.addEventListener('click', () => { showHeroSlide(heroIndex + Number(el.dataset.heroNav)); autoplay(); }));
  carousel.querySelectorAll('[data-hero-dot]').forEach((el) => el.addEventListener('click', () => { showHeroSlide(Number(el.dataset.heroDot)); autoplay(); }));
  let touchStartX = null;
  carousel.addEventListener('touchstart', (event) => { touchStartX = event.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (event) => { if (touchStartX === null) return; const delta = event.changedTouches[0].clientX - touchStartX; touchStartX = null; if (Math.abs(delta) > 45) { showHeroSlide(heroIndex + (delta < 0 ? 1 : -1)); autoplay(); } });
  carousel.addEventListener('mouseenter', stopHeroCarousel);
  carousel.addEventListener('mouseleave', autoplay);
  carousel.addEventListener('focusin', stopHeroCarousel);
  carousel.addEventListener('focusout', autoplay);
  autoplay();
}

function homeTemplate() {
  const filtered = getFilteredLots();
  const heading = state.collectionView === 'favorites' ? 'Meus favoritos' : state.collectionView === 'history' ? 'Histórico de visualizações' : 'Lotes em destaque';
  return `<div class="app-shell">${appSidebarTemplate()}<main class="main-content">${appTopbarTemplate(state.activeNav)}<div class="page-body home-body">
    ${heroCarouselTemplate()}
    <section class="quick-stats"><div class="quick-stat"><div class="stat-icon blue-bg">${icon('cow', 22)}</div><div><strong>2.351</strong><span>lotes ativos</span></div></div><div class="quick-stat"><div class="stat-icon orange-bg">${icon('message', 22)}</div><div><strong>1.128</strong><span>negociações abertas</span></div></div><div class="quick-stat"><div class="stat-icon green-bg">${icon('truck', 22)}</div><div><strong>843</strong><span>fretes realizados</span></div></div></section>
    <section class="feature-promos ${state.isAdmin ? '' : 'single'}"><button class="promo-card promo-auction" data-nav="Leilão ao vivo"><span class="live-pill"><i></i> AO VIVO</span><div><p class="eyebrow">LEILÃO GADON</p><h3>Nelore PO Elite em pregão agora</h3><p>Lances em tempo real · o martelo bate em minutos</p></div><span class="promo-cta">Dar lance ${icon('gavel', 18)}</span></button>${state.isAdmin ? `<button class="promo-card promo-shop" data-nav="Loja rural"><div><p class="eyebrow">LOJA RURAL · ADMIN</p><h3>Rações, sementes, terras e equipamentos</h3><p>Visível apenas para administradores até o lançamento</p></div><span class="promo-cta">Visitar loja ${icon('store', 18)}</span></button>` : ''}</section>
    <section class="section-block" id="lots"><div class="section-heading"><div><p class="eyebrow">PARA VOCÊ</p><h2>${heading}</h2></div><button class="text-button" data-nav="Buscar gado">Ver todos ${icon('arrow', 16)}</button></div><div class="filter-row"><div class="search-field">${icon('search', 19)}<input id="search" value="${escapeHtml(state.query)}" placeholder="Busque por raça, cidade ou fazenda..." aria-label="Buscar lotes" /></div><div class="category-tabs">${['Todos', 'Nelore', 'Angus', 'Cruza', 'Bezerros'].map((category) => `<button class="tab ${state.category === category ? 'selected' : ''}" data-category="${category}">${category}</button>`).join('')}</div><button class="filter-button" data-action="filters">${icon('filter', 18)} Filtros <span>${activeFilterCount()}</span></button><select class="sort-select" id="lot-sort" aria-label="Ordenar lotes"><option value="relevance" ${state.sort === 'relevance' ? 'selected' : ''}>Mais relevantes</option><option value="recent" ${state.sort === 'recent' ? 'selected' : ''}>Mais recentes</option><option value="price-low" ${state.sort === 'price-low' ? 'selected' : ''}>Menor preço</option><option value="weight-high" ${state.sort === 'weight-high' ? 'selected' : ''}>Maior peso</option></select></div><div class="lots-grid">${lotsGridMarkup(filtered, 8)}</div></section>
    <section class="trust-row"><div>${icon('shield', 22)}<span><strong>Pagamento protegido</strong> valor retido até a entrega e o aceite</span></div><div>${icon('truck', 22)}<span><strong>Frete na negociação</strong> parceiros GadOn na hora da compra</span></div><div>${icon('user', 22)}<span><strong>Perfis verificados</strong> mais segurança</span></div><div>${icon('route', 22)}<span><strong>Radar de Frete</strong> aviso de caminhão voltando vazio</span></div></section>
  </div></main></div>${selectionBarTemplate()}${state.filterOpen ? filterDrawerTemplate() : ''}${toastTemplate()}`;
}

function lotCard(lot) {
  const isFavorite = state.favorites.has(lot.id);
  const isSelected = state.selectedLots.has(lot.id);
  return `<article class="lot-card ${isSelected ? 'is-selected' : ''}"><div class="lot-image"><img src="${lot.image}" alt="${lot.name}" data-lot="${lot.id}" loading="lazy" />${lot.isDemo ? '<span class="verified demo-badge">Demonstração</span>' : '<span class="verified">✓ Verificado</span>'}<button class="favorite ${isFavorite ? 'is-favorite' : ''}" data-favorite="${lot.id}" aria-label="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${icon('heart', 18)}</button>${isSelected ? '<span class="selected-badge">Selecionado</span>' : ''}</div><div class="lot-info"><div class="lot-title-row"><div><h3 data-lot="${lot.id}">${lot.name}</h3><p>${lot.meta}</p></div><span class="lot-badge ${lot.accent}">${lot.category}</span></div><div class="lot-price">${lot.price} <small>${lot.unit}</small></div><div class="lot-meta">${icon('pin', 14)} ${lot.place}</div><div class="lot-footer"><span><span class="online-dot"></span> ${lot.seller}</span><div class="lot-actions"><button class="select-lot-button ${isSelected ? 'selected' : ''}" data-select-lot="${lot.id}">${isSelected ? '✓ Selecionado' : 'Selecionar'}</button><button class="view-button" data-lot="${lot.id}">Ver lote ${icon('chevron', 13)}</button></div></div></div></article>`;
}

function selectionBarTemplate() {
  const selected = lots.filter((lot) => state.selectedLots.has(lot.id));
  if (!selected.length) return '';
  return `<div class="selection-bar"><div><span class="selection-icon">${icon('cow', 18)}</span><div><strong>${selected.length} lote${selected.length === 1 ? '' : 's'} selecionado${selected.length === 1 ? '' : 's'}</strong><small>${selected.map((lot) => escapeHtml(lot.name)).join(' · ')}</small></div></div><div class="selection-actions"><button type="button" class="secondary-button" data-action="clear-selection">Limpar</button><button type="button" class="secondary-button" data-action="simulate-freight">Simular frete</button><button type="button" class="primary-button" data-action="buy-selected">Comprar selecionados ${icon('arrow', 15)}</button></div></div>`;
}

function freightEstimate(origin, destination, selectedLots = []) {
  if (!origin.trim() || !destination.trim()) return null;
  const text = `${origin}|${destination}`.toLowerCase();
  const hash = [...text].reduce((total, char) => (total * 31 + char.charCodeAt(0)) % 100000, 17);
  const distanceKm = 180 + (hash % 1380);
  const animals = selectedLots.reduce((total, lot) => total + (Number(String(lot.meta).match(/\d+/)?.[0]) || 1), 0);
  const price = Math.round(780 + distanceKm * 3.65 + animals * 14);
  return { distanceKm, price, animals };
}

const geocodeMemory = {};
async function geocodeCity(query) {
  const key = query.trim().toLowerCase();
  if (!key || key.length < 3) return null;
  if (geocodeMemory[key]) return geocodeMemory[key];
  try { const cached = JSON.parse(localStorage.getItem(`gadon.geo.${key}`) || 'null'); if (cached) { geocodeMemory[key] = cached; return cached; } } catch { /* sem cache */ }
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data?.[0]) {
      const point = [Number(data[0].lon), Number(data[0].lat)];
      geocodeMemory[key] = point;
      try { localStorage.setItem(`gadon.geo.${key}`, JSON.stringify(point)); } catch { /* cache indisponível */ }
      return point;
    }
  } catch { /* geocodificação indisponível */ }
  return null;
}

async function computeRealFreight(origin, destination, selectedLots = []) {
  const [from, to] = await Promise.all([geocodeCity(origin), geocodeCity(destination)]);
  if (!from || !to) return null;
  try {
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${from[0]},${from[1]};${to[0]},${to[1]}?overview=false`);
    const data = await response.json();
    const road = data.routes?.[0];
    if (!road) return null;
    const distanceKm = Math.round(road.distance / 1000);
    const animals = selectedLots.reduce((total, lot) => total + (Number(String(lot.meta).match(/\d+/)?.[0]) || 1), 0);
    return { distanceKm, price: Math.round(780 + distanceKm * 3.65 + animals * 14), animals, hours: Math.round((road.duration / 3600) * 10) / 10, real: true };
  } catch { return null; }
}

function freightEstimateSummary() {
  if (!state.freightEstimate) return `<div class="freight-simulation-empty">Informe origem e destino para visualizar a estimativa automática.</div>`;
  const estimate = state.freightEstimate;
  return `<div class="freight-simulation-result ${estimate.real ? 'is-real' : ''}"><div><span>${icon('route', 16)} ${estimate.real ? 'Distância pela estrada' : 'Distância estimada'}</span><strong>${estimate.distanceKm.toLocaleString('pt-BR')} km</strong></div>${estimate.real && estimate.hours ? `<div><span>${icon('clock', 16)} Tempo de viagem</span><strong>~${String(estimate.hours).replace('.', ',')} h</strong></div>` : ''}<div><span>${icon('truck', 16)} Frete estimado</span><strong>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimate.price)}</strong></div><small>${estimate.animals} cabeça(s) · ${estimate.real ? '✓ distância real calculada pela rota rodoviária' : 'calculando rota rodoviária real…'}</small></div>`;
}

function openFreightSimulation(selectedLots) {
  const targets = selectedLots.filter(Boolean);
  if (!targets.length) return;
  state.freightSimulationLots = targets;
  state.freightOrigin = state.freightOrigin || targets[0].place || '';
  state.freightDestination = '';
  state.freightEstimate = null;
  state.freightSimulationOpen = true;
  render();
}

let freightCalcTimer = null;
let freightCalcToken = 0;

function bindFreightSimulationEvents() {
  if (!state.freightSimulationOpen) return;
  document.querySelectorAll('[data-freight-sim-close]').forEach((el) => el.addEventListener('click', (event) => { if (event.target === el || el.classList.contains('modal-close') || el.classList.contains('secondary-button')) { state.freightSimulationOpen = false; state.freightEstimate = null; render(); } }));
  const form = document.querySelector('#freight-simulation-form');
  const update = () => {
    const data = Object.fromEntries(new FormData(form).entries());
    state.freightOrigin = data.origin || '';
    state.freightDestination = data.destination || '';
    state.freightEstimate = freightEstimate(state.freightOrigin, state.freightDestination, state.freightSimulationLots);
    const output = document.querySelector('#freight-estimate-output');
    if (output) output.innerHTML = freightEstimateSummary();
    const continueButton = document.querySelector('[data-action="continue-purchase"]');
    if (continueButton) continueButton.disabled = !state.freightEstimate;
    const token = ++freightCalcToken;
    const origin = state.freightOrigin;
    const destination = state.freightDestination;
    clearTimeout(freightCalcTimer);
    if (origin.trim().length > 2 && destination.trim().length > 2) {
      freightCalcTimer = setTimeout(async () => {
        const real = await computeRealFreight(origin, destination, state.freightSimulationLots);
        if (!real || token !== freightCalcToken || state.freightOrigin !== origin || state.freightDestination !== destination || !state.freightSimulationOpen) return;
        state.freightEstimate = real;
        const liveOutput = document.querySelector('#freight-estimate-output');
        if (liveOutput) liveOutput.innerHTML = freightEstimateSummary();
      }, 650);
    }
  };
  form?.addEventListener('submit', (event) => { event.preventDefault(); update(); });
  form?.querySelectorAll('input').forEach((input) => input.addEventListener('input', update));
  document.querySelector('[data-action="continue-purchase"]')?.addEventListener('click', () => openPurchase(state.freightSimulationLots, state.freightDestination));
}

function freightSimulationModalTemplate() {
  const selected = state.freightSimulationLots;
  return `<div class="modal-backdrop freight-simulation-backdrop" data-freight-sim-close><section class="freight-simulation-modal" role="dialog" aria-modal="true" aria-label="Simulação de frete"><button type="button" class="modal-close" data-freight-sim-close>${icon('close', 19)}</button><div class="freight-simulation-head"><span class="freight-simulation-icon">${icon('truck', 22)}</span><div><p class="eyebrow">PLANEJE SUA COMPRA</p><h2>Simulação automática de frete</h2><p>Informe o trajeto e tenha uma referência antes de comprar.</p></div></div><div class="freight-simulation-lots"><span>Produto selecionado</span><strong>${selected.map((lot) => escapeHtml(lot.name)).join(' · ')}</strong></div><form id="freight-simulation-form"><div class="freight-simulation-fields"><label><span>Origem</span><input name="origin" value="${escapeHtml(state.freightOrigin)}" placeholder="Ex.: Campo Verde - MT" required /></label><label><span>Destino</span><input name="destination" value="${escapeHtml(state.freightDestination)}" placeholder="Ex.: Goiânia - GO" required /></label></div><div id="freight-estimate-output">${freightEstimateSummary()}</div><div class="freight-simulation-actions"><button type="button" class="secondary-button" data-freight-sim-close>Continuar depois</button><button type="submit" class="primary-button">Calcular frete ${icon('arrow', 15)}</button><button type="button" class="primary-button" data-action="continue-purchase" ${state.freightEstimate ? '' : 'disabled'}>Continuar para compra</button></div></form><p class="freight-simulation-note">A simulação é uma estimativa de planejamento. A cotação final depende de distância validada, quantidade, documentação e disponibilidade da transportadora.</p></section></div>`;
}

function lotLegalProfile(lot) {
  const hasFemales = /fêmeas|matrizes/i.test(lot.meta);
  const forReproduction = /matriz|reprodução/i.test(`${lot.name} ${lot.category}`);
  return {
    vaccination: hasFemales ? 'Comprovante de vacinação contra brucelose: solicitar ao vendedor' : 'Lote informado como exclusivamente de machos; confirmar exigências sanitárias do destino',
    vaccinationDetail: hasFemales ? 'A regularidade da vacinação deve ser conferida no estabelecimento de origem.' : 'A exigência depende do sexo, idade, origem e destino do trânsito.',
    tests: forReproduction ? 'Exames de brucelose e tuberculose: conferir resultado negativo para reprodução' : 'Exames sanitários: conforme finalidade e UF de destino',
    gta: 'Guia de Trânsito Animal (GTA) obrigatória para movimentação',
    traceability: 'SISBOV: adesão voluntária; identificação individual a confirmar',
    origin: `Cadastro da propriedade de origem informado: ${lot.place}`
  };
}

function legalDocumentsTemplate(lot) {
  const legal = lotLegalProfile(lot);
  const items = [
    ['GTA', legal.gta, 'Obrigatória', 'pending'],
    ['Vacinação', legal.vaccination, 'Conferir', 'pending'],
    ['Exames sanitários', legal.tests, 'Conforme destino', 'info'],
    ['Rastreabilidade', legal.traceability, 'Consultar', 'info'],
    ['Origem do lote', legal.origin, 'Informado', 'issued']
  ];
  return `<div class="legal-document-list">${items.map(([title, description, status, statusClass]) => `<div class="legal-document-row"><span class="legal-document-icon">${icon(title === 'GTA' ? 'truck' : title === 'Rastreabilidade' ? 'route' : 'shield', 16)}</span><div><strong>${title}</strong><small>${description}</small></div><em class="doc-badge ${statusClass}">${status}</em></div>`).join('')}</div><div class="legal-alert">${icon('shield', 14)} A documentação original deve ser conferida com o vendedor, médico-veterinário e serviço veterinário oficial antes da compra e do transporte.</div>`;
}

function healthTemplate(lot) {
  const legal = lotLegalProfile(lot);
  return `<div class="health-summary"><div class="health-summary-head"><span>${icon('shield', 18)}</span><div><strong>Sanidade e vacinação</strong><small>Informações declaradas no anúncio e sujeitas à validação documental.</small></div></div><div class="health-facts"><div><span>Vacinação / atestado</span><strong>${legal.vaccination}</strong><small>${legal.vaccinationDetail}</small></div><div><span>Brucelose e tuberculose</span><strong>${legal.tests}</strong><small>Os exames e prazos dependem da finalidade e do trânsito.</small></div><div><span>Identificação</span><strong>${legal.traceability}</strong><small>Solicite número do brinco, registro ou certificado quando aplicável.</small></div></div><div class="legal-alert">${icon('file', 14)} Os certificados devem ser anexados pelo vendedor e verificados antes de aceitar a proposta.</div></div>`;
}

const currentLot = () => findLotById(state.lotId);
const lotPhotos = (lot) => (lot.gallery?.length ? lot.gallery : [lot.image]);
const formatDay = (value) => (value ? new Intl.DateTimeFormat('pt-BR').format(new Date(`${value.slice(0, 10)}T12:00:00`)) : '');
// Perguntas são públicas: telefone, e-mail e links ficam bloqueados (a conversa privada só abre após o pagamento).
const contactPattern = /(\S+@\S+\.\S+)|(https?:\/\/|www\.)|(\(?\d{2}\)?\s?9?\d{4}[-.\s]?\d{4})|whats\s?app|\bzap\b/i;

async function openLotPage(id, { focusQuestions = false } = {}) {
  const lotId = Number(id);
  if (!lotId) return;
  Object.assign(state, { lotReturnNav: state.page === 'lot' ? state.lotReturnNav : state.activeNav, lotId, lotMediaIndex: 0, page: 'lot', notificationsOpen: false, accountMenuOpen: false, mobileMenuOpen: false });
  state.lotHistory = [lotId, ...state.lotHistory.filter((item) => item !== lotId)].slice(0, 10);
  saveLotHistory();
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
  const [lotResult, questionsResult] = await Promise.allSettled([findLotById(lotId) ? Promise.resolve(null) : apiRequest(`/lots/${lotId}`), apiRequest(`/lots/${lotId}/questions`)]);
  if (lotResult.status === 'fulfilled' && lotResult.value) lotCache[lotId] = toViewLot(lotResult.value.lot);
  if (questionsResult.status === 'fulfilled') state.lotQuestions[lotId] = questionsResult.value.questions;
  if (state.page !== 'lot' || state.lotId !== lotId) return;
  render();
  if (focusQuestions) { document.querySelector('#lot-questions')?.scrollIntoView({ block: 'start' }); document.querySelector('#lot-question-input')?.focus({ preventScroll: true }); }
  const lot = findLotById(lotId);
  if (lot && !lot.mine && lot.status === 'publicado') recordLotView(lot);
}

function lotQuestionsTemplate(lot) {
  const questions = state.lotQuestions[lot.id];
  const list = !questions ? '<p class="lot-question-empty">Carregando perguntas…</p>' : questions.length ? questions.map((item) => `<article class="lot-question"><p class="lot-question-text">${escapeHtml(item.question)}</p>${item.answer ? `<p class="lot-answer">${icon('message', 16)}<span>${escapeHtml(item.answer)} <time>${formatDay(item.answeredAt)}</time></span></p>` : `<p class="lot-answer pending">${icon('clock', 16)}<span>Aguardando resposta da fazenda</span></p>`}</article>`).join('') : '<p class="lot-question-empty">Ninguém perguntou ainda. Faça a primeira pergunta.</p>';
  const form = lot.mine ? '<p class="lot-question-empty">Este é o seu anúncio. Responda às perguntas em "Meus anúncios".</p>' : `<form id="lot-question-form" class="lot-question-form" novalidate><label for="lot-question-input">Pergunte à fazenda</label><div class="lot-question-row"><textarea id="lot-question-input" name="question" rows="2" maxlength="300" placeholder="Escreva sua pergunta sobre o lote…"></textarea><button type="submit" class="primary-button">Perguntar</button></div><small id="lot-question-hint">As perguntas e respostas ficam públicas neste anúncio. Não inclua telefone, e-mail ou links.</small></form>`;
  return `<section class="lot-section lot-questions" id="lot-questions"><div class="lot-section-head"><h2>Perguntas e respostas</h2><span>${questions ? `${questions.length} ${questions.length === 1 ? 'pergunta' : 'perguntas'}` : ''}</span></div>${form}<div class="lot-question-list"><h3>Últimas perguntas</h3>${list}</div></section>`;
}

function lotPageTemplate() {
  const lot = currentLot();
  if (!lot) return `<div class="app-shell lot-shell">${appSidebarTemplate()}<main class="main-content">${appTopbarTemplate('Lote')}<div class="lot-page"><div class="lot-breadcrumb"><button type="button" class="back-link" data-action="lot-back">${icon('back', 17)} Voltar</button></div><div class="empty-state">Carregando anúncio…</div></div></main></div>${toastTemplate()}`;
  const photos = lotPhotos(lot);
  const photoIndex = state.lotMediaIndex % photos.length;
  const isFavorite = state.favorites.has(lot.id);
  const opportunity = radarOpportunityFor(lot.id);
  const specs = [['Raça', lot.breed], ['Sexo', lot.sex], ['Quantidade', `${lot.heads} cabeças`], ['Peso médio', lot.weight ? `${String(lot.weight).replace('.', ',')}@ (≈ ${Math.round(lot.weight * 30)} kg)` : ''], ['Idade', lot.age], ['Finalidade', lot.purpose], ['Alimentação', lot.feeding], ['Vacinação', lot.vaccination], ['Rastreabilidade', lot.traceability], ['Preço por cabeça', formatBRL(lot.pricePerHead)], ['Fazenda', lot.seller], ['Município', lot.place]].filter(([, value]) => value);
  const gallery = `<div class="lot-gallery"><div class="lot-gallery-main"><img src="${photos[photoIndex]}" alt="Foto ${photoIndex + 1} do lote ${escapeHtml(lot.name)}" /><span class="modal-photo-label">${icon('shield', 15)} ${lot.isDemo ? 'Lote de demonstração' : 'Lote verificado'}</span>${photos.length > 1 ? `<span class="photo-counter">${photoIndex + 1}/${photos.length}</span>` : ''}</div>${photos.length > 1 ? `<div class="lot-gallery-thumbs">${photos.map((photo, index) => `<button type="button" class="${index === photoIndex ? 'active' : ''}" data-lot-photo="${index}" aria-label="Ver foto ${index + 1}"><img src="${photo}" alt="" /></button>`).join('')}</div>` : ''}</div>`;
  const radarHint = opportunity ? radarHintMarkup(opportunity) : '';
  const buybox = `<aside class="lot-buybox"><div class="lot-buybox-card"><div class="lot-buybox-top"><span class="lot-badge ${lot.accent}">${escapeHtml(lot.category)}</span><div class="lot-buybox-tools"><button type="button" class="modal-tool ${isFavorite ? 'is-favorite' : ''}" data-favorite="${lot.id}" aria-label="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${icon('heart', 19)}</button><button type="button" class="modal-tool" data-action="share-lot" aria-label="Compartilhar lote">${icon('share', 19)}</button></div></div><h1>${escapeHtml(lot.name)}</h1><p class="lot-buybox-meta">${escapeHtml(lot.meta)} · ${escapeHtml(lot.age)}</p><div class="lot-buybox-price"><strong>${lot.price}</strong><span>${lot.unit}</span></div><div class="lot-farm"><span class="lot-farm-icon">${icon('home', 20)}</span><div><small>Fazenda</small><strong>${escapeHtml(lot.seller)}</strong><span>Proprietário: ${escapeHtml(lot.owner)}</span></div></div><p class="lot-place">${icon('pin', 17)} ${escapeHtml(lot.place)}</p>${radarHint}${lot.mine ? `<div class="lot-own-note">${icon('user', 18)} Este anúncio é seu. Acompanhe e responda perguntas em Meus anúncios.</div>` : lot.status !== 'publicado' ? `<div class="lot-own-note">${icon('lock', 18)} Este lote não está mais disponível.</div>` : `<button type="button" class="primary-button lot-buy-button" data-action="buy-lot">Comprar agora ${icon('arrow', 18)}</button><button type="button" class="secondary-button lot-ask-button" data-action="ask-question">${icon('message', 18)} Fazer uma pergunta</button>${lot.isDemo ? `<div class="lot-own-note">${icon('bell', 18)} Lote de demonstração para conhecer o GadOn: a compra é simulada e nenhum valor é cobrado.</div>` : ''}`}<ul class="lot-guarantees"><li>${icon('shield', 18)}<span><b>Pagamento protegido.</b> O valor fica retido pela GadOn até a entrega e o seu aceite.</span></li><li>${icon('truck', 18)}<span><b>Frete na negociação.</b> Você escolhe o parceiro de frete na hora da compra.</span></li><li>${icon('lock', 18)}<span><b>Conversa com a fazenda</b> liberada após a confirmação do pagamento.</span></li></ul></div><p class="lot-privacy-note">${icon('shield', 15)} Por segurança, o nome completo, o CPF/CNPJ e os documentos pessoais ou da empresa do proprietário não são exibidos.</p></aside>`;
  const content = `<div class="lot-page"><div class="lot-breadcrumb"><button type="button" class="back-link" data-action="lot-back">${icon('back', 17)} Voltar</button><span>Lotes <i>/</i> ${escapeHtml(lot.category)} <i>/</i> ${escapeHtml(lot.name)}</span></div><div class="lot-page-grid"><div class="lot-main">${gallery}<section class="lot-section"><h2>Informações do gado</h2><dl class="lot-specs">${specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl></section><section class="lot-section"><h2>Sobre este lote</h2><p class="lot-description">${escapeHtml(lot.description)}</p></section><section class="lot-section"><h2>Documentos da carga</h2><p class="lot-section-sub">Somente documentos dos animais. Dados e documentos pessoais do proprietário não são publicados.</p>${legalDocumentsTemplate(lot)}</section><section class="lot-section"><h2>Sanidade</h2>${healthTemplate(lot)}</section>${lotQuestionsTemplate(lot)}</div>${buybox}</div></div>`;
  return `<div class="app-shell lot-shell">${appSidebarTemplate()}<main class="main-content">${appTopbarTemplate(lot.name)}${content}</main></div>${toastTemplate()}`;
}

function bindLotPageEvents() {
  bindShellEvents();
  bindLotEvents();
  const lot = currentLot();
  document.querySelector('[data-action="lot-back"]')?.addEventListener('click', () => navigateTo(navPages[state.lotReturnNav] ? state.lotReturnNav : 'Início'));
  document.querySelectorAll('[data-lot-photo]').forEach((el) => el.addEventListener('click', () => { state.lotMediaIndex = Number(el.dataset.lotPhoto); render(); }));
  if (!lot) return;
  document.querySelector('[data-action="share-lot"]')?.addEventListener('click', async () => { try { await navigator.clipboard?.writeText(`${lot.name} · ${lot.seller} · ${lot.place}`); showToast('Referência do lote copiada para compartilhar.'); } catch { showToast('Lote pronto para ser compartilhado.'); } });
  document.querySelector('[data-action="buy-lot"]')?.addEventListener('click', () => openPurchase([lot]));
  document.querySelector('[data-action="ask-question"]')?.addEventListener('click', () => { document.querySelector('#lot-questions')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); document.querySelector('#lot-question-input')?.focus({ preventScroll: true }); });
  document.querySelector('#lot-question-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const hint = document.querySelector('#lot-question-hint');
    const question = String(new FormData(form).get('question') || '').trim();
    const fail = (message) => { if (hint) { hint.textContent = message; hint.classList.add('is-error'); } document.querySelector('#lot-question-input')?.focus(); };
    if (question.length < 8) { fail('Escreva a pergunta com um pouco mais de detalhe.'); return; }
    if (contactPattern.test(question)) { fail('Não inclua telefone, e-mail ou links. A conversa privada com a fazenda é liberada após o pagamento.'); return; }
    form.querySelector('button').disabled = true;
    try {
      const { question: created } = await apiRequest(`/lots/${lot.id}/questions`, { method: 'POST', body: { question } });
      state.lotQuestions[lot.id] = [created, ...(state.lotQuestions[lot.id] || [])];
      showToast('Pergunta publicada. A resposta da fazenda aparecerá no anúncio.');
      document.querySelector('#lot-questions')?.scrollIntoView({ block: 'start' });
    } catch (error) {
      form.querySelector('button').disabled = false;
      fail(error.message);
    }
  });
}

// ---------- Compra dentro da negociação: frete, pagamento protegido e confirmação ----------
const purchaseLots = () => (state.purchase?.lotIds || []).map(findLotById).filter(Boolean);
const purchaseMethods = [['pix', 'Pix', 'Confirmação na hora'], ['boleto', 'Boleto', 'Compensa em até 2 dias úteis'], ['cartao', 'Cartão de crédito', 'Em até 12x']];

function openPurchase(selected, destination = '') {
  const targets = selected.filter((lot) => lot && !lot.mine && lot.status === 'publicado');
  if (!targets.length) { showToast('Esses lotes não estão disponíveis para compra.'); return; }
  state.purchase = { lotIds: targets.map((lot) => lot.id), step: 1, destination: destination || state.profile.location || '', quotes: null, quoting: false, quoteError: '', partnerId: null, method: 'pix', paying: false, error: '', order: null, conversationId: null };
  state.freightSimulationOpen = false;
  state.selectedLots.clear();
  render();
  if (state.purchase.destination.trim().length > 2) requestPurchaseQuotes();
}

async function requestPurchaseQuotes() {
  const purchase = state.purchase;
  const destination = purchase?.destination.trim() || '';
  if (destination.length < 3) return;
  Object.assign(purchase, { quoting: true, quotes: null, partnerId: null, quoteError: '' });
  renderPurchase();
  try {
    const { quotes } = await apiRequest('/freight/quote', { method: 'POST', body: { lotIds: purchase.lotIds, destination } });
    if (state.purchase !== purchase || purchase.destination.trim() !== destination) return;
    Object.assign(purchase, { quotes, partnerId: quotes[0]?.id || null });
  } catch (error) {
    if (state.purchase !== purchase) return;
    purchase.quoteError = error.message;
  }
  purchase.quoting = false;
  renderPurchase();
}

function purchaseQuotesTemplate(purchase) {
  if (purchase.quoting) return `<div class="purchase-quotes-state">${icon('route', 19)} Calculando a rota pela estrada…</div>`;
  if (purchase.quoteError) return `<div class="purchase-quotes-state is-error">${icon('bell', 19)} ${escapeHtml(purchase.quoteError)}</div>`;
  if (!purchase.quotes) return `<div class="purchase-quotes-state">${icon('truck', 19)} Informe o destino para ver os parceiros de frete disponíveis.</div>`;
  const cards = purchase.quotes.map((quote) => `<label class="option-card purchase-quote ${quote.promo ? 'is-promo' : ''}"><input type="radio" name="freight-partner" value="${quote.id}" ${quote.id === purchase.partnerId ? 'checked' : ''} /><div>${icon(quote.promo ? 'route' : 'truck', 21)}<span class="purchase-quote-copy"><b>${escapeHtml(quote.partner)}</b><span>${escapeHtml(quote.label)}</span><small>${quote.distanceKm.toLocaleString('pt-BR')} km ${quote.real ? 'pela estrada' : 'estimados'}${quote.hours ? ` · ~${String(quote.hours).replace('.', ',')} h de viagem` : ''}</small></span><strong>${formatBRL(quote.price)}${quote.promo ? '<em>-30%</em>' : ''}</strong></div></label>`).join('');
  return `<div class="option-cards vertical purchase-quotes">${cards}</div><small class="purchase-partners-note">${purchase.quotes.filter((quote) => !quote.promo).length === 1 ? 'Hoje há 1 parceiro de frete ativo. Novos parceiros aparecerão aqui para você comparar os valores.' : 'Compare os parceiros e escolha pelo valor.'}</small>`;
}

function purchaseModalTemplate() {
  const purchase = state.purchase;
  const targets = purchaseLots();
  const lotsTotal = targets.reduce((sum, lot) => sum + lot.heads * lot.pricePerHead, 0);
  const quote = purchase.quotes?.find((item) => item.id === purchase.partnerId);
  const total = lotsTotal + (quote?.price || 0);
  const lotList = `<div class="purchase-lots">${targets.map((lot) => `<div class="purchase-lot"><img src="${lot.image}" alt="" /><div><strong>${escapeHtml(lot.name)}</strong><span>${escapeHtml(lot.seller)} · ${escapeHtml(lot.place)}</span></div><b>${lot.price}</b></div>`).join('')}</div>`;
  let body = '';
  if (purchase.step === 1) {
    body = `${lotList}<form id="purchase-destination-form" class="purchase-destination"><label for="purchase-destination"><span>Para onde vão os animais?</span></label><div class="purchase-destination-row"><input id="purchase-destination" name="destination" value="${escapeHtml(purchase.destination)}" placeholder="Cidade - UF (ex.: Goiânia - GO)" required /><button type="submit" class="secondary-button">Calcular frete</button></div></form><p class="checkout-group-label">Escolha o frete</p>${purchaseQuotesTemplate(purchase)}<div class="purchase-footer"><div class="purchase-total"><span>Lote${targets.length > 1 ? 's' : ''} + frete</span><strong>${formatBRL(total)}</strong></div><button type="button" class="primary-button" data-purchase-action="to-payment" ${quote ? '' : 'disabled'}>Continuar para pagamento ${icon('arrow', 17)}</button></div>`;
  } else if (purchase.step === 2) {
    body = `<div class="purchase-summary"><div><span>${targets.length === 1 ? escapeHtml(targets[0].name) : `${targets.length} lotes`}</span><b>${formatBRL(lotsTotal)}</b></div><div><span>Frete · ${escapeHtml(quote.partner)}${quote.promo ? ' (Radar de Frete)' : ''}</span><b>${formatBRL(quote.price)}</b></div><div class="purchase-summary-total"><span>Total</span><strong>${formatBRL(total)}</strong></div></div><p class="checkout-group-label">Forma de pagamento</p><div class="option-cards purchase-methods">${purchaseMethods.map(([value, label, note]) => `<label class="option-card"><input type="radio" name="purchase-method" value="${value}" ${purchase.method === value ? 'checked' : ''} /><div><b>${label}</b><span>${note}</span></div></label>`).join('')}</div><div class="escrow-note">${icon('shield', 22)}<div><strong>Pagamento protegido GadOn</strong><span>O valor fica suspenso na GadOn até a conclusão da entrega e o seu aceite. Só então é liberado para a fazenda e para o frete.</span></div></div><div class="purchase-footer"><button type="button" class="secondary-button" data-purchase-action="back" ${purchase.paying ? 'disabled' : ''}>Voltar</button><button type="button" class="primary-button" data-purchase-action="pay" ${purchase.paying ? 'disabled' : ''}>${purchase.paying ? 'Confirmando pagamento…' : `Pagar ${formatBRL(total)}`}</button></div>${purchase.error ? `<p class="purchase-error" role="alert">${escapeHtml(purchase.error)}</p>` : ''}<small class="purchase-demo-note">Pagamento em modo de demonstração: a cobrança real será ativada com o provedor de pagamento.</small>`;
  } else {
    const { order } = purchase;
    body = `<div class="purchase-success"><div class="checkout-check">${icon('check', 34)}</div><h2>Pagamento confirmado</h2><p>${formatBRL(order.total)} retido pela GadOn até a entrega e o seu aceite. Pedido <b>${order.id}</b>.</p><ol class="purchase-timeline"><li class="done">${icon('check', 15)} Pagamento confirmado e retido</li><li class="done">${icon('check', 15)} Conversa com a ${escapeHtml(order.farm)} liberada</li><li class="done">${icon('check', 15)} Frete contratado · ${escapeHtml(order.freight.partner)}</li><li class="pending">${icon('clock', 15)} Emissão automática da GTA · aguardando integração com o órgão estadual</li><li>${icon('shield', 15)} Entrega e aceite → liberação do pagamento</li></ol><div class="purchase-footer"><button type="button" class="secondary-button" data-purchase-action="close">Fechar</button><button type="button" class="primary-button" data-purchase-action="open-chat">Conversar com a fazenda ${icon('message', 17)}</button></div></div>`;
  }
  return `<div class="checkout-overlay purchase-overlay"><div class="checkout-card purchase-card" role="dialog" aria-modal="true" aria-label="Comprar lote"><div class="checkout-head"><strong>${icon('cart', 19)} ${purchase.step === 3 ? 'Compra confirmada' : 'Comprar lote'}</strong><button type="button" data-purchase-action="close" aria-label="Fechar" ${purchase.paying ? 'disabled' : ''}>${icon('close', 19)}</button></div>${checkoutStepperMarkup(['Frete', 'Pagamento', 'Confirmação'], purchase.step)}${body}</div></div>`;
}

function renderPurchase() {
  const overlay = document.querySelector('.purchase-overlay');
  if (!state.purchase) { overlay?.remove(); return; }
  if (!overlay) { render(); return; }
  overlay.outerHTML = purchaseModalTemplate();
  bindPurchaseEvents();
}

async function completePurchase() {
  const purchase = state.purchase;
  Object.assign(purchase, { paying: true, error: '' });
  renderPurchase();
  try {
    const result = await apiRequest('/orders', { method: 'POST', body: { lotIds: purchase.lotIds, destination: purchase.destination.trim(), freightOptionId: purchase.partnerId, paymentMethod: purchase.method } });
    if (state.purchase !== purchase) return;
    Object.assign(purchase, { paying: false, step: 3, order: result.order, conversationId: result.conversationId });
    lots = lots.filter((lot) => !purchase.lotIds.includes(lot.id));
    loadAppData();
  } catch (error) {
    if (state.purchase !== purchase) return;
    Object.assign(purchase, { paying: false, error: error.message });
    if (error.status === 409) { purchase.step = 1; requestPurchaseQuotes(); }
  }
  renderPurchase();
}

function bindPurchaseEvents() {
  const overlay = document.querySelector('.purchase-overlay');
  const purchase = state.purchase;
  if (!overlay || !purchase) return;
  const act = (name, handler) => overlay.querySelectorAll(`[data-purchase-action="${name}"]`).forEach((el) => el.addEventListener('click', handler));
  act('close', () => { state.purchase = null; render(); });
  act('to-payment', () => { purchase.step = 2; renderPurchase(); });
  act('back', () => { purchase.step = 1; renderPurchase(); });
  act('pay', completePurchase);
  act('open-chat', () => { state.activeConversationId = purchase.conversationId; state.purchase = null; navigateTo('Mensagens'); });
  overlay.querySelector('#purchase-destination-form')?.addEventListener('submit', (event) => { event.preventDefault(); purchase.destination = String(new FormData(event.currentTarget).get('destination') || ''); requestPurchaseQuotes(); });
  overlay.querySelectorAll('input[name="freight-partner"]').forEach((input) => input.addEventListener('change', () => { purchase.partnerId = input.value; renderPurchase(); }));
  overlay.querySelectorAll('input[name="purchase-method"]').forEach((input) => input.addEventListener('change', () => { purchase.method = input.value; }));
}

function bindNotificationEvents() {
  document.querySelectorAll('[data-action="notifications"]').forEach((el) => el.addEventListener('click', (event) => { event.stopImmediatePropagation(); Object.assign(state, { notificationsOpen: !state.notificationsOpen, accountMenuOpen: false, locationMenuOpen: false }); render(); }));
  document.querySelectorAll('[data-notification-action="read-all"]').forEach((el) => el.addEventListener('click', () => { state.notifications = state.notifications.map((notification) => ({ ...notification, unread: false })); render(); apiRequest('/notifications/read', { method: 'POST', body: {} }).catch(() => {}); }));
  document.querySelectorAll('[data-notification-id]').forEach((el) => el.addEventListener('click', () => {
    const notification = state.notifications.find((item) => item.id === Number(el.dataset.notificationId));
    if (!notification) return;
    notification.unread = false;
    state.notificationsOpen = false;
    apiRequest('/notifications/read', { method: 'POST', body: { ids: [notification.id] } }).catch(() => {});
    openNotificationTarget(notification);
  }));
}

function openNotificationTarget(notification) {
  const target = notification.target || {};
  if (target.page === 'announcements' || target.page === 'sellerProfile') { if (state.mode !== 'seller') switchProfileMode('seller'); if (target.page === 'announcements') navigateTo('Meus anúncios'); else openAccountPage('sellerProfile'); return; }
  if (target.page === 'admin' && state.isAdmin) { state.admin.tab = target.tab || 'lots'; navigateTo('Administração'); return; }
  if (target.lotId && target.page !== 'radar') { openLotPage(target.lotId); return; }
  if (target.conversationId) state.activeConversationId = target.conversationId;
  navigateTo({ messages: 'Mensagens', freight: 'Fretes', radar: 'Radar de Frete' }[target.page] || 'Início');
}

function bindMarketplaceEvents() {
  bindShellEvents();
  bindLotEvents();
  document.querySelectorAll('[data-category]').forEach((el) => el.addEventListener('click', () => { state.category = el.dataset.category; render(); }));
  document.querySelector('#search')?.addEventListener('input', (event) => { state.query = event.target.value; const grid = document.querySelector('#lots .lots-grid'); if (!grid) return; grid.innerHTML = lotsGridMarkup(getFilteredLots(), 8); bindLotEvents(); });
  document.querySelectorAll('[data-scroll]').forEach((el) => el.addEventListener('click', () => document.querySelector(`#${el.dataset.scroll}`)?.scrollIntoView({ behavior: 'smooth' })));
  document.querySelectorAll('[data-action="filters"]').forEach((el) => el.addEventListener('click', () => { state.filterOpen = true; render(); }));
  document.querySelectorAll('[data-filter-action="close"]').forEach((el) => el.addEventListener('click', (event) => { if (event.target === el || el.classList.contains('modal-close')) { state.filterOpen = false; render(); } }));
  document.querySelector('[data-filter-action="reset"]')?.addEventListener('click', () => { state.advancedFilters = defaultAdvancedFilters(); state.filterOpen = false; render(); });
  document.querySelector('#advanced-filters')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); state.advancedFilters = { region: data.region || 'Todos', sex: data.sex || 'Todos', farm: data.farm || 'Todos', location: data.location || 'Todos', purpose: data.purpose || 'Todos', minWeight: data.minWeight || '', maxWeight: data.maxWeight || '', minAge: data.minAge || '', maxAge: data.maxAge || '' }; state.filterOpen = false; render(); });
  document.querySelector('#lot-sort')?.addEventListener('change', (event) => { state.sort = event.target.value; render(); });
  document.querySelector('[data-action="clear-selection"]')?.addEventListener('click', () => { state.selectedLots.clear(); render(); });
  document.querySelectorAll('[data-action="simulate-freight"]').forEach((el) => el.addEventListener('click', () => openFreightSimulation(lots.filter((lot) => state.selectedLots.has(lot.id)))));
  document.querySelector('[data-action="buy-selected"]')?.addEventListener('click', () => openPurchase(lots.filter((lot) => state.selectedLots.has(lot.id))));
}

function bindHomeEvents() {
  bindMarketplaceEvents();
  startHeroCarousel();
}

function bindSearchEvents() {
  document.querySelector('#breed-search-form')?.addEventListener('submit', (event) => { event.preventDefault(); state.query = document.querySelector('#breed-search')?.value.trim() || ''; render(); });
  document.querySelector('#breed-search')?.addEventListener('input', (event) => { state.query = event.target.value; render(); setTimeout(() => { const input = document.querySelector('#breed-search'); input?.focus(); input?.setSelectionRange(state.query.length, state.query.length); }, 0); });
  document.querySelectorAll('[data-search-category]').forEach((el) => el.addEventListener('click', () => { state.category = el.dataset.searchCategory; state.query = ''; render(); }));
  document.querySelectorAll('[data-action="search-clear"]').forEach((el) => el.addEventListener('click', () => { state.query = ''; state.category = 'Todos'; render(); setTimeout(() => document.querySelector('#breed-search')?.focus(), 0); }));
  bindMarketplaceEvents();
}

const conversationInitials = (name) => (name || '?').split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
const messageTime = (value) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));

function messagesTemplate() {
  const active = state.conversations.find((conversation) => conversation.id === state.activeConversationId);
  const conversations = state.conversations.filter((conversation) => `${conversation.name} ${conversation.subtitle} ${conversation.lastMessage}`.toLowerCase().includes(state.messageQuery.toLowerCase()));
  const unreadCount = unreadMessagesCount();
  const empty = `<div class="chat-no-selection"><span class="chat-locked-icon">${icon('lock', 28)}</span><h3>As conversas começam depois da compra</h3><p>Para sua segurança, a conversa privada com a fazenda é liberada quando o pagamento é confirmado. Antes disso, tire suas dúvidas nas perguntas públicas de cada anúncio.</p><button type="button" class="primary-button" data-nav="Buscar gado">Buscar gado ${icon('arrow', 16)}</button></div>`;
  return `<div class="app-shell messages-shell">${appSidebarTemplate()}<main class="main-content">${appTopbarTemplate('Mensagens')}<div class="messages-page"><div class="messages-heading"><div><p class="eyebrow">NEGOCIAÇÕES</p><h1>Mensagens</h1><p>Conversas com a fazenda (ou com o comprador) de cada pedido pago.</p></div><div class="message-summary"><span class="summary-dot"></span><strong>${state.conversations.length}</strong><span>conversas</span></div></div><div class="messages-layout"><section class="conversation-panel"><div class="conversation-head"><div><h2>Conversas</h2><span>${unreadCount ? `${unreadCount} não lidas` : 'Tudo em dia'}</span></div></div><div class="message-search">${icon('search', 17)}<input id="message-search" value="${escapeHtml(state.messageQuery)}" placeholder="Buscar conversa..." aria-label="Buscar conversa" /></div><div class="conversation-list">${conversations.length ? conversations.map(conversationListItem).join('') : '<div class="conversation-empty">Nenhuma conversa ainda.</div>'}</div></section><section class="chat-panel">${active ? chatPanelTemplate(active) : empty}</section></div></div></main></div>${toastTemplate()}`;
}

function chatPanelTemplate(active) {
  const lot = findLotById(active.lotId);
  const released = active.payment.status === 'liberado';
  const head = `<div class="chat-head"><div class="chat-person"><div class="chat-avatar">${escapeHtml(conversationInitials(active.name))}</div><div><h2>${escapeHtml(active.name)}</h2><p>${escapeHtml(active.subtitle)}</p></div></div></div>${lot ? `<div class="lot-context">${icon('cow', 16)}<span><b>${escapeHtml(lot.name)}</b> · ${escapeHtml(lot.place)} · ${lot.price}</span><button data-lot="${lot.id}">Ver lote ${icon('chevron', 13)}</button></div>` : ''}`;
  const payment = `<div class="chat-payment ${released ? 'is-released' : ''}">${icon('shield', 20)}<div><strong>${released ? 'Pagamento liberado' : 'Pagamento retido pela GadOn'}</strong><span>Pedido ${escapeHtml(active.orderId)} · ${formatBRL(active.payment.amount)} · ${escapeHtml(active.payment.method)}${released ? ' · entrega aceita' : active.role === 'comprador' ? ' · liberado após a entrega e o seu aceite' : ' · liberado quando o comprador confirmar a entrega'}</span></div>${!released && active.role === 'comprador' ? `<button type="button" class="secondary-button" data-chat-action="accept" data-order-id="${escapeHtml(active.orderId)}">Confirmar entrega</button>` : ''}</div>`;
  const messages = state.chatMessages.length ? state.chatMessages.map(messageBubble).join('') : '<p class="chat-loading">Carregando mensagens…</p>';
  return `${head}${payment}<div class="chat-messages">${messages}</div><form id="chat-form" class="chat-composer"><input id="chat-attachment" type="file" accept="image/*,.pdf" /><button type="button" class="composer-tool" data-chat-action="attach" aria-label="Anexar foto ou PDF">${icon('plus', 19)}</button><button type="button" class="composer-tool ${state.recording ? 'recording' : ''}" data-chat-action="record" aria-label="${state.recording ? 'Parar gravação' : 'Gravar áudio'}">${icon(state.recording ? 'stop' : 'mic', 18)}</button><input id="chat-input" name="message" autocomplete="off" placeholder="${state.recording ? 'Gravando áudio...' : 'Escreva uma mensagem...'}" maxlength="2000" aria-label="Mensagem" ${state.recording ? 'disabled' : ''} /><button type="submit" class="send-button" aria-label="Enviar mensagem" ${state.recording ? 'disabled' : ''}>${icon('send', 18)}</button></form><div class="chat-note">${icon('shield', 14)} Nunca compartilhe senhas ou dados bancários. Pagamentos acontecem somente pela GadOn.</div>`;
}

function conversationListItem(conversation) {
  const status = `<em class="conversation-status ${conversation.payment.status === 'liberado' ? 'released' : 'held'}">${conversation.payment.status === 'liberado' ? 'Pagamento liberado' : 'Pagamento retido'}</em>`;
  return `<button class="conversation-item ${conversation.id === state.activeConversationId ? 'selected' : ''}" data-conversation="${conversation.id}"><div class="conversation-avatar">${escapeHtml(conversationInitials(conversation.name))}</div><div class="conversation-copy"><div class="conversation-row"><strong>${escapeHtml(conversation.name)}</strong><time>${escapeHtml(relativeTime(conversation.updatedAt))}</time></div><span>${escapeHtml(conversation.subtitle)}</span><p>${escapeHtml(conversation.lastMessage)}</p>${status}</div>${conversation.unread ? `<b class="unread-count">${conversation.unread}</b>` : ''}</button>`;
}

function messageBubble(message) {
  if (message.from === 'system') return `<div class="message-row system"><div class="message-system">${icon('shield', 14)} <span>${escapeHtml(message.body)}</span> <small>${escapeHtml(messageTime(message.createdAt))}</small></div></div>`;
  const attachment = message.attachment;
  const body = message.kind === 'audio' && attachment ? `<div class="audio-message"><audio controls src="${escapeHtml(attachment.url)}"></audio></div>` : message.kind === 'anexo' && attachment ? (attachment.type?.startsWith('image/') ? `<div class="attachment-image"><img src="${escapeHtml(attachment.url)}" alt="${escapeHtml(attachment.name)}" /><span>${escapeHtml(attachment.name)}</span></div>` : `<a class="attachment-file" href="${escapeHtml(attachment.url)}" target="_blank" rel="noopener">${icon('file', 17)}<span><b>${escapeHtml(attachment.name)}</b><small>${escapeHtml(formatFileSize(attachment.size || 0))}</small></span></a>`) : escapeHtml(message.body).replace(/\n/g, '<br>');
  return `<div class="message-row ${message.from === 'me' ? 'mine' : 'theirs'}"><div class="message-bubble">${body}<small>${escapeHtml(messageTime(message.createdAt))}</small></div></div>`;
}

async function openConversation(id) {
  state.activeConversationId = id;
  state.chatMessages = [];
  render();
  await refreshActiveChat();
}

async function refreshActiveChat() {
  const id = state.activeConversationId;
  if (!id) return;
  try {
    const { messages } = await apiRequest(`/conversations/${id}/messages`);
    if (state.activeConversationId !== id || state.page !== 'messages') return;
    const changed = messages.length !== state.chatMessages.length;
    state.chatMessages = messages;
    const conversation = state.conversations.find((item) => item.id === id);
    if (conversation) conversation.unread = 0;
    if (changed && !document.querySelector('#chat-input:focus') || !document.querySelector('.chat-messages .message-row')) { render(); document.querySelector('.chat-messages')?.scrollTo({ top: 1e9 }); }
    else if (changed) { const list = document.querySelector('.chat-messages'); if (list) { list.innerHTML = state.chatMessages.map(messageBubble).join(''); list.scrollTo({ top: 1e9 }); } }
  } catch (error) { showToast(error.message); }
}

async function sendChatMessage(payload) {
  const id = state.activeConversationId;
  try {
    const { message } = await apiRequest(`/conversations/${id}/messages`, { method: 'POST', body: payload });
    if (state.activeConversationId !== id) return;
    state.chatMessages = [...state.chatMessages, message];
    const conversation = state.conversations.find((item) => item.id === id);
    if (conversation) {
      Object.assign(conversation, { lastMessage: message.body, updatedAt: message.createdAt });
      const item = document.querySelector(`.conversation-item[data-conversation="${id}"]`);
      if (item) { item.outerHTML = conversationListItem(conversation); document.querySelector(`.conversation-item[data-conversation="${id}"]`)?.addEventListener('click', () => openConversation(id)); }
    }
    const list = document.querySelector('.chat-messages');
    if (list) { list.innerHTML = state.chatMessages.map(messageBubble).join(''); list.scrollTo({ top: 1e9 }); }
  } catch (error) { showToast(error.message); }
}

// Envia um arquivo para o armazenamento da API (fotos, PDFs e áudios).
async function uploadMedia(blob, { privateFile = false } = {}) {
  const token = loadSessionToken();
  const response = await fetch(`${API_URL}/media${privateFile ? '?privado=1' : ''}`, { method: 'POST', headers: { 'Content-Type': blob.type || 'application/octet-stream', Authorization: `Bearer ${token}` }, body: blob });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Não foi possível enviar o arquivo.');
  return data;
}

async function acceptDelivery(orderId) {
  if (!window.confirm('Confirmar que os animais foram entregues? O pagamento retido será liberado para a fazenda e para o frete.')) return;
  try {
    await apiRequest(`/orders/${orderId}/accept`, { method: 'POST' });
    const [{ conversations }, { orders }] = await Promise.all([apiRequest('/conversations'), apiRequest('/orders')]);
    Object.assign(state, { conversations, orders });
    await refreshActiveChat();
    render();
    showToast(`Entrega confirmada. Pagamento do pedido ${orderId} liberado.`);
  } catch (error) { showToast(error.message); }
}

function bindMessagesEvents() {
  bindShellEvents();
  bindLotEvents();
  if (!state.activeConversationId && state.conversations.length && window.innerWidth > 720) { openConversation(state.conversations[0].id); return; }
  clearInterval(chatPollTimer);
  chatPollTimer = setInterval(() => { if (state.page === 'messages' && !document.hidden) refreshActiveChat(); else clearInterval(chatPollTimer); }, 8000);
  if (state.activeConversationId && !state.chatMessages.length) refreshActiveChat();
  document.querySelector('.chat-messages')?.scrollTo({ top: 1e9 });
  document.querySelectorAll('[data-conversation]').forEach((el) => el.addEventListener('click', () => openConversation(Number(el.dataset.conversation))));
  document.querySelector('#message-search')?.addEventListener('input', (event) => { state.messageQuery = event.target.value; render(); setTimeout(() => { const input = document.querySelector('#message-search'); input?.focus(); input?.setSelectionRange(state.messageQuery.length, state.messageQuery.length); }, 0); });
  document.querySelector('#chat-attachment')?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { showToast('O anexo deve ter no máximo 10 MB.'); return; }
    try {
      showToast('Enviando anexo…');
      const uploaded = await uploadMedia(file);
      await sendChatMessage({ kind: 'anexo', body: file.name, attachment: { url: uploaded.url, name: file.name, type: file.type, size: file.size } });
    } catch (error) { showToast(error.message); }
  });
  document.querySelector('#chat-form')?.addEventListener('submit', (event) => { event.preventDefault(); const input = document.querySelector('#chat-input'); const text = input?.value.trim(); if (!text) return; input.value = ''; sendChatMessage({ kind: 'texto', body: text }); input.focus(); });
  document.querySelectorAll('[data-chat-action="attach"]').forEach((el) => el.addEventListener('click', () => document.querySelector('#chat-attachment')?.click()));
  document.querySelectorAll('[data-chat-action="record"]').forEach((el) => el.addEventListener('click', () => { if (state.recording) stopAudioRecording(); else startAudioRecording(); }));
  document.querySelectorAll('[data-chat-action="accept"]').forEach((el) => el.addEventListener('click', () => acceptDelivery(el.dataset.orderId)));
}

async function loadFreightHub() {
  try { state.freightHub = { ...(await apiRequest('/me/freight')), loaded: true }; } catch (error) { state.freightHub.loaded = true; showToast(error.message); }
}

const paidOrders = () => state.orders.filter((order) => order.role === 'comprador' && ['retido', 'liberado'].includes(order.payment.status));
const orderTripStatus = (order) => (order.payment.status === 'liberado' ? 'Concluída' : 'Em andamento');
const tripStatusClass = (status) => ({ 'Em andamento': 'underway', 'Concluída': 'completed', Cancelada: 'completed' }[status] || 'scheduled');

// Viagens: as programadas na agenda da conta e as dos pedidos pagos no GadOn.
function freightTrips() {
  const fromOrders = paidOrders().map((order) => ({ id: `pedido-${order.id}`, orderId: order.id, date: (order.paidAt || order.createdAt).slice(0, 10), time: '', origin: order.origin || order.farm, destination: order.freight.destination, animals: order.heads || '', carrier: order.freight.partner, status: orderTripStatus(order), source: 'pedido' }));
  return [...state.freightHub.trips.map((trip) => ({ ...trip, source: 'agenda' })), ...fromOrders].sort((a, b) => `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`));
}

// Rotas: fretes contratados nos pedidos e cotações enviadas às transportadoras.
function freightRoutesList() {
  const requestStatus = { novo: 'Solicitada', contatado: 'Em negociação', fechado: 'Contratada' };
  const fromOrders = paidOrders().map((order) => ({ id: `pedido-${order.id}`, origin: order.origin || order.farm, destination: order.freight.destination, distanceKm: order.freight.distanceKm, price: order.freight.price, heads: order.heads, carrier: order.freight.partner, status: orderTripStatus(order) === 'Concluída' ? 'Concluída' : 'Contratada', contractedAt: formatDay(order.paidAt || order.createdAt) }));
  const fromRequests = state.freightHub.requests.filter((request) => request.kind === 'cotacao' && request.status !== 'cancelado').map((request) => ({ id: `cotacao-${request.id}`, origin: request.origin, destination: request.destination, distanceKm: request.distanceKm, price: request.price, heads: request.heads, carrier: request.carrier, status: requestStatus[request.status], contractedAt: formatDay(request.createdAt) }));
  return [...fromOrders, ...fromRequests];
}

function freightDocumentsList() {
  return state.freightHub.documents.map((document) => ({ ...document, status: document.status === 'emitido' ? 'Emitido' : 'Pendente', statusClass: document.status === 'emitido' ? 'issued' : 'pending', uploadedAt: formatDay(document.createdAt), expiresAt: document.expiresAt ? formatDay(document.expiresAt) : '' }));
}

const pendingGtaOrders = () => state.orders.filter((order) => order.role === 'comprador' && order.gta === 'aguardando_integracao');

function allTripsTemplate() {
  const trips = freightTrips();
  const totalAnimals = trips.reduce((sum, trip) => sum + (Number(trip.animals) || 0), 0);
  const scheduled = trips.filter((trip) => trip.status === 'Programada').length;
  const underway = trips.filter((trip) => trip.status === 'Em andamento').length;
  return `<section class="all-trips-panel"><div class="all-trips-heading"><div><p class="eyebrow">VISÃO CONSOLIDADA</p><h3>Todas as viagens marcadas</h3><p>Confira as operações cadastradas para analisar sua programação de fretes.</p></div><span class="panel-status">${trips.length} operação${trips.length === 1 ? '' : 'ões'}</span></div><div class="trip-analysis"><div><b>${trips.length}</b><small>Viagens</small></div><div><b>${totalAnimals}</b><small>Cabeças previstas</small></div><div><b>${scheduled}</b><small>Programadas</small></div><div><b>${underway}</b><small>Em andamento</small></div></div><div class="all-trips-list">${trips.length ? trips.map((trip) => { const date = formatShortDate(trip.date); const statusClass = tripStatusClass(trip.status); return `<article class="all-trip-row"><div class="date-box"><b>${date.day}</b><small>${date.month}</small></div><div class="all-trip-route"><strong>${escapeHtml(trip.origin)} → ${escapeHtml(trip.destination)}</strong><span>${escapeHtml(trip.carrier || 'Transportadora a selecionar')} · ${escapeHtml(trip.time || 'Horário não informado')} · ${escapeHtml(trip.animals || '0')} cabeças</span></div><em class="trip-badge ${statusClass}">${escapeHtml(trip.status || 'Programada')}</em>${trip.source === 'agenda' ? `<div class="trip-row-actions"><select data-trip-status="${trip.id}" aria-label="Status da viagem">${['Programada', 'Em andamento', 'Concluída', 'Cancelada'].map((status) => `<option ${trip.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select><button type="button" class="text-button danger" data-trip-delete="${trip.id}">Excluir</button></div>` : `<small class="trip-row-source">Pedido ${escapeHtml(trip.orderId)}</small>`}</article>`; }).join('') : '<div class="all-trips-empty">Nenhuma viagem marcada. Programe a primeira pelo formulário ao lado; as viagens dos seus pedidos pagos aparecem aqui automaticamente.</div>'}</div></section>`;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function easterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day, 12);
}

function nationalHolidaysForYear(year) {
  const holidays = {
    [`${year}-01-01`]: 'Confraternização Universal',
    [`${year}-04-21`]: 'Tiradentes',
    [`${year}-05-01`]: 'Dia Mundial do Trabalho',
    [`${year}-09-07`]: 'Independência do Brasil',
    [`${year}-10-12`]: 'Nossa Senhora Aparecida',
    [`${year}-11-02`]: 'Finados',
    [`${year}-11-15`]: 'Proclamação da República',
    [`${year}-11-20`]: 'Dia Nacional de Zumbi e da Consciência Negra',
    [`${year}-12-25`]: 'Natal',
  };
  const goodFriday = easterDate(year);
  goodFriday.setDate(goodFriday.getDate() - 2);
  holidays[dateKey(goodFriday)] = 'Paixão de Cristo';
  return holidays;
}

function calendarModalTemplate() {
  const year = state.calendarYear;
  const month = state.calendarMonth;
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const holidays = nationalHolidaysForYear(year);
  const monthHolidays = Object.entries(holidays).filter(([holidayDate]) => holidayDate.startsWith(prefix));
  const today = dateKey(new Date());
  const eventsByDay = freightTrips().filter((trip) => trip.date.startsWith(prefix)).reduce((map, trip) => { const day = Number(trip.date.slice(-2)); map[day] = map[day] || []; map[day].push(trip); return map; }, {});
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, index) => { if (index < firstDay) return '<div class="calendar-day empty"></div>'; const day = index - firstDay + 1; const events = eventsByDay[day] || []; const isToday = `${prefix}-${String(day).padStart(2, '0')}` === today; const holidayKey = `${prefix}-${String(day).padStart(2, '0')}`; const holidayName = holidays[holidayKey]; return `<div class="calendar-day ${isToday ? 'today' : ''} ${holidayName ? 'holiday-day' : ''}" title="${holidayName ? 'Feriado nacional: ' + escapeHtml(holidayName) : ''}"><b>${day}</b>${holidayName ? `<span class="holiday-indicator">${icon('flag', 11)}<em>Feriado</em></span><small class="holiday-name">${escapeHtml(holidayName)}</small>` : ''}${events.map((trip) => `<span class="calendar-event ${trip.status === 'Em andamento' ? 'current-event' : ''}">${escapeHtml(trip.origin.split(' - ')[0])} → ${escapeHtml(trip.destination.split(' - ')[0])}</span>`).join('')}</div>`; }).join('');
  return `<div class="calendar-backdrop"><div class="calendar-dialog"><div class="calendar-dialog-head"><div><p class="eyebrow">AGENDA DE VIAGENS</p><h2>Programar frete futuro</h2><p>Escolha uma data e organize a próxima coleta.</p></div><button class="modal-close" data-freight-action="close-calendar">${icon('close', 19)}</button></div><div class="calendar-layout"><div class="calendar-view"><div class="calendar-month"><button data-calendar-nav="prev">${icon('back', 15)}</button><strong>${monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}</strong><button data-calendar-nav="next">${icon('chevron', 15)}</button></div><div class="calendar-weekdays"><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span><span>DOM</span></div><div class="calendar-grid">${cells}</div><div class="calendar-legend"><span><i class="legend-current"></i> Em andamento</span><span><i class="legend-scheduled"></i> Programada</span><span><i class="legend-today"></i> Hoje</span><span><i class="legend-holiday"></i> Feriado nacional</span></div>${monthHolidays.length ? `<div class="calendar-holiday-list"><strong>Feriados nacionais neste mês</strong>${monthHolidays.map(([holidayDate, holidayName]) => `<span>${holidayDate.slice(-2)} · ${escapeHtml(holidayName)}</span>`).join('')}</div>` : ''}</div><form id="calendar-form" class="calendar-form"><div class="calendar-form-heading"><span class="module-icon blue-bg">${icon('calendar', 19)}</span><div><h3>Nova viagem</h3><p>Os dados aparecerão na agenda.</p></div></div><label><span>Data da coleta <b>*</b></span><input name="date" type="date" min="${today}" required /></label><label><span>Horário previsto</span><input name="time" type="time" value="08:00" /></label><label><span>Origem <b>*</b></span><input name="origin" placeholder="Campo Verde - MT" value="${escapeHtml(state.profile.location || '')}" required /></label><label><span>Destino <b>*</b></span><input name="destination" placeholder="Goiânia - GO" required /></label><label><span>Quantidade de animais <b>*</b></span><div class="freight-unit"><input name="animals" type="number" min="1" placeholder="80" required /><em>cabeças</em></div></label><label><span>Transportadora</span><select name="carrier"><option>Transportadora Boiadeiro</option><option value="">A selecionar</option></select></label><button type="submit" class="primary-button">Programar viagem ${icon('arrow', 15)}</button><small class="calendar-form-note">Você poderá adicionar os documentos da viagem depois.</small></form></div>${allTripsTemplate()}</div></div>`;
}

function freightDocumentModalTemplate() {
  const trips = freightTrips().filter((trip) => !['Concluída', 'Cancelada'].includes(trip.status));
  return `<div class="document-modal-backdrop"><section class="document-modal" role="dialog" aria-modal="true" aria-label="Adicionar documento"><div class="document-modal-head"><div><p class="eyebrow">GESTÃO DE DOCUMENTOS</p><h2>Adicionar documento</h2><p>Vincule o arquivo à viagem correta para manter a operação organizada.</p></div><button type="button" class="modal-close" data-freight-action="close-document">${icon('close', 19)}</button></div><form id="freight-document-form" class="document-form"><label><span>Tipo de documento <b>*</b></span><select name="type" required><option value="GTA">GTA</option><option value="CT-e">CT-e</option><option value="NF-e">Nota fiscal (NF-e)</option><option value="CDE">Comprovante de entrega</option><option value="Vacinação">Certificado de vacinação</option><option value="Exames">Exame de brucelose / tuberculose</option><option value="Outro">Outro documento</option></select></label><label><span>Viagem relacionada</span><select name="trip"><option value="">Sem viagem vinculada</option>${trips.map((trip) => `<option value="${escapeHtml(`${trip.orderId ? `Pedido ${trip.orderId}` : formatDay(trip.date)} · ${trip.origin} → ${trip.destination}`)}">${escapeHtml(`${trip.origin} → ${trip.destination} · ${trip.orderId ? `pedido ${trip.orderId}` : formatDay(trip.date)}`)}</option>`).join('')}</select></label><label><span>Arquivo <b>*</b></span><div class="document-upload-field"><input id="freight-document-file" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" required /><span>${icon('upload', 18)} <strong>Escolher arquivo</strong><small id="freight-document-file-name">PDF ou imagem até 10 MB</small></span></div></label><div class="document-form-grid"><label><span>Situação</span><select name="status"><option value="pendente">Pendente</option><option value="emitido">Emitido</option></select></label><label><span>Validade</span><input name="expiresAt" type="date" /></label><label><span>Identificação / número</span><input name="reference" placeholder="Ex.: GTA-MT-2026-00284" /></label></div><label><span>Observações</span><textarea name="notes" rows="3" placeholder="Inclua alguma informação importante sobre o documento..."></textarea></label><div class="document-form-actions"><button type="button" class="secondary-button" data-freight-action="close-document">Cancelar</button><button type="submit" class="primary-button">Salvar documento ${icon('arrow', 15)}</button></div></form></section></div>`;
}

function freightDocumentListTemplate() {
  // GTA das compras: emissão automática assim que a integração com o órgão estadual estiver ativa.
  const gtaRows = pendingGtaOrders().map((order) => `<div class="document-row gta-auto-row"><span class="doc-type">GTA</span><div><strong>GTA automática · pedido ${escapeHtml(order.id)}</strong><small>${escapeHtml(order.farm)} → ${escapeHtml(order.freight.destination)} · emissão automática aguardando integração com o órgão estadual</small></div><em class="doc-badge pending">Em integração</em><button type="button" title="Emissão automática em integração">${icon('clock', 15)}</button></div>`).join('');
  const rows = freightDocumentsList().slice(0, 4).map((document) => `<div class="document-row"><span class="doc-type">${escapeHtml(document.type)}</span><div><strong>${escapeHtml(document.name)}</strong><small>${escapeHtml(document.trip)}${document.expiresAt ? ` · validade ${escapeHtml(document.expiresAt)}` : ''}</small></div><em class="doc-badge ${escapeHtml(document.statusClass || 'pending')}">${escapeHtml(document.status || 'Enviado')}</em><button type="button" title="Baixar documento" aria-label="Baixar ${escapeHtml(document.name)}" data-freight-doc-open="${document.id}">${icon('download', 15)}</button></div>`).join('');
  return gtaRows + rows || '<div class="document-empty">Nenhum documento adicionado ainda.</div>';
}

function documentManagerRowTemplate(document) {
  const metadata = [document.fileName, document.uploadedAt ? `adicionado em ${document.uploadedAt}` : '', document.expiresAt ? `validade ${document.expiresAt}` : ''].filter(Boolean).join(' · ');
  return `<article class="document-manager-row"><span class="doc-type">${escapeHtml(document.type)}</span><div class="document-manager-main"><strong>${escapeHtml(document.name)}</strong><span>${escapeHtml(document.trip)}</span><small>${escapeHtml(metadata || 'Arquivo vinculado à operação')}</small>${document.notes ? `<p>${escapeHtml(document.notes)}</p>` : ''}</div><em class="doc-badge ${escapeHtml(document.statusClass || 'pending')}">${escapeHtml(document.status || 'Pendente')}</em><div class="document-row-actions"><button type="button" class="secondary-button" data-freight-doc-open="${document.id}">${icon('download', 14)} Baixar</button>${document.statusClass === 'issued' ? '' : `<button type="button" class="secondary-button" data-freight-doc-issued="${document.id}">Marcar como emitido</button>`}<button type="button" class="text-button danger" data-freight-doc-delete="${document.id}">Excluir</button></div></article>`;
}

function freightDocumentsFullTemplate() {
  const documents = freightDocumentsList();
  const issued = documents.filter((document) => document.statusClass === 'issued');
  const pending = documents.filter((document) => document.statusClass !== 'issued');
  const filtered = state.freightDocumentsView === 'all' ? documents : documents.filter((document) => (document.statusClass || 'pending') === state.freightDocumentsView);
  const tabs = [['all', 'Todos', documents.length], ['issued', 'Emitidos', issued.length], ['pending', 'Pendentes', pending.length]];
  return `<div class="document-manager-backdrop"><section class="document-manager" role="dialog" aria-modal="true" aria-label="Todos os documentos de frete"><div class="document-manager-head"><div><p class="eyebrow">GESTÃO DE DOCUMENTOS</p><h2>Todos os documentos</h2><p>Consulte o histórico emitido e acompanhe o que ainda precisa de atenção.</p></div><button type="button" class="modal-close" data-freight-action="close-all-documents">${icon('close', 19)}</button></div><div class="document-manager-summary"><div class="document-manager-stat"><span class="blue-bg">${icon('file', 16)}</span><div><strong>${documents.length}</strong><small>Total registrado</small></div></div><div class="document-manager-stat issued"><span>${icon('shield', 16)}</span><div><strong>${issued.length}</strong><small>Emitidos</small></div></div><div class="document-manager-stat pending"><span>${icon('bell', 16)}</span><div><strong>${pending.length}</strong><small>Pendentes</small></div></div></div><div class="document-manager-toolbar"><div class="document-status-tabs">${tabs.map(([value, label, count]) => `<button type="button" class="document-status-tab ${state.freightDocumentsView === value ? 'active' : ''}" data-document-view="${value}" aria-pressed="${state.freightDocumentsView === value}">${label}<b>${count}</b></button>`).join('')}</div><button type="button" class="primary-button" data-freight-action="documents">${icon('plus', 15)} Adicionar documento</button></div><div class="document-manager-list">${filtered.length ? filtered.map(documentManagerRowTemplate).join('') : '<div class="document-manager-empty">Nenhum documento nesta categoria.</div>'}</div></section></div>`;
}

function freightRoutesFullTemplate() {
  const routes = freightRoutesList();
  const totalDistance = routes.reduce((sum, route) => sum + Number(route.distanceKm || 0), 0);
  const totalPrice = routes.reduce((sum, route) => sum + Number(route.price || 0), 0);
  const formatPrice = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  return `<div class="route-table-backdrop"><section class="route-table-modal" role="dialog" aria-modal="true" aria-label="Tabela completa de rotas contratadas"><div class="route-table-modal-head"><div><p class="eyebrow">TABELA DE DISTÂNCIA</p><h2>Rotas contratadas</h2><p>Consulte todas as operações registradas, com origem, destino, distância e preço contratado.</p></div><button type="button" class="modal-close" data-freight-action="close-routes">${icon('close', 19)}</button></div><div class="route-table-summary"><div><span>${icon('route', 16)}</span><strong>${routes.length}</strong><small>Rotas contratadas</small></div><div><span>${icon('pin', 16)}</span><strong>${totalDistance.toLocaleString('pt-BR')} km</strong><small>Distância total</small></div><div><span>${icon('file', 16)}</span><strong>${formatPrice(totalPrice)}</strong><small>Valor contratado</small></div></div><div class="route-table-scroll"><table class="full-route-table"><thead><tr><th>Origem</th><th>Destino</th><th>Distância</th><th>Preço contratado</th><th>Transportadora</th><th>Status</th></tr></thead><tbody>${routes.length ? routes.map((route) => { const statusClass = route.status === 'Contratada' ? 'contracted' : route.status === 'Concluída' ? 'underway' : 'scheduled'; return `<tr><td>${icon('pin', 13)}<strong>${escapeHtml(route.origin)}</strong></td><td>${icon('pin', 13)}<strong>${escapeHtml(route.destination)}</strong></td><td>${route.distanceKm ? `${Number(route.distanceKm).toLocaleString('pt-BR')} km` : '—'}</td><td class="route-price">${route.price ? formatPrice(Number(route.price)) : '—'}</td><td>${escapeHtml(route.carrier || 'Transportadora a selecionar')}<small>Contratada em ${escapeHtml(route.contractedAt || 'data não informada')}</small></td><td><em class="route-status-badge ${statusClass}">${escapeHtml(route.status || 'Contratada')}</em></td></tr>`; }).join('') : '<tr><td colspan="6" class="route-table-empty">Nenhuma rota ainda. Cote um frete ou compre um lote com frete incluído.</td></tr>'}</tbody></table></div><div class="route-table-note">Os valores exibidos correspondem às contratações registradas no sistema e devem ser conferidos no contrato do frete.</div></section></div>`;
}

function csvRow(values) {
  return values.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(';');
}

function downloadFreightReport() {
  const generatedAt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
  const routes = freightRoutesList();
  const trips = freightTrips();
  const documents = freightDocumentsList();
  const totalDistance = routes.reduce((sum, route) => sum + Number(route.distanceKm || 0), 0);
  const totalPrice = routes.reduce((sum, route) => sum + Number(route.price || 0), 0);
  const rows = [
    ['RELATÓRIO CONSOLIDADO DE FRETES'],
    ['Gerado em', generatedAt],
    [],
    ['RESUMO OPERACIONAL'],
    ['Indicador', 'Valor'],
    ['Rotas (fretes e cotações)', routes.length],
    ['Distância total', `${totalDistance.toLocaleString('pt-BR')} km`],
    ['Valor contratado', new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)],
    ['Viagens registradas', trips.length],
    ['Documentos registrados', documents.length],
    ['Documentos pendentes', documents.filter((document) => document.statusClass !== 'issued').length],
    [],
    ['ROTAS'],
    ['Origem', 'Destino', 'Distância', 'Preço contratado', 'Transportadora', 'Status', 'Data da contratação'],
    ...routes.map((route) => [route.origin, route.destination, route.distanceKm ? `${route.distanceKm} km` : '', route.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(route.price)) : '', route.carrier, route.status, route.contractedAt]),
    [],
    ['VIAGENS REGISTRADAS'],
    ['Data', 'Horário', 'Origem', 'Destino', 'Animais', 'Transportadora', 'Status'],
    ...trips.map((trip) => [formatDay(trip.date), trip.time, trip.origin, trip.destination, trip.animals, trip.carrier, trip.status]),
    [],
    ['DOCUMENTOS DE FRETE'],
    ['Tipo', 'Identificação', 'Viagem', 'Status', 'Arquivo', 'Adicionado em', 'Validade', 'Observações'],
    ...documents.map((document) => [document.type, document.name, document.trip, document.status, document.fileName, document.uploadedAt, document.expiresAt, document.notes]),
  ];
  const csv = `\uFEFF${rows.map(csvRow).join('\r\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio-fretes-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast('Relatório completo exportado em CSV.');
}

function freightTemplate() {
  const hub = state.freightHub;
  const trips = freightTrips();
  const routes = freightRoutesList();
  const documents = freightDocumentsList();
  const upcoming = trips.filter((trip) => !['Concluída', 'Cancelada'].includes(trip.status));
  const underway = trips.filter((trip) => trip.status === 'Em andamento');
  const openRequests = hub.requests.filter((request) => ['novo', 'contatado'].includes(request.status));
  const pendingDocs = documents.filter((document) => document.statusClass !== 'issued').length + pendingGtaOrders().length;
  const stats = [['blue-bg', 'truck', underway.length, 'Viagens em andamento'], ['orange-bg', 'file', openRequests.length, 'Pedidos de frete em aberto'], ['green-bg', 'repeat', hub.returnRoutes, 'Voltas vazias no Radar'], ['purple-bg', 'bell', pendingDocs, 'Documentos pendentes']];
  const modules = [['quote', 'file', 'Painel da Cotação', 'Cote e peça o frete'], ['distance', 'route', 'Tabela de Distância', 'Rotas, km e valores'], ['schedule', 'calendar', 'Agenda de Viagens', 'Coletas e entregas'], ['documents', 'file', 'Gestão de Documentos', 'GTA, CT-e e comprovantes'], ['status', 'pin', 'Status da Viagem', 'Acompanhe cada etapa'], ['reports', 'chart', 'Relatórios', 'Indicadores da operação']];
  const estimate = state.freightEstimate;
  const quoteResult = estimate ? `<div class="quote-result"><div class="quote-result-head"><strong>${escapeHtml(estimate.origin)} → ${escapeHtml(estimate.destination)}</strong><span>${estimate.distanceKm.toLocaleString('pt-BR')} km ${estimate.real ? 'pela estrada' : 'estimados'}${estimate.hours ? ` · ~${String(estimate.hours).replace('.', ',')} h de viagem` : ''} · ${estimate.heads} cabeças</span></div>${estimate.quotes.map((quote) => `<div class="quote-option"><div><b>${escapeHtml(quote.partner)}</b><small>${formatBRL(Math.round(quote.price / estimate.heads))} por cabeça</small></div><strong>${formatBRL(quote.price)}</strong><button type="button" class="primary-button" data-freight-request="${quote.id}">Pedir este frete</button></div>`).join('')}<label class="quote-phone"><span>Telefone para a transportadora falar com você <b>*</b></span><input id="freight-request-phone" type="tel" autocomplete="tel" value="${escapeHtml(state.profile.phone || '')}" placeholder="(00) 00000-0000" /></label></div>` : '';
  const requestLabels = { novo: ['Enviado', 'scheduled'], contatado: ['Em contato', 'underway'], fechado: ['Fechado', 'completed'], cancelado: ['Cancelado', 'completed'] };
  const requestList = hub.requests.length ? `<div class="freight-requests"><strong>Seus pedidos de frete</strong>${hub.requests.slice(0, 4).map((request) => { const [label, statusClass] = requestLabels[request.status]; return `<div class="freight-request-row"><div><b>${escapeHtml(request.origin)} → ${escapeHtml(request.destination)}</b><small>${request.kind === 'volta' ? `Volta vazia do Radar · ${escapeHtml(request.cargoType)}` : `${request.heads} cabeças${request.pickupDate ? ` · coleta ${formatDay(request.pickupDate)}` : ''}`} · ${escapeHtml(request.carrier)}${request.price ? ` · ${formatBRL(request.price)}` : ''}</small></div><em class="trip-badge ${statusClass}">${label}</em></div>`; }).join('')}</div>` : '';
  const routeRows = routes.length ? routes.slice(0, 4).map((route) => `<div class="route-row"><span>${icon('route', 14)} ${escapeHtml(route.origin)} → ${escapeHtml(route.destination)}</span><b>${route.distanceKm ? `${Number(route.distanceKm).toLocaleString('pt-BR')} km` : '—'}</b><strong>${route.price ? formatBRL(route.price) : '—'}</strong></div>`).join('') : '<div class="freight-empty">As rotas dos fretes que você cotar ou contratar aparecem aqui, com distância e valor.</div>';
  const tripRows = upcoming.length ? upcoming.slice(0, 3).map((trip) => { const date = formatShortDate(trip.date); return `<div class="trip-item"><div class="date-box"><b>${date.day}</b><small>${date.month}</small></div><div><strong>${escapeHtml(trip.origin)} → ${escapeHtml(trip.destination)}</strong><span>${trip.animals ? `${trip.animals} cabeças · ` : ''}${escapeHtml(trip.carrier || 'Transportadora a selecionar')}</span></div><em class="trip-badge ${tripStatusClass(trip.status)}">${escapeHtml(trip.status)}</em></div>`; }).join('') : '<div class="freight-empty">Nenhuma viagem programada. Use “Ver calendário” para marcar a próxima coleta.</div>';
  const current = underway.find((trip) => trip.source === 'pedido') || underway[0];
  const statusPanel = current ? `<div class="freight-panel-heading"><div><p class="eyebrow">STATUS DA VIAGEM</p><h2>${current.orderId ? `Pedido ${escapeHtml(current.orderId)}` : `Viagem de ${formatDay(current.date)}`}</h2></div><span class="panel-status green-status"><span class="online-dot"></span> Em rota</span></div><div class="status-route"><div class="status-point done"><i>${icon('pin', 14)}</i><span><b>${escapeHtml(current.origin)}</b><small>${current.orderId ? 'Pagamento confirmado e retido' : 'Saída'} · ${formatDay(current.date)}${current.time ? `, ${escapeHtml(current.time)}` : ''}</small></span></div><div class="status-line"><i></i></div><div class="status-point current"><i>${icon('truck', 14)}</i><span><b>Em transporte · ${escapeHtml(current.carrier || 'transportadora')}</b><small>${current.animals ? `${current.animals} cabeças` : 'Carga em rota'}</small></span></div><div class="status-line muted-line"><i></i></div><div class="status-point pending"><i>${icon('pin', 14)}</i><span><b>${escapeHtml(current.destination)}</b><small>${current.orderId ? 'Entrega e aceite liberam o pagamento' : 'Chegada prevista'}</small></span></div></div><div class="status-actions">${current.orderId ? `<button type="button" class="primary-button" data-freight-accept="${escapeHtml(current.orderId)}">Confirmar entrega</button>` : `<button type="button" class="primary-button" data-trip-finish="${current.id}">Marcar como concluída</button>`}<small>${icon('clock', 13)} A localização em tempo real chega com a integração da transportadora.</small></div>` : `<div class="freight-panel-heading"><div><p class="eyebrow">STATUS DA VIAGEM</p><h2>Nenhuma viagem em rota</h2></div></div><div class="freight-empty">Quando uma viagem estiver em andamento, as etapas aparecem aqui.</div>`;
  const concluded = trips.filter((trip) => trip.status === 'Concluída').length;
  const priced = routes.filter((route) => route.price && route.heads);
  const perHead = priced.length ? Math.round(priced.reduce((sum, route) => sum + route.price, 0) / priced.reduce((sum, route) => sum + Number(route.heads), 0)) : 0;
  const withKm = routes.filter((route) => route.distanceKm);
  const averageKm = withKm.length ? Math.round(withKm.reduce((sum, route) => sum + Number(route.distanceKm), 0) / withKm.length) : 0;
  const reports = [['Fretes concluídos', concluded, `${trips.length} viage${trips.length === 1 ? 'm' : 'ns'} no total`, ''], ['Custo médio / cabeça', perHead ? formatBRL(perHead) : '—', `${priced.length} frete${priced.length === 1 ? '' : 's'} com valor`, ''], ['Distância média', averageKm ? `${averageKm.toLocaleString('pt-BR')} km` : '—', `${withKm.length} rota${withKm.length === 1 ? '' : 's'}`, ''], ['Documentos pendentes', pendingDocs, pendingDocs ? 'Requer atenção' : 'Tudo em dia', pendingDocs ? 'warning' : 'positive']];
  const loading = !hub.loaded ? '<p class="freight-loading">Carregando seus fretes…</p>' : '';
  return `<div class="app-shell freight-shell">${appSidebarTemplate()}<main class="main-content">${appTopbarTemplate('Fretes')}<div class="freight-page"><div class="freight-heading"><div><p class="eyebrow">OPERAÇÃO DE FRETE</p><h1>Fretes</h1><p>Cote, peça e acompanhe o transporte dos seus animais em um só lugar.</p></div><button class="primary-button" data-freight-action="new-quote">${icon('plus', 16)} Nova cotação</button></div>${loading}<section class="freight-stats">${stats.map(([color, ico, value, label]) => `<div><span class="freight-stat-icon ${color}">${icon(ico, 18)}</span><span><b>${value}</b><small>${label}</small></span></div>`).join('')}</section><section class="freight-modules">${modules.map(([id, ico, title, desc]) => `<button class="freight-module-card" data-freight-scroll="${id}"><span class="module-icon blue-bg">${icon(ico, 21)}</span><span><b>${title}</b><small>${desc}</small></span>${icon('chevron', 15)}</button>`).join('')}</section><div class="freight-grid"><section class="freight-panel quote-panel" id="freight-quote"><div class="freight-panel-heading"><div><p class="eyebrow">PAINEL DA COTAÇÃO</p><h2>Cote um frete</h2></div><span class="panel-status">${estimate ? 'Cotação pronta' : 'Nova cotação'}</span></div><form id="freight-quote-form" class="quote-form"><label><span>Origem</span><input name="origin" value="${escapeHtml(estimate?.origin || state.profile.location || '')}" placeholder="Campo Verde - MT" required /></label><label><span>Destino</span><input name="destination" value="${escapeHtml(estimate?.destination || '')}" placeholder="Goiânia - GO" required /></label><label><span>Quantidade</span><div class="freight-unit"><input name="animals" type="number" min="1" value="${estimate?.heads || ''}" placeholder="80" required /><em>cabeças</em></div></label><label><span>Data da coleta</span><input name="pickup" type="date" min="${dateKey(new Date())}" value="${estimate?.pickupDate || ''}" /></label><label class="quote-full"><span>Finalidade</span><select name="purpose">${['Engorda', 'Abate', 'Reprodução', 'Recria', 'Cria'].map((purpose) => `<option ${estimate?.purpose === purpose ? 'selected' : ''}>${purpose}</option>`).join('')}</select></label><button type="submit" class="primary-button quote-full">Calcular frete ${icon('arrow', 15)}</button></form>${quoteResult}<div class="quote-note">${icon('shield', 14)} Valor calculado pela distância real na estrada. O pedido vai para a transportadora parceira, que confirma com você.</div>${requestList}</section><section class="freight-panel" id="freight-distance"><div class="freight-panel-heading"><div><p class="eyebrow">TABELA DE DISTÂNCIA</p><h2>Suas rotas</h2></div><button class="panel-link" data-freight-action="all-routes">Ver tabela completa ${icon('arrow', 14)}</button></div><div class="route-table">${routes.length ? '<div class="route-row route-head"><span>Origem → destino</span><span>Distância</span><span>Valor</span></div>' : ''}${routeRows}</div></section><section class="freight-panel" id="freight-schedule"><div class="freight-panel-heading"><div><p class="eyebrow">AGENDA DE VIAGENS</p><h2>Próximas operações</h2></div><button class="panel-link" data-freight-action="calendar">Ver calendário ${icon('arrow', 14)}</button></div><div class="trip-list">${tripRows}</div></section><section class="freight-panel" id="freight-documents"><div class="freight-panel-heading"><div><p class="eyebrow">GESTÃO DE DOCUMENTOS</p><h2>Documentos recentes</h2></div><div class="document-panel-actions"><button class="panel-link" data-freight-action="all-documents">Ver todos ${icon('arrow', 14)}</button><button class="panel-link" data-freight-action="documents">${icon('plus', 14)} Adicionar documento</button></div></div><div class="document-list">${freightDocumentListTemplate()}</div></section><section class="freight-panel status-panel" id="freight-status">${statusPanel}</section><section class="freight-panel reports-panel" id="freight-reports"><div class="freight-panel-heading"><div><p class="eyebrow">RELATÓRIOS</p><h2>Indicadores da operação</h2></div><button class="panel-link" data-freight-action="report">${icon('download', 14)} Exportar</button></div><div class="report-grid">${reports.map(([label, value, note, tone]) => `<div><span>${label}</span><b>${value}</b><small class="${tone}">${note}</small></div>`).join('')}</div></section></div></div></main></div>${state.freightCalendarOpen ? calendarModalTemplate() : ''}${state.freightDocumentsOpen ? freightDocumentModalTemplate() : ''}${state.freightDocumentsFullOpen ? freightDocumentsFullTemplate() : ''}${state.freightRoutesOpen ? freightRoutesFullTemplate() : ''}${toastTemplate()}`;
}

function bindFreightEvents() {
  bindShellEvents();
  document.querySelectorAll('[data-freight-scroll]').forEach((el) => el.addEventListener('click', () => document.querySelector(`#freight-${el.dataset.freightScroll}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })));
  document.querySelector('[data-freight-action="new-quote"]')?.addEventListener('click', () => { state.freightEstimate = null; render(); document.querySelector('#freight-quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  document.querySelector('[data-freight-action="all-routes"]')?.addEventListener('click', () => { state.freightRoutesOpen = true; state.freightCalendarOpen = false; state.freightDocumentsOpen = false; render(); });
  document.querySelectorAll('[data-freight-action="close-routes"]').forEach((el) => el.addEventListener('click', () => { state.freightRoutesOpen = false; render(); }));
  document.querySelector('[data-freight-action="calendar"]')?.addEventListener('click', () => { state.freightCalendarOpen = true; render(); });
  document.querySelector('[data-freight-action="close-calendar"]')?.addEventListener('click', () => { state.freightCalendarOpen = false; render(); });
  document.querySelectorAll('[data-calendar-nav]').forEach((el) => el.addEventListener('click', () => { const direction = el.dataset.calendarNav === 'next' ? 1 : -1; const next = new Date(state.calendarYear, state.calendarMonth + direction, 1); state.calendarYear = next.getFullYear(); state.calendarMonth = next.getMonth(); render(); }));
  const submitting = (form, busy) => { const button = form.querySelector('[type="submit"]'); if (button) button.disabled = busy; };
  document.querySelector('#calendar-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    submitting(form, true);
    try {
      const { trip } = await apiRequest('/me/freight/trips', { method: 'POST', body: { date: data.date, time: data.time, origin: data.origin, destination: data.destination, animals: Number(data.animals), carrier: data.carrier } });
      state.freightHub.trips = [...state.freightHub.trips, trip];
      render();
      showToast('Viagem programada na agenda.');
    } catch (error) { submitting(form, false); showToast(error.message); }
  });
  const updateTrip = async (id, status) => {
    try {
      const { trip } = await apiRequest(`/me/freight/trips/${id}`, { method: 'PATCH', body: { status } });
      state.freightHub.trips = state.freightHub.trips.map((item) => (item.id === trip.id ? trip : item));
      render();
      showToast(`Viagem marcada como ${status.toLowerCase()}.`);
    } catch (error) { showToast(error.message); }
  };
  document.querySelectorAll('[data-trip-status]').forEach((el) => el.addEventListener('change', () => updateTrip(el.dataset.tripStatus, el.value)));
  document.querySelectorAll('[data-trip-finish]').forEach((el) => el.addEventListener('click', () => updateTrip(el.dataset.tripFinish, 'Concluída')));
  document.querySelectorAll('[data-trip-delete]').forEach((el) => el.addEventListener('click', async () => {
    if (!window.confirm('Excluir esta viagem da agenda?')) return;
    try { await apiRequest(`/me/freight/trips/${el.dataset.tripDelete}`, { method: 'DELETE' }); state.freightHub.trips = state.freightHub.trips.filter((trip) => trip.id !== Number(el.dataset.tripDelete)); render(); showToast('Viagem excluída.'); } catch (error) { showToast(error.message); }
  }));
  document.querySelectorAll('[data-freight-accept]').forEach((el) => el.addEventListener('click', () => acceptDelivery(el.dataset.freightAccept)));
  document.querySelector('#freight-quote-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    submitting(form, true);
    try {
      state.freightEstimate = { ...(await apiRequest('/freight/estimate', { method: 'POST', body: { origin: data.origin, destination: data.destination, heads: Number(data.animals) } })), pickupDate: data.pickup, purpose: data.purpose };
      render();
      document.querySelector('.quote-result')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) { submitting(form, false); showToast(error.message); }
  });
  document.querySelectorAll('[data-freight-request]').forEach((el) => el.addEventListener('click', async () => {
    const estimate = state.freightEstimate;
    const phone = document.querySelector('#freight-request-phone')?.value.trim() || '';
    if (phone.replace(/\D/g, '').length < 10) { showToast('Informe um telefone com DDD para a transportadora falar com você.'); document.querySelector('#freight-request-phone')?.focus(); return; }
    el.disabled = true;
    try {
      await apiRequest('/freight/requests', { method: 'POST', body: { origin: estimate.origin, destination: estimate.destination, heads: estimate.heads, pickupDate: estimate.pickupDate, purpose: estimate.purpose, partnerId: el.dataset.freightRequest, phone } });
      state.freightEstimate = null;
      await loadFreightHub();
      render();
      showToast('Pedido de frete enviado. A transportadora vai falar com você.');
    } catch (error) { el.disabled = false; showToast(error.message); }
  }));
  document.querySelectorAll('[data-freight-action="documents"]').forEach((el) => el.addEventListener('click', () => { state.freightDocumentsOpen = true; state.freightDocumentsFullOpen = false; state.freightCalendarOpen = false; render(); }));
  document.querySelector('[data-freight-action="all-documents"]')?.addEventListener('click', () => { state.freightDocumentsFullOpen = true; state.freightDocumentsView = 'all'; state.freightDocumentsOpen = false; state.freightCalendarOpen = false; render(); });
  document.querySelectorAll('[data-freight-action="close-all-documents"]').forEach((el) => el.addEventListener('click', () => { state.freightDocumentsFullOpen = false; render(); }));
  document.querySelectorAll('[data-document-view]').forEach((el) => el.addEventListener('click', () => { state.freightDocumentsView = el.dataset.documentView; render(); }));
  document.querySelectorAll('[data-freight-action="close-document"]').forEach((el) => el.addEventListener('click', () => { state.freightDocumentsOpen = false; render(); }));
  document.querySelector('#freight-document-file')?.addEventListener('change', (event) => { const file = event.target.files?.[0]; const label = document.querySelector('#freight-document-file-name'); if (file && label) label.textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB`; });
  document.querySelector('#freight-document-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const file = document.querySelector('#freight-document-file')?.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { showToast('O documento deve ter no máximo 10 MB.'); return; }
    const data = Object.fromEntries(new FormData(form).entries());
    submitting(form, true);
    try {
      // Documentos de transporte ficam no armazenamento privado da conta.
      const upload = await uploadMedia(file, { privateFile: true });
      const { document: saved } = await apiRequest('/me/freight/documents', { method: 'POST', body: { url: upload.url, type: data.type, name: data.reference, trip: data.trip, fileName: file.name, fileType: file.type, size: file.size, expiresAt: data.expiresAt, notes: data.notes, status: data.status } });
      state.freightHub.documents = [saved, ...state.freightHub.documents];
      state.freightDocumentsOpen = false;
      render();
      showToast('Documento guardado com segurança.');
    } catch (error) { submitting(form, false); showToast(error.message); }
  });
  document.querySelectorAll('[data-freight-doc-open]').forEach((el) => el.addEventListener('click', async () => {
    const saved = state.freightHub.documents.find((document) => document.id === Number(el.dataset.freightDocOpen));
    if (!saved) return;
    try {
      const response = await fetch(saved.url, { headers: { Authorization: `Bearer ${loadSessionToken()}` } });
      if (!response.ok) throw new Error('Não foi possível abrir o documento.');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(await response.blob());
      link.download = saved.fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } catch (error) { showToast(error.message); }
  }));
  document.querySelectorAll('[data-freight-doc-issued]').forEach((el) => el.addEventListener('click', async () => {
    try { const { document: saved } = await apiRequest(`/me/freight/documents/${el.dataset.freightDocIssued}`, { method: 'PATCH', body: { status: 'emitido' } }); state.freightHub.documents = state.freightHub.documents.map((item) => (item.id === saved.id ? saved : item)); render(); } catch (error) { showToast(error.message); }
  }));
  document.querySelectorAll('[data-freight-doc-delete]').forEach((el) => el.addEventListener('click', async () => {
    if (!window.confirm('Excluir este documento? O arquivo também será apagado.')) return;
    try { await apiRequest(`/me/freight/documents/${el.dataset.freightDocDelete}`, { method: 'DELETE' }); state.freightHub.documents = state.freightHub.documents.filter((item) => item.id !== Number(el.dataset.freightDocDelete)); render(); showToast('Documento excluído.'); } catch (error) { showToast(error.message); }
  }));
  document.querySelector('[data-freight-action="report"]')?.addEventListener('click', downloadFreightReport);
}

async function startAudioRecording() {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { showToast('Seu navegador não permite gravação de áudio.'); return; }
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    audioRecorder = new MediaRecorder(audioStream);
    audioRecorder.ondataavailable = (event) => { if (event.data.size) audioChunks.push(event.data); };
    audioRecorder.onstop = async () => {
      clearTimeout(audioTimer);
      audioStream?.getTracks().forEach((track) => track.stop());
      const blob = new Blob(audioChunks, { type: audioRecorder.mimeType || 'audio/webm' });
      state.recording = false; audioRecorder = null; audioStream = null; render();
      if (!state.activeConversationId || !blob.size) return;
      try {
        const audio = new Blob([blob], { type: (blob.type || 'audio/webm').split(';')[0] });
        const uploaded = await uploadMedia(audio);
        await sendChatMessage({ kind: 'audio', body: 'Áudio', attachment: { url: uploaded.url, name: 'Áudio', type: audio.type, size: audio.size } });
      } catch (error) { showToast(error.message); }
    };
    audioRecorder.start();
    state.recording = true;
    render();
    audioTimer = setTimeout(() => { if (audioRecorder?.state === 'recording') stopAudioRecording(); }, 60 * 1000);
  } catch { state.recording = false; audioRecorder = null; audioStream?.getTracks().forEach((track) => track.stop()); audioStream = null; showToast('Não foi possível acessar o microfone. Verifique a permissão do navegador.'); }
}

function stopAudioRecording() {
  if (audioRecorder?.state === 'recording') audioRecorder.stop();
}

let speechRec = null;
let cameraStream = null;
const voiceFieldLabels = { lotName: 'Nome do lote', species: 'Espécie', purpose: 'Finalidade', breed: 'Raça', quantity: 'Quantidade', sex: 'Sexo', age: 'Idade média', weight: 'Peso (@)', price: 'Preço', farm: 'Fazenda', city: 'Município', state: 'UF', healthStatus: 'Sanidade' };
const voiceStateNames = [['mato grosso do sul', 'MS'], ['mato grosso', 'MT'], ['goias', 'GO'], ['minas gerais', 'MG'], ['sao paulo', 'SP'], ['parana', 'PR'], ['bahia', 'BA']];
const titleCase = (value) => value.replace(/\S+/g, (word) => ['de', 'da', 'do', 'dos', 'das', 'e'].includes(word) ? word : word[0].toUpperCase() + word.slice(1));

function parseVoiceTranscript(raw) {
  const text = ` ${raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')} `;
  const found = {};
  const qty = text.match(/(\d+)\s*(?:cabecas?|animais|bois|vacas|machos|femeas|bezerros?|novilhas?|garrotes?|matrizes)/);
  if (qty) found.quantity = qty[1];
  const hasMale = /\bmachos?\b/.test(text);
  const hasFemale = /\bfemeas?\b|\bmatriz(es)?\b|\bnovilhas?\b|\bvacas?\b/.test(text);
  if (hasMale && hasFemale) found.sex = 'Misto'; else if (hasMale) found.sex = 'Machos'; else if (hasFemale) found.sex = 'Fêmeas';
  if (text.includes('nelore')) found.breed = 'Nelore'; else if (text.includes('brangus')) found.breed = 'Brangus'; else if (text.includes('angus')) found.breed = 'Angus'; else if (text.includes('guzera')) found.breed = 'Guzerá'; else if (text.includes('cruza')) found.breed = 'Cruza industrial';
  if (found.breed || found.quantity) found.species = /bufal|bubalin/.test(text) ? 'Bubalino' : 'Bovino';
  if (text.includes('recria')) found.purpose = 'Recria'; else if (text.includes('engorda')) found.purpose = 'Engorda'; else if (text.includes('abate')) found.purpose = 'Abate'; else if (text.includes('reproducao')) found.purpose = 'Reprodução'; else if (text.includes('leilao')) found.purpose = 'Leilão'; else if (/\bcria\b/.test(text)) found.purpose = 'Cria';
  const age = text.match(/(\d+)\s*(?:a\s*\d+\s*)?meses/);
  if (age) found.age = age[1];
  const weight = text.match(/(\d+(?:[.,]\d+)?)\s*(?:arrobas?|@)/);
  if (weight) found.weight = weight[1].replace('.', ',');
  const thousands = text.match(/(\d+(?:[.,]\d+)?)\s*mil(?:\s*reais)?/);
  if (thousands) found.price = (parseFloat(thousands[1].replace(',', '.')) * 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  else { const price = text.match(/(\d[\d.]*)\s*reais/); if (price) found.price = price[1]; }
  const farm = text.match(/(fazenda|sitio|estancia|haras)\s+([a-z0-9 ]{3,32}?)(?=\s+(?:em|no|na|para|com)\b|[,.]|$)/);
  if (farm) found.farm = titleCase(`${farm[1]} ${farm[2].trim()}`);
  for (const [stateName, uf] of voiceStateNames) {
    if (!text.includes(stateName)) continue;
    found.state = uf;
    const city = text.match(new RegExp(`\\bem\\s+([a-z ]{3,28}?)[,\\s]+(?:no\\s+|em\\s+)?${stateName}`));
    if (city) { const cityName = city[1].trim().replace(/^(a|o|as|os|na|no)\s+/, ''); if (cityName && !/^(fazenda|sitio|estancia|haras)/.test(cityName)) found.city = titleCase(cityName); }
    break;
  }
  if (/vacin\w* em dia|vacinado/.test(text)) found.healthStatus = 'Vacinações em dia';
  if (found.breed && (found.farm || found.city)) found.lotName = `${found.breed}${found.purpose ? ` ${found.purpose.toLowerCase()}` : ' selecionado'} - ${found.farm || found.city}`;
  return found;
}

const voiceChipsMarkup = () => Object.entries(state.voiceFields).map(([key, value]) => `<span class="voice-chip">${icon('check', 12)} ${voiceFieldLabels[key] || key}: <b>${escapeHtml(String(value))}</b></span>`).join('');

function applyVoiceData(found) {
  const form = document.querySelector('#cattle-form');
  if (!form) return;
  let changed = false;
  Object.entries(found).forEach(([key, value]) => {
    const input = form.elements[key];
    if (!input || state.voiceFields[key] === value) return;
    input.value = value;
    if (input.tagName === 'SELECT' && input.value !== String(value)) return;
    state.voiceFields[key] = value;
    changed = true;
    input.classList.add('voice-filled');
    setTimeout(() => input.classList.remove('voice-filled'), 1500);
  });
  if (changed) {
    const chips = document.querySelector('#voice-chips');
    if (chips) chips.innerHTML = voiceChipsMarkup();
  }
}

function setVoicePanelState() {
  document.querySelector('#voice-panel')?.classList.toggle('is-active', state.voiceActive);
  const toggle = document.querySelector('#voice-toggle');
  if (toggle) toggle.innerHTML = state.voiceActive ? `${icon('stop', 16)} Parar gravação` : `${icon('mic', 16)} Falar agora`;
}

function startVoiceFill() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast('Reconhecimento de voz indisponível neste navegador. Use o Google Chrome.'); return; }
  try {
    speechRec = new SR();
    speechRec.lang = 'pt-BR';
    speechRec.continuous = true;
    speechRec.interimResults = true;
    speechRec.onresult = (event) => {
      let transcript = '';
      for (const result of event.results) transcript += result[0].transcript;
      const display = document.querySelector('#voice-transcript');
      if (display) { display.textContent = `“${transcript.trim().slice(-220)}”`; display.classList.add('has-text'); }
      applyVoiceData(parseVoiceTranscript(transcript));
    };
    speechRec.onerror = (event) => { if (event.error === 'not-allowed' || event.error === 'service-not-allowed') { stopVoiceFill(); showToast('Permita o acesso ao microfone para preencher por voz.'); } };
    speechRec.onend = () => { if (state.voiceActive && speechRec) { try { speechRec.start(); } catch { /* reconhecimento já ativo */ } } };
    speechRec.start();
    state.voiceActive = true;
    setVoicePanelState();
  } catch { showToast('Não foi possível iniciar o reconhecimento de voz.'); }
}

function stopVoiceFill() {
  state.voiceActive = false;
  if (speechRec) { const recognition = speechRec; speechRec = null; try { recognition.onend = null; recognition.stop(); } catch { /* já parado */ } }
  setVoicePanelState();
}

const photoStripMarkup = () => state.cattlePhotos.map((src, index) => `<span class="photo-thumb"><img src="${src}" alt="Foto ${index + 1} do lote" /><button type="button" data-remove-photo="${index}" aria-label="Remover foto">${icon('close', 12)}</button></span>`).join('');

async function openCameraModal() {
  if (!navigator.mediaDevices?.getUserMedia) { showToast('Seu navegador não permite acesso à câmera.'); return; }
  state.cameraOpen = true;
  render();
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    const video = document.querySelector('#camera-video');
    if (video) video.srcObject = cameraStream;
  } catch { state.cameraOpen = false; render(); showToast('Não foi possível acessar a câmera. Verifique a permissão do navegador.'); }
}

function closeCameraModal() {
  cameraStream?.getTracks().forEach((track) => track.stop());
  cameraStream = null;
  state.cameraOpen = false;
  render();
}

function captureCameraPhoto() {
  const video = document.querySelector('#camera-video');
  if (!video?.videoWidth) return;
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 1280 / video.videoWidth);
  canvas.width = Math.round(video.videoWidth * scale);
  canvas.height = Math.round(video.videoHeight * scale);
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  state.cattlePhotos.push(canvas.toDataURL('image/jpeg', 0.82));
  document.querySelectorAll('[data-photo-strip]').forEach((el) => { el.innerHTML = photoStripMarkup(); });
  document.querySelectorAll('[data-photo-count]').forEach((el) => { el.textContent = `${state.cattlePhotos.length} foto${state.cattlePhotos.length === 1 ? '' : 's'} capturada${state.cattlePhotos.length === 1 ? '' : 's'}`; });
}

function cameraModalTemplate() {
  return `<div class="camera-overlay"><div class="camera-card"><div class="camera-head"><div><strong>${icon('camera', 17)} Fotos do lote</strong><span data-photo-count>${state.cattlePhotos.length} foto${state.cattlePhotos.length === 1 ? '' : 's'} capturada${state.cattlePhotos.length === 1 ? '' : 's'}</span></div><button type="button" class="camera-close" data-camera-action="close" aria-label="Fechar câmera">${icon('close', 18)}</button></div><div class="camera-stage"><video id="camera-video" autoplay playsinline muted></video></div><div class="camera-strip" data-photo-strip>${photoStripMarkup()}</div><div class="camera-actions"><button type="button" class="secondary-button" data-camera-action="close">Concluir</button><button type="button" class="camera-shutter" data-camera-action="capture" aria-label="Tirar foto">${icon('camera', 24)}</button></div></div></div>`;
}

function registrationTemplate() {
  return `<div class="register-shell">
    <header class="register-topbar"><div class="brand register-brand">${themedLogo()}</div><div class="register-top-actions"><span class="save-status"><span class="online-dot"></span> Salvo automaticamente</span><button class="register-exit" data-action="back-home">Sair do cadastro ${icon('close', 15)}</button></div></header>
    <main class="register-content">
      <button class="back-link" data-action="back-home">${icon('back', 16)} Voltar para o marketplace</button>
      <div class="register-intro"><div><p class="eyebrow">HABILITAR LOTE · ETAPA 1 DE 1</p><h1>${state.editingLotId ? 'Editar anúncio.' : 'Cadastre os dados do seu gado.'}</h1><p>Preencha as informações abaixo para publicar seu lote e começar a receber contatos de compradores.</p></div><div class="progress-block"><div class="progress-label"><span>Progresso do cadastro</span><strong>25%</strong></div><div class="progress-track"><i></i></div></div></div>
      <section class="voice-panel ${state.voiceActive ? 'is-active' : ''}" id="voice-panel"><div class="voice-head"><span class="voice-mic-badge">${icon('mic', 20)}</span><div class="voice-copy"><strong>Preenchimento por voz <em>NOVO</em></strong><span>Fale os dados do lote e o formulário se preenche sozinho, em tempo real.</span></div><button type="button" id="voice-toggle" class="voice-toggle">${state.voiceActive ? `${icon('stop', 16)} Parar gravação` : `${icon('mic', 16)} Falar agora`}</button></div><div class="voice-live"><div class="voice-wave"><i></i><i></i><i></i><i></i><i></i></div><p id="voice-transcript">Ouvindo… pode falar naturalmente.</p></div><div class="voice-chips" id="voice-chips">${voiceChipsMarkup()}</div><p class="voice-example">Exemplo: “Lote de 80 machos nelore, 18 meses, 12 arrobas, 95 mil reais, para engorda, na Fazenda Santa Rita em Campo Verde, Mato Grosso”.</p></section>
      <div class="register-layout">
        <form id="cattle-form" class="registration-form">
          <section class="form-section"><div class="form-section-head"><div class="section-number">01</div><div><h2>Sobre o lote</h2><p>Conte o que está sendo ofertado.</p></div></div><div class="form-grid two"><label class="field full"><span>Nome do lote <b>*</b></span><input name="lotName" placeholder="Ex.: Nelore selecionado - Fazenda Santa Rita" required /></label><label class="field"><span>Espécie <b>*</b></span><select name="species" required><option value="">Selecione</option><option>Bovino</option><option>Bubalino</option></select></label><label class="field"><span>Finalidade do lote <b>*</b></span><select name="purpose" required><option value="">Selecione</option><option>Cria</option><option>Recria</option><option>Engorda</option><option>Abate</option><option>Reprodução</option><option>Leilão</option></select></label><label class="field"><span>Raça predominante <b>*</b></span><select name="breed" required><option value="">Selecione</option><option>Nelore</option><option>Angus</option><option>Brangus</option><option>Guzerá</option><option>Cruza industrial</option><option>Outra</option></select></label><label class="field"><span>Composição racial</span><input name="composition" placeholder="Ex.: 3/4 Nelore, 1/4 Angus" /></label></div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">02</div><div><h2>Quantidade e características</h2><p>Use dados médios do lote e informe variações nas observações.</p></div></div><div class="form-grid three"><label class="field"><span>Quantidade de animais <b>*</b></span><div class="unit-input"><input name="quantity" type="number" min="1" placeholder="80" required /><em>cabeças</em></div></label><label class="field"><span>Sexo predominante <b>*</b></span><select name="sex" required><option value="">Selecione</option><option>Machos</option><option>Fêmeas</option><option>Misto</option></select></label><label class="field"><span>Idade média</span><div class="unit-input"><input name="age" type="number" min="0" placeholder="24" /><em>meses</em></div></label><label class="field"><span>Peso médio / arrobas</span><div class="unit-input"><input name="weight" placeholder="18" /><em>@</em></div></label><label class="field"><span>Preço total do lote <b>*</b></span><div class="unit-input"><em>R$</em><input name="price" placeholder="28.000,00" required /></div></label><label class="field"><span>Data disponível para retirada</span><input name="availableAt" type="date" /></label></div><label class="field"><span>Observações sobre os animais</span><textarea name="description" rows="4" placeholder="Manejo, acabamento, condição corporal, prenhez, linhagem ou outros detalhes importantes..."></textarea></label></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">03</div><div><h2>Origem e propriedade</h2><p>Esses dados ajudam na negociação e na cotação do frete.</p></div></div><div class="form-grid two"><label class="field full"><span>Nome da propriedade / fazenda <b>*</b></span><input name="farm" placeholder="Fazenda Santa Rita" required /></label><label class="field"><span>Município <b>*</b></span><input name="city" placeholder="Campo Verde" required /></label><label class="field"><span>UF <b>*</b></span><select name="state" required><option value="">Selecione</option>${['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((uf) => `<option>${uf}</option>`).join('')}</select></label><label class="field"><span>Cadastro / registro da propriedade</span><input name="propertyCode" placeholder="Código no órgão estadual, se aplicável" /></label><label class="field"><span>Distância aproximada até a rodovia</span><div class="unit-input"><input name="roadDistance" placeholder="12" /><em>km</em></div></label></div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">04</div><div><h2>Sanidade e rastreabilidade</h2><p>Informe o status atual. A documentação oficial será validada antes do transporte.</p></div></div><div class="form-grid two"><label class="field"><span>Situação sanitária declarada <b>*</b></span><select name="healthStatus" required><option value="">Selecione</option><option>Vacinações em dia</option><option>Em atualização</option><option>A confirmar com veterinário</option></select></label><label class="field"><span>Rastreabilidade individual</span><select name="traceability"><option value="">Selecione</option><option>Não se aplica ao lote</option><option>Identificação SISBOV</option><option>Identificação própria da fazenda</option><option>Em processo</option></select></label><label class="field"><span>GTA</span><select name="gtaStatus"><option value="">Selecione</option><option>A emitir após a negociação</option><option>Solicitada</option><option>Emitida</option><option>Não se aplica nesta etapa</option></select></label><label class="field"><span>Número do certificado / atestado</span><input name="certificate" placeholder="Se aplicável à finalidade e à UF" /></label></div><div class="health-note">${icon('shield', 17)} <div><strong>Importante para o transporte</strong><span>A GTA é o documento oficial de trânsito animal. Exames, vacinas e certificados podem variar conforme espécie, finalidade, origem, destino e regras da UF.</span></div></div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">05</div><div><h2>Fotos e documentos <i class="optional-tag">Opcional</i></h2><p>Boas fotos vendem mais. Os documentos da propriedade ficam no seu perfil vendedor.</p></div></div><div class="upload-grid"><button type="button" class="upload-box camera-box" data-camera-action="open"><div class="upload-icon camera-upload">${icon('camera', 22)}</div><strong>Tirar fotos agora</strong><span>Use a câmera do dispositivo</span><em>Abrir câmera</em></button><label class="upload-box"><input type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple data-photo-input /><div class="upload-icon">${icon('upload', 22)}</div><strong>Fotos do lote</strong><span>JPG, PNG ou WEBP · até 12 fotos</span><em>Escolher arquivos</em></label></div><div class="doc-hints"><span>${icon('file', 14)} Sugestões: comprovante de vacinação, identificação do lote, certificado ou documento da propriedade.</span><span>${icon('shield', 14)} Não publique CPF, dados bancários ou documentos com informações desnecessárias.</span></div><div class="photo-strip" data-photo-strip>${photoStripMarkup()}</div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">06</div><div><h2>Declarações</h2><p>Leia antes de habilitar o anúncio.</p></div></div><label class="check-row"><input type="checkbox" required /><span>Declaro que as informações fornecidas são verdadeiras e que tenho autorização para ofertar este lote.</span></label><label class="check-row"><input type="checkbox" required /><span>Estou ciente de que a emissão de GTA, nota fiscal e demais documentos oficiais deve ser feita pelos responsáveis e órgãos competentes.</span></label><label class="check-row"><input type="checkbox" required /><span>Concordo em não inserir dados pessoais sensíveis de terceiros no anúncio.</span></label></section>
          <div class="register-footer"><span><b>*</b> Campos obrigatórios</span><button type="button" class="secondary-button" data-action="back-home">Cancelar</button><button type="submit" class="primary-button">${state.editingLotId ? 'Salvar e reenviar para análise' : 'Enviar para análise'} ${icon('arrow', 15)}</button></div>
        </form>
        <aside class="register-side"><div class="side-card side-preview"><div class="side-card-head"><span class="side-card-icon">${icon('file', 17)}</span><div><p class="eyebrow">PRÉVIA DO ANÚNCIO</p><h3>O que compradores verão</h3></div></div><div class="preview-placeholder">${icon('cow', 31)}<span>Suas fotos aparecerão aqui</span></div><div class="preview-lines"><i></i><i></i><i></i></div></div><div class="side-card"><div class="side-card-head"><span class="side-card-icon orange-side">${icon('shield', 17)}</span><div><p class="eyebrow">DOCUMENTAÇÃO</p><h3>Checklist de segurança</h3></div></div><ul class="checklist"><li><span>01</span> Dados do lote e origem</li><li><span>02</span> Situação sanitária declarada</li><li><span>03</span> Documentos para conferência</li><li><span>04</span> Revisão antes de publicar</li></ul><div class="side-disclaimer">O anúncio pode ficar pendente de validação do GadOn antes de ser exibido.</div></div><div class="legal-links"><strong>Consulte fontes oficiais</strong><a href="https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/cgtqa/t_nacional/gta" target="_blank" rel="noreferrer">Informações sobre GTA ${icon('arrow', 13)}</a><a href="https://www.gov.br/agricultura/pt-br/guia-de-servicos/rastreabilidade-animal" target="_blank" rel="noreferrer">Rastreabilidade / SISBOV ${icon('arrow', 13)}</a></div></aside>
      </div>
    </main>${state.cameraOpen ? cameraModalTemplate() : ''}${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}
  </div>`;
}

// Aceita "28.000,00", "28000,5", "28000.50" e "28.000".
const parseMoney = (value) => { const raw = String(value || '').replace(/[^\d,.]/g, ''); const normalized = raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : /\.\d{1,2}$/.test(raw) ? raw : raw.replace(/\./g, ''); return Number(normalized) || 0; };
const lotCategoryFor = (breed, ageMonths) => (ageMonths && ageMonths <= 12 ? 'Bezerros' : { Nelore: 'Nelore', Angus: 'Angus', Brangus: 'Angus', 'Cruza industrial': 'Cruza' }[breed] || 'Outros');
const dataUrlToBlob = async (dataUrl) => (await fetch(dataUrl)).blob();

// Preenche o formulário ao editar um anúncio existente.
function prefillRegistration() {
  const lot = state.myLots.find((item) => item.id === state.editingLotId);
  const form = document.querySelector('#cattle-form');
  if (!lot || !form) return;
  const breedBase = ['Nelore', 'Angus', 'Brangus', 'Guzerá', 'Cruza industrial'].find((breed) => lot.breed.startsWith(breed)) || 'Outra';
  const values = { lotName: lot.name, species: 'Bovino', purpose: lot.purpose, breed: breedBase, quantity: lot.heads, sex: lot.sex, age: lot.ageMonths || '', weight: lot.weight ? String(lot.weight).replace('.', ',') : '', price: (lot.heads * lot.pricePerHead).toLocaleString('pt-BR', { minimumFractionDigits: 2 }), traceability: lot.traceability, description: lot.description, farm: lot.seller, city: lot.city, state: lot.state, healthStatus: lot.vaccination && ['Vacinações em dia', 'Em atualização', 'A confirmar com veterinário'].includes(lot.vaccination) ? lot.vaccination : 'Vacinações em dia', gtaStatus: lot.gtaStatus };
  // Selects só aceitam opções existentes; valores fora da lista ficam em branco para o vendedor escolher.
  Object.entries(values).forEach(([name, value]) => { if (form.elements[name] && value !== undefined && value !== null) form.elements[name].value = value; });
  state.existingPhotos = [...(lot.photos || [])];
}

function bindRegistrationEvents() {
  const leave = () => { stopVoiceFill(); if (state.cameraOpen) { cameraStream?.getTracks().forEach((track) => track.stop()); cameraStream = null; state.cameraOpen = false; } state.editingLotId = null; navigateTo(state.mode === 'seller' ? 'Meus anúncios' : 'Início'); };
  document.querySelectorAll('[data-action="back-home"]').forEach((el) => el.addEventListener('click', leave));
  if (state.editingLotId && !state.registrationPrefilled) { prefillRegistration(); state.registrationPrefilled = true; }
  document.querySelector('#cattle-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    stopVoiceFill();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const heads = Number(data.quantity);
    const total = parseMoney(data.price);
    if (!heads || !total) { showToast('Informe a quantidade de animais e o preço total do lote.'); return; }
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    button.textContent = 'Enviando fotos…';
    try {
      const files = [...(form.querySelector('[data-photo-input]')?.files || [])].slice(0, 12);
      if (files.some((file) => file.size > 10 * 1024 * 1024)) throw new Error('Cada foto deve ter no máximo 10 MB.');
      const captured = await Promise.all(state.cattlePhotos.map(dataUrlToBlob));
      const uploads = await Promise.all([...files, ...captured].map((blob) => uploadMedia(blob)));
      const photos = [...(state.editingLotId ? (state.existingPhotos || []).map((url) => url.replace(API_URL, '')) : []), ...uploads.map((item) => item.path)].slice(0, 12);
      button.textContent = 'Enviando anúncio…';
      const ageMonths = Number(data.age) || null;
      const body = { name: data.lotName, category: lotCategoryFor(data.breed, ageMonths), breed: data.composition ? `${data.breed} (${data.composition})` : data.breed, sex: data.sex, heads, weight: Number(String(data.weight).replace(',', '.')) || null, age: ageMonths ? `${ageMonths} meses` : '', ageMonths, purpose: data.purpose, pricePerHead: Math.round(total / heads), farm: data.farm, city: data.city, state: data.state, vaccination: data.healthStatus, traceability: data.traceability, gtaStatus: data.gtaStatus, description: data.description, photos };
      await apiRequest(state.editingLotId ? `/lots/${state.editingLotId}` : '/lots', { method: state.editingLotId ? 'PATCH' : 'POST', body });
      Object.assign(state, { voiceFields: {}, cattlePhotos: [], editingLotId: null, registrationPrefilled: false, existingPhotos: [] });
      if (state.mode !== 'seller') switchProfileMode('seller');
      await loadSellerData();
      navigateTo('Meus anúncios');
      showToast('Anúncio enviado para análise. Você será avisado quando for publicado.');
    } catch (error) {
      button.disabled = false;
      button.innerHTML = `${state.editingLotId ? 'Salvar e reenviar para análise' : 'Enviar para análise'} ${icon('arrow', 15)}`;
      showToast(error.message);
    }
  });
  document.querySelector('#voice-toggle')?.addEventListener('click', () => { if (state.voiceActive) stopVoiceFill(); else startVoiceFill(); });
  document.querySelectorAll('[data-camera-action="open"]').forEach((el) => el.addEventListener('click', openCameraModal));
  document.querySelectorAll('[data-camera-action="close"]').forEach((el) => el.addEventListener('click', closeCameraModal));
  document.querySelector('[data-camera-action="capture"]')?.addEventListener('click', captureCameraPhoto);
  if (state.cameraOpen && cameraStream) { const video = document.querySelector('#camera-video'); if (video) video.srcObject = cameraStream; }
  document.querySelector('.register-shell')?.addEventListener('click', (event) => { const removeButton = event.target.closest('[data-remove-photo]'); if (!removeButton) return; state.cattlePhotos.splice(Number(removeButton.dataset.removePhoto), 1); document.querySelectorAll('[data-photo-strip]').forEach((el) => { el.innerHTML = photoStripMarkup(); }); });
}

const cartCount = () => state.cart.reduce((sum, item) => sum + item.qty, 0);
const saveUserProducts = () => { try { localStorage.setItem(userProductsKey, JSON.stringify(state.userProducts)); } catch { /* armazenamento local indisponível */ } };
const allShopProducts = () => [...state.userProducts, ...shopProducts];
const findProduct = (id) => allShopProducts().find((product) => product.id === id);
const cartTotal = () => state.cart.reduce((sum, item) => { const product = findProduct(item.id); return sum + (product ? product.price * item.qty : 0); }, 0);
const shopDeliveryFee = () => (state.checkoutData.delivery === 'retirada' ? 0 : cartTotal() >= 2000 ? 0 : 120);
const shopPixDiscount = () => (state.checkoutData.payment === 'pix' ? Math.round(cartTotal() * 0.05) : 0);
const shopOrderTotal = () => cartTotal() + shopDeliveryFee() - shopPixDiscount();
const categoryDefaultImages = { 'Rações & Nutrição': 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=700&q=80', 'Sementes & Plantio': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=80', 'Queijos & Laticínios': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80', 'Mel & Doces': 'https://images.unsplash.com/photo-1555211652-5c6222f971bc?auto=format&fit=crop&w=700&q=80', 'Terras & Fazendas': 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=700&q=80', 'Equipamentos': 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=700&q=80', 'Outros': '/home-hero-nelore.png' };

function addToCart(id) {
  const existing = state.cart.find((item) => item.id === id);
  if (existing) existing.qty += 1; else state.cart.push({ id, qty: 1 });
  saveCart();
  state.cartOpen = true;
  render();
}

function changeCartQty(id, delta) {
  const item = state.cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter((entry) => entry.id !== id);
  saveCart();
  render();
}

function shopFilteredProducts() {
  const query = state.shopQuery.trim().toLowerCase();
  return allShopProducts().filter((product) => !product.paused && (state.shopCategory === 'Todos' || product.category === state.shopCategory) && (!query || `${product.name} ${product.category} ${product.unit}`.toLowerCase().includes(query)));
}

function shopProductCard(product) {
  const badge = product.mine ? 'Seu produto' : product.badge;
  return `<article class="shop-card"><div class="shop-card-image"><img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" />${badge ? `<span class="shop-badge ${product.mine ? 'mine' : ''}">${badge}</span>` : ''}</div><div class="shop-card-body"><span class="shop-card-category">${product.land ? icon('leaf', 12) : icon('bag', 12)} ${product.category}</span><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.unit)}</p><div class="shop-card-footer"><strong>${formatBRL(product.price)}</strong>${product.land ? `<button type="button" class="shop-interest" data-land-interest="${product.id}">Tenho interesse</button>` : `<button type="button" class="shop-add" data-add-cart="${product.id}">${icon('plus', 15)} Adicionar</button>`}</div></div></article>`;
}

const shopGridMarkup = () => { const filtered = shopFilteredProducts(); return filtered.length ? filtered.map(shopProductCard).join('') : `<div class="shop-empty">${icon('search', 26)}<p>Nenhum produto encontrado.</p><span>Tente outra busca ou categoria.</span></div>`; };

function cartDrawerTemplate() {
  const items = state.cart.map((item) => ({ ...item, product: findProduct(item.id) })).filter((item) => item.product);
  return `<div class="cart-overlay" data-action="close-cart"></div><aside class="cart-drawer"><div class="cart-head"><strong>${icon('cart', 18)} Seu carrinho</strong><button type="button" data-action="close-cart" aria-label="Fechar carrinho">${icon('close', 17)}</button></div>${items.length ? `<div class="cart-items">${items.map((item) => `<div class="cart-item"><img src="${item.product.image}" alt="" /><div class="cart-item-info"><strong>${escapeHtml(item.product.name)}</strong><span>${formatBRL(item.product.price)} · ${escapeHtml(item.product.unit)}</span></div><div class="cart-qty"><button type="button" data-cart-qty="${item.id}" data-delta="-1" aria-label="Diminuir">${icon('minus', 13)}</button><b>${item.qty}</b><button type="button" data-cart-qty="${item.id}" data-delta="1" aria-label="Aumentar">${icon('plus', 13)}</button></div></div>`).join('')}</div><div class="cart-footer"><div class="cart-total"><span>Subtotal</span><strong>${formatBRL(cartTotal())}</strong></div><button type="button" class="primary-button cart-checkout" data-action="open-checkout">Finalizar compra ${icon('arrow', 15)}</button><small>Frete grátis acima de R$ 2.000 · Pix com 5% de desconto</small></div>` : `<div class="cart-empty">${icon('bag', 30)}<p>Seu carrinho está vazio.</p><span>Adicione rações, queijos, mel e muito mais.</span></div>`}</aside>`;
}

function sellModalTemplate() {
  const categories = [...shopCategories.filter((category) => category !== 'Todos' && category !== 'Terras & Fazendas'), 'Outros'];
  const editing = state.myStoreEditing ? state.userProducts.find((product) => product.id === state.myStoreEditing) : null;
  return `<div class="checkout-overlay"><div class="checkout-card"><div class="checkout-head"><strong>${icon('store', 17)} ${editing ? 'Editar produto' : 'Vender na Loja GadOn'}</strong><button type="button" data-action="close-sell" aria-label="Fechar">${icon('close', 17)}</button></div><p class="sell-note">${editing ? 'Atualize as informações do seu produto — as mudanças aparecem na vitrine na hora.' : 'Cadastre queijos, laticínios, mel, ração e o que mais sua fazenda produz. Seu produto entra na vitrine na hora.'}</p><form id="sell-form" class="checkout-form"><label><span>Nome do produto</span><input name="name" value="${editing ? escapeHtml(editing.name) : ''}" placeholder="Ex.: Queijo canastra meia cura 1kg" required maxlength="60" /></label><div class="sell-grid"><label><span>Categoria</span><select name="category">${categories.map((category) => `<option ${editing && editing.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></label><label><span>Preço (R$)</span><input name="price" type="number" min="1" step="0.01" value="${editing ? editing.price : ''}" placeholder="59,90" required /></label></div><label><span>Unidade de venda</span><input name="unit" value="${editing ? escapeHtml(editing.unit) : ''}" placeholder="Ex.: peça 1kg · pote 500g · saco 40kg" required maxlength="40" /></label><label><span>Foto do produto <em class="optional-inline">${editing ? 'enviar nova é opcional' : 'opcional'}</em></span><input name="photo" type="file" accept="image/*" class="sell-file" /></label><button type="submit" class="primary-button">${editing ? `Salvar alterações ${icon('check', 16)}` : `Publicar produto ${icon('check', 16)}`}</button></form></div></div>`;
}

function checkoutStepperMarkup(steps = ['Entrega', 'Pagamento', 'Revisão'], current = state.checkoutStep) {
  return `<div class="checkout-stepper">${steps.map((label, index) => { const number = index + 1; const stateClass = number < current ? 'done' : number === current ? 'active' : ''; return `<span class="checkout-step ${stateClass}"><i>${number < current ? '✓' : number}</i><b>${label}</b></span>${number < steps.length ? '<em class="step-line"></em>' : ''}`; }).join('')}</div>`;
}

function checkoutModalTemplate() {
  if (state.checkoutDone) return `<div class="checkout-overlay"><div class="checkout-card checkout-success"><div class="checkout-check">${icon('check', 34)}</div><h2>Pedido confirmado!</h2><p class="order-id">Pedido <b>${escapeHtml(state.lastOrderId)}</b></p><p>Total de <b>${formatBRL(shopOrderTotal())}</b> via ${state.checkoutData.payment === 'pix' ? 'Pix (5% de desconto aplicado)' : state.checkoutData.payment === 'boleto' ? 'boleto bancário' : 'cartão em até 12x'}. ${state.checkoutData.delivery === 'retirada' ? 'Retirada no parceiro mais próximo.' : 'Entrega na sua propriedade.'} Você receberá a confirmação no e-mail e WhatsApp.</p><button type="button" class="primary-button" data-action="close-checkout">Continuar comprando</button></div></div>`;
  const data = state.checkoutData;
  let body = '';
  if (state.checkoutStep === 1) {
    body = `<form id="checkout-step1" class="checkout-form"><div class="sell-grid"><label><span>Nome</span><input name="name" value="${escapeHtml(data.name || state.profile.name)}" required /></label><label><span>Celular / WhatsApp</span><input name="phone" type="tel" value="${escapeHtml(data.phone || state.profile.phone)}" required /></label></div><label><span>E-mail</span><input name="email" type="email" value="${escapeHtml(data.email || state.profile.email)}" required /></label><label><span>Endereço da propriedade</span><input name="address" value="${escapeHtml(data.address || '')}" placeholder="Fazenda, rodovia, km..." required /></label><div class="sell-grid"><label><span>Município</span><input name="city" value="${escapeHtml(data.city || '')}" placeholder="Campo Verde" required /></label><label><span>UF</span><select name="uf">${['MT', 'MS', 'GO', 'MG', 'SP', 'PR', 'BA'].map((uf) => `<option ${data.uf === uf ? 'selected' : ''}>${uf}</option>`).join('')}</select></label></div><p class="checkout-group-label">Como quer receber?</p><div class="option-cards"><label class="option-card"><input type="radio" name="delivery" value="entrega" ${data.delivery !== 'retirada' ? 'checked' : ''} /><div>${icon('truck', 17)}<b>Entrega na fazenda</b><span>${cartTotal() >= 2000 ? 'Frete grátis' : 'Frete R$ 120'} · até 5 dias úteis</span></div></label><label class="option-card"><input type="radio" name="delivery" value="retirada" ${data.delivery === 'retirada' ? 'checked' : ''} /><div>${icon('store', 17)}<b>Retirar no parceiro</b><span>Grátis · disponível em 24h</span></div></label></div><button type="submit" class="primary-button">Ir para pagamento ${icon('arrow', 15)}</button></form>`;
  } else if (state.checkoutStep === 2) {
    body = `<form id="checkout-step2" class="checkout-form"><p class="checkout-group-label">Forma de pagamento</p><div class="option-cards vertical"><label class="option-card"><input type="radio" name="payment" value="pix" ${data.payment !== 'boleto' && data.payment !== 'cartao' ? 'checked' : ''} /><div>${icon('check', 17)}<b>Pix</b><span>Aprovação imediata · <i class="pix-off">5% de desconto</i></span></div></label><label class="option-card"><input type="radio" name="payment" value="cartao" ${data.payment === 'cartao' ? 'checked' : ''} /><div>${icon('file', 17)}<b>Cartão de crédito</b><span>Em até 12x sem juros</span></div></label><label class="option-card"><input type="radio" name="payment" value="boleto" ${data.payment === 'boleto' ? 'checked' : ''} /><div>${icon('file', 17)}<b>Boleto bancário</b><span>Compensação em até 2 dias úteis</span></div></label></div><div class="checkout-nav"><button type="button" class="secondary-button" data-checkout-back>Voltar</button><button type="submit" class="primary-button">Revisar pedido ${icon('arrow', 15)}</button></div></form>`;
  } else {
    const items = state.cart.map((item) => ({ ...item, product: findProduct(item.id) })).filter((item) => item.product);
    body = `<div class="checkout-review"><div class="review-block"><p class="checkout-group-label">Itens (${cartCount()})</p>${items.map((item) => `<div class="review-item"><span>${item.qty}× ${escapeHtml(item.product.name)}</span><b>${formatBRL(item.product.price * item.qty)}</b></div>`).join('')}</div><div class="review-block"><p class="checkout-group-label">Entrega</p><div class="review-item"><span>${data.delivery === 'retirada' ? 'Retirada no parceiro' : `Entrega · ${escapeHtml(data.address || '')}, ${escapeHtml(data.city || '')}/${escapeHtml(data.uf || '')}`}</span><b>${shopDeliveryFee() ? formatBRL(shopDeliveryFee()) : 'Grátis'}</b></div></div><div class="review-block"><p class="checkout-group-label">Pagamento</p><div class="review-item"><span>${data.payment === 'pix' ? 'Pix (5% off)' : data.payment === 'boleto' ? 'Boleto bancário' : 'Cartão em até 12x'}</span>${shopPixDiscount() ? `<b class="pix-off">− ${formatBRL(shopPixDiscount())}</b>` : ''}</div></div><div class="review-total"><span>Total</span><strong>${formatBRL(shopOrderTotal())}</strong></div><div class="checkout-nav"><button type="button" class="secondary-button" data-checkout-back>Voltar</button><button type="button" class="primary-button" data-action="confirm-order">Confirmar pedido ${icon('check', 16)}</button></div></div>`;
  }
  return `<div class="checkout-overlay"><div class="checkout-card checkout-wide"><div class="checkout-head"><strong>Finalizar compra</strong><button type="button" data-action="close-checkout" aria-label="Fechar">${icon('close', 17)}</button></div>${checkoutStepperMarkup()}${body}</div></div>`;
}

function shopTemplate() {
  const filtered = shopFilteredProducts();
  return `<div class="shop-shell">
    <header class="shop-topbar"><button class="back-link" data-action="shop-back">${icon('back', 16)} Voltar</button><div class="brand register-brand">${themedLogo()}</div><div class="shop-top-actions"><button type="button" class="shop-sell-button" data-action="open-mystore">${icon('chart', 16)} Minha loja${state.userProducts.length ? ` <b class="mystore-count">${state.userProducts.length}</b>` : ''}</button><button type="button" class="shop-sell-button" data-action="open-sell">${icon('store', 16)} Vender</button><button type="button" class="shop-cart-button" data-action="open-cart">${icon('cart', 18)} Carrinho ${cartCount() ? `<b>${cartCount()}</b>` : ''}</button></div></header>
    <main class="shop-layout">
      <aside class="shop-sidebar">
        <div class="shop-search">${icon('search', 16)}<input id="shop-search-input" value="${escapeHtml(state.shopQuery)}" placeholder="Buscar produtos..." /></div>
        <nav class="shop-cats"><p class="eyebrow">CATEGORIAS</p>${shopCategories.map((category) => { const count = category === 'Todos' ? allShopProducts().length : allShopProducts().filter((product) => product.category === category).length; return `<button type="button" class="shop-cat ${state.shopCategory === category ? 'selected' : ''}" data-shop-category="${category}"><span>${category}</span><b>${count}</b></button>`; }).join('')}</nav>
        <div class="shop-sell-card"><p class="eyebrow">VENDA NO GADON</p><strong>Tem queijo, mel ou ração da fazenda?</strong><p>Cadastre seus produtos e venda direto para todo o Brasil.</p><button type="button" class="primary-button" data-action="open-sell">Cadastrar produto ${icon('plus', 14)}</button></div>
      </aside>
      <section class="shop-main">
        <section class="shop-hero"><div><p class="eyebrow">LOJA RURAL GADON</p><h1>Tudo para a sua fazenda em um só lugar.</h1><p>Rações, sementes, queijos, mel, terras e equipamentos direto do produtor.</p></div><div class="shop-hero-icon">${icon('store', 42)}</div></section>
        <div class="shop-result-row"><span id="shop-count">${filtered.length} produto${filtered.length === 1 ? '' : 's'}</span><span class="shop-result-cat">${state.shopCategory}${state.shopQuery ? ` · “${escapeHtml(state.shopQuery)}”` : ''}</span></div>
        <div class="shop-grid" id="shop-grid">${shopGridMarkup()}</div>
      </section>
    </main>
    ${state.cartOpen ? cartDrawerTemplate() : ''}
    ${state.sellOpen ? sellModalTemplate() : ''}
    ${state.checkoutOpen ? checkoutModalTemplate() : ''}
    ${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}
  </div>`;
}

function bindSellForm(afterSave) {
  document.querySelector('[data-action="close-sell"]')?.addEventListener('click', () => { state.sellOpen = false; state.myStoreEditing = null; render(); });
  document.querySelector('#sell-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const photoFile = form.querySelector('[name="photo"]').files?.[0];
    let newImage = null;
    if (photoFile && photoFile.type.startsWith('image/') && photoFile.size <= 2.5 * 1024 * 1024) { try { newImage = await readAsDataUrl(photoFile); } catch { /* usa imagem atual/padrão */ } }
    if (state.myStoreEditing) {
      const product = state.userProducts.find((item) => item.id === state.myStoreEditing);
      if (product) { product.name = data.name.trim(); product.category = data.category; product.price = Number(data.price) || 0; product.unit = data.unit.trim(); if (newImage) product.image = newImage; }
      saveUserProducts();
      state.myStoreEditing = null;
      state.sellOpen = false;
      render();
      showToast('Produto atualizado!');
      return;
    }
    const product = { id: Date.now(), category: data.category, name: data.name.trim(), unit: data.unit.trim(), price: Number(data.price) || 0, image: newImage || categoryDefaultImages[data.category] || categoryDefaultImages.Outros, mine: true };
    state.userProducts = [product, ...state.userProducts];
    saveUserProducts();
    state.sellOpen = false;
    if (afterSave) afterSave(product);
    render();
    showToast(`“${product.name}” publicado na Loja GadOn!`);
  });
}

const myStoreStats = () => {
  const orders = state.userProducts.reduce((sum, product) => sum + 1 + (product.id % 3), 0);
  return {
    count: state.userProducts.length,
    views: state.userProducts.reduce((sum, product) => sum + 40 + (product.id % 87), 0),
    orders,
    revenue: state.userProducts.reduce((sum, product) => sum + (1 + (product.id % 3)) * product.price, 0),
  };
};

function myStoreRow(product) {
  return `<div class="store-row ${product.paused ? 'is-paused' : ''}"><img src="${product.image}" alt="" /><div class="store-row-info"><strong>${escapeHtml(product.name)}</strong><span>${escapeHtml(product.category)} · ${escapeHtml(product.unit)}</span><small>${formatBRL(product.price)}</small></div><div class="store-row-metrics"><span>${icon('eye', 13)} ${40 + (product.id % 87)}</span><span>${icon('bag', 13)} ${1 + (product.id % 3)} pedido${(product.id % 3) ? 's' : ''}</span></div><span class="store-status ${product.paused ? 'paused' : 'active'}">${product.paused ? 'Pausado' : 'Ativo'}</span><div class="store-row-actions"><button type="button" data-store-edit="${product.id}" title="Editar">${icon('file', 15)}</button><button type="button" data-store-pause="${product.id}" title="${product.paused ? 'Reativar' : 'Pausar'}">${product.paused ? icon('play', 15) : icon('stop', 15)}</button><button type="button" class="store-delete" data-store-delete="${product.id}" title="Excluir">${icon('close', 15)}</button></div></div>`;
}

function myStoreTemplate() {
  const stats = myStoreStats();
  return `<div class="shop-shell">
    <header class="shop-topbar"><button class="back-link" data-action="mystore-back">${icon('back', 16)} Voltar para a loja</button><div class="brand register-brand">${themedLogo()}</div><button type="button" class="primary-button" data-action="open-sell">${icon('plus', 15)} Cadastrar produto</button></header>
    <main class="store-content">
      <section class="store-hero"><div><p class="eyebrow">PAINEL DO VENDEDOR</p><h1>Minha loja</h1><p>Gerencie os produtos que você vende na Loja GadOn — edite, pause ou acompanhe o desempenho.</p></div></section>
      <div class="store-stats"><div class="store-stat"><span>Produtos publicados</span><strong>${stats.count}</strong></div><div class="store-stat"><span>Visualizações</span><strong>${stats.views}</strong></div><div class="store-stat"><span>Pedidos recebidos</span><strong>${stats.orders}</strong></div><div class="store-stat highlight"><span>Faturamento estimado</span><strong>${formatBRL(stats.revenue)}</strong></div></div>
      ${state.userProducts.length ? `<div class="store-list"><div class="store-list-head"><p class="eyebrow">SEUS PRODUTOS</p></div>${state.userProducts.map(myStoreRow).join('')}</div>` : `<div class="shop-empty">${icon('store', 28)}<p>Você ainda não publicou produtos.</p><span>Cadastre queijos, mel, ração e o que mais sua fazenda produz.</span><button type="button" class="primary-button" data-action="open-sell" style="margin-top:12px">Cadastrar meu primeiro produto ${icon('arrow', 14)}</button></div>`}
    </main>
    ${state.sellOpen ? sellModalTemplate() : ''}
    ${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}
  </div>`;
}

function bindMyStoreEvents() {
  document.querySelector('[data-action="mystore-back"]')?.addEventListener('click', () => { state.page = 'shop'; render(); });
  document.querySelectorAll('[data-action="open-sell"]').forEach((el) => el.addEventListener('click', () => { state.myStoreEditing = null; state.sellOpen = true; render(); }));
  document.querySelectorAll('[data-store-edit]').forEach((el) => el.addEventListener('click', () => { state.myStoreEditing = Number(el.dataset.storeEdit); state.sellOpen = true; render(); }));
  document.querySelectorAll('[data-store-pause]').forEach((el) => el.addEventListener('click', () => { const product = state.userProducts.find((item) => item.id === Number(el.dataset.storePause)); if (!product) return; product.paused = !product.paused; saveUserProducts(); render(); showToast(product.paused ? 'Produto pausado — saiu da vitrine.' : 'Produto reativado na vitrine!'); }));
  document.querySelectorAll('[data-store-delete]').forEach((el) => el.addEventListener('click', () => { const id = Number(el.dataset.storeDelete); const product = state.userProducts.find((item) => item.id === id); if (!product) return; if (!window.confirm(`Excluir “${product.name}” da sua loja?`)) return; state.userProducts = state.userProducts.filter((item) => item.id !== id); saveUserProducts(); render(); showToast('Produto excluído.'); }));
  bindSellForm();
}

function bindShopCardEvents() {
  document.querySelectorAll('[data-add-cart]').forEach((el) => el.addEventListener('click', () => addToCart(Number(el.dataset.addCart))));
  document.querySelectorAll('[data-land-interest]').forEach((el) => el.addEventListener('click', () => { const product = findProduct(Number(el.dataset.landInterest)); showToast(`Interesse registrado! Um corretor parceiro entrará em contato sobre ${product?.name}.`); }));
}

function bindShopEvents() {
  document.querySelector('[data-action="shop-back"]')?.addEventListener('click', () => { state.page = 'home'; state.activeNav = 'Início'; render(); });
  document.querySelectorAll('[data-shop-category]').forEach((el) => el.addEventListener('click', () => { state.shopCategory = el.dataset.shopCategory; render(); }));
  const searchInput = document.querySelector('#shop-search-input');
  searchInput?.addEventListener('input', () => {
    state.shopQuery = searchInput.value;
    const grid = document.querySelector('#shop-grid');
    if (grid) grid.innerHTML = shopGridMarkup();
    const filtered = shopFilteredProducts();
    const count = document.querySelector('#shop-count');
    if (count) count.textContent = `${filtered.length} produto${filtered.length === 1 ? '' : 's'}`;
    const cat = document.querySelector('.shop-result-cat');
    if (cat) cat.textContent = `${state.shopCategory}${state.shopQuery ? ` · “${state.shopQuery}”` : ''}`;
    bindShopCardEvents();
  });
  bindShopCardEvents();
  document.querySelector('[data-action="open-cart"]')?.addEventListener('click', () => { state.cartOpen = true; render(); });
  document.querySelectorAll('[data-action="close-cart"]').forEach((el) => el.addEventListener('click', () => { state.cartOpen = false; render(); }));
  document.querySelectorAll('[data-cart-qty]').forEach((el) => el.addEventListener('click', () => changeCartQty(Number(el.dataset.cartQty), Number(el.dataset.delta))));
  document.querySelectorAll('[data-action="open-sell"]').forEach((el) => el.addEventListener('click', () => { state.myStoreEditing = null; state.sellOpen = true; render(); }));
  document.querySelector('[data-action="open-mystore"]')?.addEventListener('click', () => { state.page = 'myStore'; state.sellOpen = false; render(); });
  bindSellForm((product) => { state.shopCategory = product.category; state.shopQuery = ''; });
  document.querySelector('[data-action="open-checkout"]')?.addEventListener('click', () => { state.checkoutOpen = true; state.checkoutDone = false; state.checkoutStep = 1; render(); });
  document.querySelectorAll('[data-action="close-checkout"]').forEach((el) => el.addEventListener('click', () => { const finished = state.checkoutDone; state.checkoutOpen = false; if (finished) { state.cart = []; saveCart(); state.cartOpen = false; state.checkoutDone = false; state.checkoutStep = 1; state.checkoutData = {}; } render(); }));
  document.querySelectorAll('[data-checkout-back]').forEach((el) => el.addEventListener('click', () => { state.checkoutStep = Math.max(1, state.checkoutStep - 1); render(); }));
  document.querySelector('#checkout-step1')?.addEventListener('submit', (event) => { event.preventDefault(); state.checkoutData = { ...state.checkoutData, ...Object.fromEntries(new FormData(event.currentTarget).entries()) }; state.checkoutStep = 2; render(); });
  document.querySelector('#checkout-step2')?.addEventListener('submit', (event) => { event.preventDefault(); state.checkoutData = { ...state.checkoutData, ...Object.fromEntries(new FormData(event.currentTarget).entries()) }; state.checkoutStep = 3; render(); });
  document.querySelector('[data-action="confirm-order"]')?.addEventListener('click', () => {
    const data = state.checkoutData;
    state.lastOrderId = `GDN-${String(Date.now()).slice(-6)}`;
    const items = state.cart.map((item) => { const product = findProduct(item.id); return { produto: product?.name, quantidade: item.qty, valor: product ? product.price * item.qty : 0 }; });
    state.profile = { ...state.profile, name: data.name || state.profile.name, email: data.email || state.profile.email, phone: data.phone || state.profile.phone };
    saveProfile();
    state.checkoutDone = true;
    render();
  });
}

let radarMapInstance = null;
let radarAnimationInterval = null;
let radarTruckMarkers = [];
const radarRouteById = (id) => state.radar.routes.find((route) => route.id === id);
const radarOpportunityFor = (lotId) => state.radar.opportunities.find((item) => item.lotId === lotId && radarRouteById(item.routeId));
const radarKey = (item) => `${item.lotId}-${item.routeId}`;
const formatKm = (km) => (km < 1 ? 'menos de 1 km' : `${km} km`);
const formatDateTime = (value) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value));

function radarHintMarkup(item) {
  const route = radarRouteById(item.routeId);
  return `<div class="lot-radar-hint">${icon('route', 20)}<div><strong>Radar de Frete</strong><span>Caminhão volta vazio a ${formatKm(item.km)} desta fazenda (${escapeHtml(route.origin)} → ${escapeHtml(route.dest)}, ${escapeHtml(route.departs.toLowerCase())}). Frete com 30% de desconto nesta compra.</span></div></div>`;
}

async function loadRadar() {
  try {
    const data = await apiRequest('/radar');
    state.radar = { routes: data.routes, opportunities: data.opportunities, radiusKm: data.radiusKm, loaded: true };
  } catch { state.radar.loaded = true; }
}

// Registra a visualização na API; se houver retorno vazio perto da fazenda, a API cria a notificação e o app mostra o aviso.
async function recordLotView(lot) {
  try {
    const { opportunities } = await apiRequest(`/lots/${lot.id}/view`, { method: 'POST' });
    if (!opportunities.length) return;
    if (!state.radar.routes.length) await loadRadar();
    else state.radar.opportunities = [...opportunities, ...state.radar.opportunities.filter((item) => !opportunities.some((fresh) => radarKey(fresh) === radarKey(item)))];
    const item = opportunities[0];
    const route = radarRouteById(item.routeId);
    if (!route) return;
    const body = `Caminhão da ${route.carrier} volta vazio de ${route.origin} para ${route.dest} (${route.departs.toLowerCase()}) e passa a ${formatKm(item.km)} da ${lot.seller}. Aproveite: frete com 30% de desconto no lote ${lot.name}.`;
    apiRequest('/notifications').then((data) => { state.notifications = data.notifications; }).catch(() => {});
    try { if (typeof Notification !== 'undefined' && Notification.permission === 'granted') new Notification('GadOn · Radar de Frete', { body, icon: '/gadon-icon-192.png' }); } catch { /* notificações indisponíveis */ }
    if (state.page === 'lot' && state.lotId === lot.id && !document.querySelector('.lot-radar-hint')) document.querySelector('.lot-buybox .lot-place')?.insertAdjacentHTML('afterend', radarHintMarkup(item));
    showRadarAlert(lot, body);
  } catch { /* visualização é complementar; não interrompe a navegação */ }
}

function showRadarAlert(lot, body) {
  document.querySelector('.app-radar-alert')?.remove();
  document.querySelector('#app')?.insertAdjacentHTML('beforeend', `<div class="radar-alert app-radar-alert" role="alert"><span class="radar-alert-icon">${icon('truck', 22)}</span><div class="radar-alert-copy"><strong>Radar de Frete: oportunidade de frete</strong><p>${escapeHtml(body)}</p></div><div class="radar-alert-actions"><button type="button" class="radar-alert-cta" data-radar-alert="lot">Ver o anúncio</button><button type="button" class="radar-alert-skip" data-radar-alert="radar">Acompanhar no Radar</button><button type="button" class="radar-alert-skip" data-radar-alert="close">Agora não</button></div></div>`);
  const alert = document.querySelector('.app-radar-alert');
  alert?.querySelectorAll('[data-radar-alert]').forEach((el) => el.addEventListener('click', (event) => {
    event.stopPropagation();
    alert.remove();
    if (el.dataset.radarAlert === 'lot') openLotPage(lot.id);
    if (el.dataset.radarAlert === 'radar') navigateTo('Radar de Frete');
  }));
}

function circlePolygon([lng, lat], km) {
  const points = Array.from({ length: 65 }, (_, i) => { const angle = (i / 64) * 2 * Math.PI; return [lng + (km / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.cos(angle), lat + (km / 110.574) * Math.sin(angle)]; });
  return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [points] } };
}

function destroyRadarMap() {
  if (radarAnimationInterval) { clearInterval(radarAnimationInterval); radarAnimationInterval = null; }
  radarTruckMarkers = [];
  if (radarMapInstance) { radarMapInstance.remove(); radarMapInstance = null; }
}

const radarOsmStyle = () => ({
  version: 8,
  sources: { osm: { type: 'raster', tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap' } },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
});

async function resolveRoutePoints(route) {
  const cacheKey = `gadon.route.v2.${route.id}`;
  try { const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null'); if (cached?.points?.length) { route.points = cached.points; route.roadKm = cached.roadKm; return; } } catch { /* sem cache */ }
  try {
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${route.from[0]},${route.from[1]};${route.to[0]},${route.to[1]}?overview=full&geometries=geojson`);
    const data = await response.json();
    const road = data.routes?.[0];
    if (road?.geometry?.coordinates?.length) {
      route.points = road.geometry.coordinates;
      route.roadKm = Math.round(road.distance / 1000);
      try { localStorage.setItem(cacheKey, JSON.stringify({ points: route.points, roadKm: route.roadKm })); } catch { /* cache indisponível */ }
      return;
    }
  } catch { /* OSRM indisponível — usa arco aproximado */ }
  route.points = routeArc(route.from, route.to, route.type === 'volta' ? -0.16 : 0.16);
  route.roadKm = haversineKm(route.from, route.to);
}

function mountRadarMap() {
  const container = document.querySelector('#radar-map');
  if (!container) return;
  if (!state.radar.loaded) { loadRadar().then(() => { if (state.page === 'radar') render(); }); return; }
  const radarRoutes = state.radar.routes;
  const RADAR_RADIUS_KM = state.radar.radiusKm;
  radarMapInstance = new maplibregl.Map({ container, style: radarOsmStyle(), center: [-52.5, -19], zoom: 4.8 });
  radarMapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
  const map = radarMapInstance;
  const farms = [...new Map(state.radar.opportunities.map((item) => [item.lotId, findLotById(item.lotId)]).filter(([, lot]) => lot?.coords)).values()];
  const seenCities = new Set();
  radarRoutes.forEach((route) => {
    [[route.from, route.origin], [route.to, route.dest]].forEach(([coords, label]) => {
      if (seenCities.has(label)) return;
      seenCities.add(label);
      const cityEl = document.createElement('div');
      cityEl.className = 'radar-city-dot';
      cityEl.innerHTML = `<i></i><span>${escapeHtml(label)}</span>`;
      new maplibregl.Marker({ element: cityEl, anchor: 'left' }).setLngLat(coords).addTo(map);
    });
  });
  farms.forEach((lot) => {
    const farmEl = document.createElement('button');
    farmEl.type = 'button';
    farmEl.className = 'radar-farm-marker';
    farmEl.setAttribute('aria-label', `${lot.seller}: ver anúncio ${lot.name}`);
    farmEl.innerHTML = `${icon('home', 14)}<span>${escapeHtml(lot.seller)}</span>`;
    farmEl.addEventListener('click', () => openLotPage(lot.id));
    new maplibregl.Marker({ element: farmEl, anchor: 'bottom' }).setLngLat(lot.coords).addTo(map);
  });
  const bounds = new maplibregl.LngLatBounds();
  radarRoutes.forEach((route) => { bounds.extend(route.from); bounds.extend(route.to); });
  farms.forEach((lot) => bounds.extend(lot.coords));
  map.fitBounds(bounds, { padding: window.innerWidth < 860 ? { top: 40, bottom: 40, left: 40, right: 40 } : { top: 60, bottom: 60, left: 440, right: 60 }, duration: 900 });
  map.on('load', async () => {
    await Promise.all(radarRoutes.map(resolveRoutePoints));
    if (radarMapInstance !== map) return;
    farms.forEach((lot) => {
      map.addSource(`farm-${lot.id}`, { type: 'geojson', data: circlePolygon(lot.coords, RADAR_RADIUS_KM) });
      map.addLayer({ id: `farm-${lot.id}-fill`, type: 'fill', source: `farm-${lot.id}`, paint: { 'fill-color': '#BE611E', 'fill-opacity': 0.12 } });
      map.addLayer({ id: `farm-${lot.id}-line`, type: 'line', source: `farm-${lot.id}`, paint: { 'line-color': '#BE611E', 'line-width': 1.5, 'line-dasharray': [2, 2] } });
    });
    radarRoutes.forEach((route) => {
      map.addSource(`route-${route.id}`, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: route.points } } });
      map.addLayer({ id: `route-${route.id}-casing`, type: 'line', source: `route-${route.id}`, layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffffff', 'line-width': route.type === 'ida' ? 6.5 : 6, 'line-opacity': 0.75, 'line-offset': route.type === 'volta' ? 4 : 0 } });
      map.addLayer({ id: `route-${route.id}`, type: 'line', source: `route-${route.id}`, layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: route.type === 'ida' ? { 'line-color': '#BE611E', 'line-width': 3.5, 'line-opacity': 0.95 } : { 'line-color': '#0B513A', 'line-width': 3.5, 'line-opacity': 0.95, 'line-dasharray': [0.5, 1.6], 'line-offset': 4 } });
      const truckEl = document.createElement('div');
      truckEl.className = `radar-truck ${route.type}`;
      truckEl.innerHTML = icon('truck', 15);
      truckEl.addEventListener('click', () => selectRadarRoute(route.id));
      const position = route.type === 'ida' ? route.points[Math.floor((route.progress || 0) * (route.points.length - 1))] : route.from;
      radarTruckMarkers.push({ route, marker: new maplibregl.Marker({ element: truckEl }).setLngLat(position).addTo(map) });
    });
    radarAnimationInterval = setInterval(() => {
      radarTruckMarkers.forEach((item) => {
        if (item.route.type !== 'ida' || !item.route.points) return;
        item.route.progress = (item.route.progress + 0.0009) % 1;
        item.marker.setLngLat(item.route.points[Math.floor(item.route.progress * (item.route.points.length - 1))]);
      });
    }, 120);
  });
}

function selectRadarRoute(id) {
  state.radarSelected = id;
  const route = radarRouteById(id);
  if (!route) return;
  document.querySelectorAll('[data-radar-route]').forEach((el) => el.classList.toggle('selected', Number(el.dataset.radarRoute) === id));
  if (radarMapInstance && route.points) {
    const mid = route.points[Math.floor(route.points.length / 2)];
    radarMapInstance.flyTo({ center: mid, zoom: 6, duration: 900 });
  }
  const nearby = state.radar.opportunities.filter((item) => item.routeId === route.id).map((item) => ({ ...item, lot: findLotById(item.lotId) })).filter((item) => item.lot);
  const detail = document.querySelector('#radar-detail');
  if (detail) detail.innerHTML = `<div class="radar-detail-card ${route.type}"><div class="radar-detail-head"><span class="radar-type-badge ${route.type}">${route.type === 'ida' ? 'FRETE DE IDA' : 'RETORNO VAZIO'}</span><span class="radar-detail-status">${escapeHtml(route.status)}</span></div><strong>${escapeHtml(route.origin)} → ${escapeHtml(route.dest)}</strong><p>${escapeHtml(route.cargo)} · ${escapeHtml(route.carrier)}</p>${route.type === 'volta' && nearby.length ? `<p class="radar-nearby">${icon('home', 13)} Passa perto de: ${nearby.map((item) => `${escapeHtml(item.lot.seller)} (${formatKm(item.km)})`).join(', ')}</p>` : ''}<div class="radar-detail-meta"><span>${icon('calendar', 13)} ${escapeHtml(route.departs)}</span><span>${icon('route', 13)} ${route.roadKm || haversineKm(route.from, route.to)} km pela estrada</span>${route.price ? `<span class="radar-price">${formatBRL(route.price)}</span>` : ''}</div>${route.type === 'volta' ? `<button type="button" class="primary-button radar-request-cta" data-radar-request="${route.id}">Enviar carga nesta volta ${icon('arrow', 14)}</button>` : `<div class="radar-progress"><span>Progresso da viagem</span><div class="progress-track"><i style="width:${Math.round((route.progress || 0) * 100)}%"></i></div><b>${Math.round((route.progress || 0) * 100)}%</b></div>`}</div>`;
  detail?.querySelector('[data-radar-request]')?.addEventListener('click', () => openRadarRequest(route.id));
}

function openRadarRequest(routeId) {
  const route = radarRouteById(routeId);
  const slot = document.querySelector('#radar-modal-slot');
  if (!route || !slot) return;
  slot.innerHTML = `<div class="checkout-overlay"><div class="checkout-card"><div class="checkout-head"><strong>${icon('repeat', 17)} Solicitar frete de volta</strong><button type="button" data-radar-modal-close aria-label="Fechar">${icon('close', 17)}</button></div><div class="radar-request-route"><span class="radar-type-badge volta">VOLTA</span><b>${escapeHtml(route.origin)} → ${escapeHtml(route.dest)}</b><small>${escapeHtml(route.carrier)} · ${escapeHtml(route.departs)} · ${formatBRL(route.price)}</small></div><form id="radar-request-form" class="checkout-form"><label><span>Tipo de carga</span><select name="cargoType"><option>Gado de corte</option><option>Gado leiteiro</option><option>Bezerros</option><option>Insumos agropecuários</option><option>Grãos / ração</option></select></label><label><span>Quantidade / peso</span><input name="quantity" placeholder="Ex.: 40 cabeças ou 8 toneladas" required /></label><label><span>Celular / WhatsApp</span><input name="phone" type="tel" autocomplete="tel" value="${escapeHtml(state.profile.phone)}" placeholder="(00) 00000-0000" required /></label><button type="submit" class="primary-button">Solicitar espaço ${icon('check', 16)}</button></form></div></div>`;
  const close = () => { slot.innerHTML = ''; };
  slot.querySelector('[data-radar-modal-close]')?.addEventListener('click', close);
  slot.querySelector('#radar-request-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    try {
      await apiRequest('/freight/return-requests', { method: 'POST', body: { routeId: route.id, cargoType: data.cargoType, quantity: data.quantity, phone: data.phone } });
    } catch (error) {
      if (button) button.disabled = false;
      showToast(error.message);
      return;
    }
    slot.innerHTML = `<div class="checkout-overlay"><div class="checkout-card checkout-success"><div class="checkout-check">${icon('check', 34)}</div><h2>Solicitação enviada!</h2><p>Recebemos seu pedido para a volta <b>${escapeHtml(route.origin)} → ${escapeHtml(route.dest)}</b>. A equipe GadOn encaminha à <b>${escapeHtml(route.carrier)}</b> e você recebe o contato no telefone informado para fechar o frete.</p><button type="button" class="primary-button" data-radar-modal-close>Fechar</button></div></div>`;
    slot.querySelector('[data-radar-modal-close]')?.addEventListener('click', close);
  });
}

function radarRouteCard(route) {
  return `<button type="button" class="radar-card ${route.type} ${state.radarSelected === route.id ? 'selected' : ''}" data-radar-route="${route.id}"><div class="radar-card-top"><span class="radar-type-badge ${route.type}">${route.type === 'ida' ? 'IDA' : 'RETORNO VAZIO'}</span><span class="radar-card-status">${route.type === 'ida' ? `${icon('truck', 12)} ${escapeHtml(route.status)}` : `${icon('repeat', 12)} ${escapeHtml(route.status)}`}</span></div><strong>${escapeHtml(route.origin)} <em>→</em> ${escapeHtml(route.dest)}</strong><span class="radar-card-meta">${escapeHtml(route.cargo)}</span><div class="radar-card-foot"><small>${icon('calendar', 12)} ${escapeHtml(route.departs)}</small>${route.price ? `<b>${formatBRL(route.price)}</b>` : `<small>${Math.round((route.progress || 0) * 100)}% da rota</small>`}</div></button>`;
}

function radarOpportunitiesMarkup() {
  if (!state.radar.loaded) return `<div class="radar-detail-empty">${icon('route', 22)}<p>Verificando rotas perto das fazendas que você viu…</p></div>`;
  const items = state.radar.opportunities.map((item) => ({ ...item, lot: findLotById(item.lotId), route: radarRouteById(item.routeId) })).filter((item) => item.lot && item.route);
  if (!items.length) return `<div class="radar-detail-empty radar-opportunity-empty">${icon('eye', 22)}<p>Veja anúncios de lotes. Quando um caminhão estiver previsto para voltar vazio a até ${state.radar.radiusKm} km da fazenda de um lote que você viu nas últimas 48 horas, avisamos você aqui.</p><button type="button" class="secondary-button" data-nav="Buscar gado">Buscar gado ${icon('arrow', 15)}</button></div>`;
  return items.map((item) => {
    const following = state.radarFollowing.includes(radarKey(item));
    return `<article class="radar-opportunity ${following ? 'is-following' : ''}"><img src="${item.lot.image}" alt="" /><div class="radar-opportunity-copy"><span class="radar-type-badge volta">RETORNO VAZIO</span><strong>${escapeHtml(item.lot.name)} · ${escapeHtml(item.lot.seller)}</strong><span>${escapeHtml(item.route.origin)} → ${escapeHtml(item.route.dest)} · ${escapeHtml(item.route.departs)}</span><small>${icon('pin', 13)} Passa a ${formatKm(item.km)} da fazenda · frete com 30% de desconto</small><small>${icon('clock', 13)} Válido até ${formatDateTime(item.expiresAt)}</small></div><div class="radar-opportunity-actions"><button type="button" class="primary-button" data-radar-lot="${item.lot.id}">Voltar ao anúncio</button><button type="button" class="secondary-button" data-radar-follow="${radarKey(item)}" aria-pressed="${following}">${following ? `${icon('check', 14)} Acompanhando` : 'Acompanhar'}</button></div></article>`;
  }).join('');
}

function bindRadarOpportunityEvents() {
  document.querySelectorAll('[data-radar-lot]').forEach((el) => el.addEventListener('click', () => openLotPage(el.dataset.radarLot)));
  document.querySelectorAll('[data-radar-follow]').forEach((el) => el.addEventListener('click', () => {
    const key = el.dataset.radarFollow;
    state.radarFollowing = state.radarFollowing.includes(key) ? state.radarFollowing.filter((item) => item !== key) : [...state.radarFollowing, key];
    saveJson('gadon.radar-following.v1', state.radarFollowing);
    const list = document.querySelector('#radar-opportunities');
    if (list) { list.innerHTML = radarOpportunitiesMarkup(); bindRadarOpportunityEvents(); }
    if (state.radarFollowing.includes(key)) selectRadarRoute(Number(key.split('-')[1]));
  }));
}

function radarTemplate() {
  const radarRoutes = state.radar.routes;
  const RADAR_RADIUS_KM = state.radar.radiusKm;
  const notificationsOn = typeof Notification !== 'undefined' && Notification.permission === 'granted';
  return `<div class="radar-shell">
    <header class="radar-topbar"><button class="back-link" data-action="radar-back">${icon('back', 17)} Voltar</button><div class="radar-title"><strong>${icon('route', 20)} Radar de Frete</strong><span class="live-pill"><i></i> TEMPO REAL</span></div><div class="radar-actions"><button type="button" id="radar-notify" class="radar-action-button" ${notificationsOn ? 'disabled' : ''}>${icon(notificationsOn ? 'check' : 'bell', 16)} ${notificationsOn ? 'Notificações ativas' : 'Ativar notificações'}</button></div></header>
    <div class="radar-body">
      <aside class="radar-panel">
        <div class="radar-panel-head"><p class="eyebrow">OPORTUNIDADES PARA VOCÊ</p><p class="radar-rule">Caminhões previstos para voltar vazios a até ${RADAR_RADIUS_KM} km da fazenda de um lote que você viu nas últimas 48 horas.</p></div>
        <div class="radar-opportunities" id="radar-opportunities">${radarOpportunitiesMarkup()}</div>
        <div class="radar-panel-head"><p class="eyebrow">ROTAS ATIVAS AGORA</p><div class="radar-legend"><span><i class="legend-ida"></i> Ida em trânsito</span><span><i class="legend-volta"></i> Retorno vazio</span><span><i class="legend-farm"></i> Fazenda · ${RADAR_RADIUS_KM} km</span></div></div>
        <div class="radar-cards">${radarRoutes.map(radarRouteCard).join('')}</div>
        <div class="radar-detail" id="radar-detail"><div class="radar-detail-empty">${icon('pin', 22)}<p>Selecione uma rota no painel ou clique em um caminhão no mapa.</p></div></div>
      </aside>
      <div id="radar-map" class="radar-map"></div>
    </div>
    <div id="radar-alert-slot"></div>
    <div id="radar-modal-slot"></div>
  </div>`;
}

function bindRadarEvents() {
  document.querySelector('[data-action="radar-back"]')?.addEventListener('click', () => navigateTo('Início'));
  document.querySelector('#radar-notify')?.addEventListener('click', async () => {
    if (typeof Notification === 'undefined') { showToast('Este navegador não permite notificações.'); return; }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') { const button = document.querySelector('#radar-notify'); if (button) { button.disabled = true; button.innerHTML = `${icon('check', 16)} Notificações ativas`; } }
    else showToast('As notificações foram bloqueadas no navegador. Os avisos continuam aparecendo no sino do GadOn.');
  });
  document.querySelectorAll('[data-radar-route]').forEach((el) => el.addEventListener('click', () => selectRadarRoute(Number(el.dataset.radarRoute))));
  bindRadarOpportunityEvents();
}

let auctionInterval = null;
let auctionCamIndex = 0;
let auctionTickCount = 0;
let userAuctionStream = null;
let userBroadcastFacing = 'environment';
const currentAuctionLot = () => state.userAuctionLot || auctionLots[state.auctionIndex % auctionLots.length];

function resetAuctionLot() {
  const lot = currentAuctionLot();
  state.auctionBid = lot.startBid;
  state.auctionLeader = 'Lance inicial do leiloeiro';
  state.auctionHistory = [{ bidder: 'Leiloeiro GadOn', amount: lot.startBid, time: nowTime(), opening: true }];
  state.auctionEndsAt = Date.now() + 90 * 1000;
  state.auctionStatus = 'live';
  state.auctionViewers = 180 + Math.floor(Math.random() * 120);
  state.auctionUserBids = 0;
  auctionCamIndex = 0;
  auctionTickCount = 0;
}

function startAuctionEngine() {
  if (!state.auctionEndsAt || state.auctionStatus === 'sold') resetAuctionLot();
  if (!auctionInterval) auctionInterval = setInterval(auctionTick, 1000);
  updateAuctionDom();
  ensureAuctionFeedPlays();
}

function stopAuctionEngine() {
  if (auctionInterval) { clearInterval(auctionInterval); auctionInterval = null; }
}

const auctionRemainingSeconds = () => Math.max(0, Math.round((state.auctionEndsAt - Date.now()) / 1000));

function auctionTick() {
  if (state.page !== 'auction') { stopAuctionEngine(); return; }
  auctionTickCount += 1;
  const clock = document.querySelector('#auction-clock');
  if (clock) clock.textContent = nowTime();
  if (auctionTickCount % 8 === 0) {
    const lot = currentAuctionLot();
    if (lot.cameras?.length > 1) {
      auctionCamIndex = (auctionCamIndex + 1) % lot.cameras.length;
      const feed = document.querySelector('#auction-cam');
      const label = document.querySelector('#auction-cam-label');
      if (feed) {
        feed.classList.add('cam-fade');
        setTimeout(() => {
          feed.innerHTML = auctionFeedMarkup(lot, auctionCamIndex);
          if (label) label.innerHTML = `<i></i> ${auctionCameraLabels[auctionCamIndex % auctionCameraLabels.length]}`;
          feed.classList.remove('cam-fade');
          ensureAuctionFeedPlays();
        }, 260);
      }
    }
  }
  if (state.auctionStatus !== 'live') return;
  const remaining = auctionRemainingSeconds();
  const chance = remaining < 15 ? 0.32 : remaining < 45 ? 0.16 : 0.09;
  if (remaining > 2 && Math.random() < chance) {
    const lot = currentAuctionLot();
    const bot = auctionBotNames[Math.floor(Math.random() * auctionBotNames.length)];
    placeAuctionBid(bot, lot.increment * (Math.random() < 0.2 ? 2 : 1));
  }
  if (Math.random() < 0.25) state.auctionViewers = Math.max(150, state.auctionViewers + Math.floor(Math.random() * 7) - 3);
  if (remaining <= 0) { finishAuctionLot(); return; }
  updateAuctionDom();
}

function placeAuctionBid(bidder, raise) {
  if (state.auctionStatus !== 'live') return;
  state.auctionBid += raise;
  state.auctionLeader = bidder;
  state.auctionHistory.unshift({ bidder, amount: state.auctionBid, time: nowTime(), you: bidder === 'Você' });
  state.auctionHistory = state.auctionHistory.slice(0, 25);
  if (state.auctionEndsAt - Date.now() < 12000) state.auctionEndsAt = Date.now() + 12000;
  updateAuctionDom(true);
}

function placeUserAuctionBid(raise) {
  if (state.auctionStatus !== 'live' || !raise || raise <= 0) return;
  placeAuctionBid('Você', raise);
  state.auctionUserBids += 1;
}

function finishAuctionLot() {
  state.auctionStatus = 'sold';
  updateAuctionDom();
  const overlay = document.querySelector('#auction-sold');
  if (overlay) {
    overlay.hidden = false;
    const winnerEl = overlay.querySelector('[data-sold-winner]');
    const amountEl = overlay.querySelector('[data-sold-amount]');
    if (winnerEl) winnerEl.textContent = state.auctionLeader === 'Você' ? 'Parabéns! Você arrematou o lote! 🎉' : `Arrematado por ${state.auctionLeader}`;
    if (amountEl) amountEl.textContent = formatBRL(state.auctionBid);
  }
  setTimeout(() => { if (state.page !== 'auction') return; if (state.userAuctionLot) stopUserBroadcast(); else state.auctionIndex += 1; resetAuctionLot(); render(); }, 6000);
}

const bidderColor = (name) => ['#f47a18', '#287ec2', '#2ea56b', '#a855f7', '#e11d48', '#0ea5e9'][name.length % 6];
const bidderInitials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
const auctionHistoryMarkup = () => state.auctionHistory.map((entry) => `<div class="bid-entry ${entry.you ? 'is-you' : ''} ${entry.opening ? 'is-open' : ''}"><span class="bid-avatar" style="background:${entry.you ? 'var(--green)' : bidderColor(entry.bidder)}">${entry.you ? icon('user', 12) : bidderInitials(entry.bidder)}</span><span class="bid-entry-name">${escapeHtml(entry.bidder)}</span><span class="bid-entry-amount">${formatBRL(entry.amount)}</span><span class="bid-entry-time">${entry.time}</span></div>`).join('');

function updateAuctionDom(bidFlash = false) {
  const remaining = auctionRemainingSeconds();
  const timer = document.querySelector('#auction-timer');
  if (timer) { timer.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`; timer.classList.toggle('urgent', remaining <= 15 && state.auctionStatus === 'live'); }
  const ring = document.querySelector('#auction-ring');
  if (ring) { const circumference = 2 * Math.PI * 34; const ratio = Math.min(1, remaining / 90); ring.style.strokeDasharray = circumference; ring.style.strokeDashoffset = circumference * (1 - ratio); ring.classList.toggle('urgent', remaining <= 15 && state.auctionStatus === 'live'); }
  const bidCount = document.querySelector('#auction-bidcount');
  if (bidCount) bidCount.textContent = Math.max(0, state.auctionHistory.length - 1);
  document.querySelector('#auction-panel')?.classList.toggle('is-leading', state.auctionLeader === 'Você');
  const bid = document.querySelector('#auction-bid');
  if (bid) { bid.textContent = formatBRL(state.auctionBid); if (bidFlash) { bid.classList.remove('flash'); void bid.offsetWidth; bid.classList.add('flash'); } }
  const leader = document.querySelector('#auction-leader');
  if (leader) { leader.textContent = state.auctionLeader === 'Você' ? 'Você está liderando! 🥇' : state.auctionLeader; leader.classList.toggle('is-you', state.auctionLeader === 'Você'); }
  const history = document.querySelector('#auction-history');
  if (history) history.innerHTML = auctionHistoryMarkup();
  const viewers = document.querySelector('#auction-viewers');
  if (viewers) viewers.textContent = state.auctionViewers;
  const fichaBid = document.querySelector('#ficha-bid');
  if (fichaBid) fichaBid.textContent = formatBRL(state.auctionBid);
  document.querySelectorAll('[data-bid-raise]').forEach((el) => { const next = el.querySelector('b'); if (next) next.textContent = formatBRL(state.auctionBid + Number(el.dataset.bidRaise)); });
}

async function startUserBroadcast(form) {
  if (!navigator.mediaDevices?.getUserMedia) { showToast('Seu navegador não permite acesso à câmera.'); return; }
  userBroadcastFacing = form.camera === 'user' ? 'user' : 'environment';
  try { userAuctionStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: userBroadcastFacing }, audio: false }); }
  catch { showToast('Não foi possível acessar a câmera. Verifique a permissão do navegador.'); return; }
  const startBid = Number(String(form.startBid).replace(/\D/g, '')) || 50000;
  const increment = Number(String(form.increment).replace(/\D/g, '')) || 500;
  state.userAuctionLot = {
    id: 990, name: form.name || 'Meu lote de gado', tag: 'SEU LOTE', desc: form.desc || 'Transmissão ao vivo do vendedor', place: 'Sua fazenda', seller: state.profile.name,
    startBid, increment, live: true, image: '/home-hero-nelore.png',
    cameras: [{ type: 'live', src: '' }],
    ficha: { 'Vendedor': state.profile.name, 'Lote': form.name || 'Meu lote de gado', 'Descrição': form.desc || 'Demonstração ao vivo', 'Lance inicial': formatBRL(startBid), 'Incremento mínimo': formatBRL(increment), 'Transmissão': 'Câmera ao vivo do vendedor' },
  };
  state.broadcastOpen = false;
  resetAuctionLot();
  render();
}

function stopUserBroadcast() {
  userAuctionStream?.getTracks().forEach((track) => track.stop());
  userAuctionStream = null;
  state.userAuctionLot = null;
}

const broadcastCamLabel = () => (userBroadcastFacing === 'user' ? 'CAM FRONTAL · Você' : 'CAM TRASEIRA · Animal');

async function flipBroadcastCamera() {
  if (!state.userAuctionLot) return;
  const next = userBroadcastFacing === 'environment' ? 'user' : 'environment';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: next }, audio: false });
    userAuctionStream?.getTracks().forEach((track) => track.stop());
    userAuctionStream = stream;
    userBroadcastFacing = next;
    const video = document.querySelector('#auction-cam video');
    if (video) { video.srcObject = stream; video.classList.toggle('is-mirrored', next === 'user'); const playing = video.play(); if (playing) playing.catch(() => { /* autoplay bloqueado */ }); }
    const label = document.querySelector('#auction-cam-label');
    if (label) label.innerHTML = `<i></i> ${broadcastCamLabel()}`;
  } catch { showToast('Não foi possível trocar de câmera neste aparelho.'); }
}

function broadcastModalTemplate() {
  return `<div class="checkout-overlay"><div class="checkout-card broadcast-card"><div class="checkout-head"><strong>${icon('camera', 17)} Leiloar meu lote ao vivo</strong><button type="button" data-action="close-broadcast" aria-label="Fechar">${icon('close', 17)}</button></div><p class="broadcast-note">Abra a câmera do seu aparelho, mostre o gado e acompanhe os lances chegando em tempo real — a simulação completa do pregão, com você como vendedor.</p><form id="broadcast-form" class="checkout-form"><label><span>Nome do lote</span><input name="name" placeholder="Ex.: Nelore da minha fazenda" required maxlength="60" /></label><label><span>Descrição curta</span><input name="desc" placeholder="Ex.: 20 machos · 15@ média" maxlength="80" /></label><div class="broadcast-grid"><label><span>Lance inicial (R$)</span><input name="startBid" type="number" min="1000" step="500" value="50000" required /></label><label><span>Incremento (R$)</span><input name="increment" type="number" min="100" step="100" value="500" required /></label></div><p class="checkout-group-label">Qual câmera iniciar?</p><div class="option-cards"><label class="option-card"><input type="radio" name="camera" value="environment" checked /><div>${icon('cow', 17)}<b>Traseira</b><span>Mostrar o animal</span></div></label><label class="option-card"><input type="radio" name="camera" value="user" /><div>${icon('user', 17)}<b>Frontal</b><span>Você apresentando</span></div></label></div><small class="broadcast-tip">${icon('repeat', 12)} Dá pra trocar de câmera a qualquer momento durante o pregão.</small><button type="submit" class="primary-button">${icon('camera', 16)} Abrir câmera e iniciar pregão</button></form></div></div>`;
}

function auctionTemplate() {
  const lot = currentAuctionLot();
  const position = (state.auctionIndex % auctionLots.length) + 1;
  const queue = auctionLots.filter((item) => item.id !== lot.id).slice(0, 3);
  const tickerItems = [...auctionLots, ...auctionLots].map((item) => `<span class="ticker-item">${icon('gavel', 12)} ${escapeHtml(item.tag)} — ${escapeHtml(item.name)} · lance inicial <b>${formatBRL(item.startBid)}</b></span>`).join('<span class="ticker-dot">•</span>');
  return `<div class="auction-shell">
    <div class="auction-glow one"></div><div class="auction-glow two"></div>
    <header class="auction-topbar"><button class="back-link auction-back" data-action="auction-back">${icon('back', 16)} Voltar</button><div class="auction-brand"><img src="/brand/logo-horizontal-escuro.png" alt="GadOn" /><span>LEILÃO OFICIAL</span></div><div class="auction-live-meta">${state.userAuctionLot ? `<button type="button" class="broadcast-button is-live" data-action="stop-broadcast">${icon('stop', 14)} Encerrar transmissão</button>` : `<button type="button" class="broadcast-button" data-action="open-broadcast">${icon('camera', 14)} Leiloar meu lote</button>`}<span class="auction-viewers">${icon('eye', 15)} <b id="auction-viewers">${state.auctionViewers}</b> assistindo</span><span class="live-pill"><i></i> AO VIVO</span></div></header>
    <div class="auction-ticker"><div class="ticker-track">${tickerItems}</div></div>
    <main class="auction-layout">
      <section class="auction-stage">
        <div class="auction-media is-live">
          <div id="auction-cam" class="cam-feed-wrap">${auctionFeedMarkup(lot, auctionCamIndex)}</div>
          <div class="media-gradient"></div>
          <span class="auction-lot-tag">${lot.tag} <i>·</i> ${position} de ${auctionLots.length}</span>
          <span class="live-pill media-live"><i></i> AO VIVO</span>
          <div class="cam-toolbar"><span class="cam-label" id="auction-cam-label"><i></i> ${lot.live ? broadcastCamLabel() : auctionCameraLabels[auctionCamIndex % auctionCameraLabels.length]}</span><span class="cam-clock" id="auction-clock">--:--:--</span>${lot.live ? `<button type="button" class="cam-flip" data-action="flip-camera">${icon('repeat', 14)} Trocar câmera</button>` : ''}</div>
          <div class="media-lower">
            <h1>${escapeHtml(lot.name)}</h1>
            <p>${escapeHtml(lot.desc)}</p>
            <div class="auction-chips"><span>${icon('pin', 14)} ${escapeHtml(lot.place)}</span><span>${icon('user', 14)} ${escapeHtml(lot.seller)}</span><span class="chip-verified">${icon('shield', 14)} Documentação verificada</span><button type="button" class="ficha-button" data-ficha-toggle>${icon('file', 14)} Ver ficha do lote</button></div>
          </div>
        </div>
        <div class="auction-stats">
          <div class="auction-stat"><span>Lance inicial</span><strong>${formatBRL(lot.startBid)}</strong></div>
          <div class="auction-stat"><span>Incremento mínimo</span><strong>${formatBRL(lot.increment)}</strong></div>
          <div class="auction-stat"><span>Lances no lote</span><strong id="auction-bidcount">${Math.max(0, state.auctionHistory.length - 1)}</strong></div>
          <div class="auction-stat"><span>Condição</span><strong>À vista ou 30/60/90</strong></div>
        </div>
        <div class="auction-queue"><div class="auction-queue-head"><p class="eyebrow">A SEGUIR NO PREGÃO</p><span class="queue-line"></span></div><div class="auction-queue-grid">${queue.map((item, index) => `<div class="auction-queue-card"><span class="queue-order">${String(index + 1).padStart(2, '0')}</span><img src="${item.image}" alt="" /><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.desc)}</span><small>${icon('gavel', 11)} Inicial ${formatBRL(item.startBid)}</small></div></div>`).join('')}</div></div>
      </section>
      <aside class="auction-bid-panel ${state.auctionLeader === 'Você' ? 'is-leading' : ''}" id="auction-panel">
        <div class="panel-head"><span class="auctioneer-avatar">${icon('gavel', 19)}</span><div><strong>Leiloeiro oficial GadOn</strong><span>Pregão eletrônico · Lote ${position}</span></div></div>
        <div class="bid-row">
          <div class="bid-current"><span class="bid-label">LANCE ATUAL</span><strong id="auction-bid">${formatBRL(state.auctionBid)}</strong><small id="auction-leader" class="${state.auctionLeader === 'Você' ? 'is-you' : ''}">${state.auctionLeader === 'Você' ? 'Você está liderando! 🥇' : escapeHtml(state.auctionLeader)}</small></div>
          <div class="bid-ring"><svg viewBox="0 0 80 80"><circle class="ring-track" cx="40" cy="40" r="34"/><circle class="ring-progress" id="auction-ring" cx="40" cy="40" r="34"/></svg><div class="ring-center"><strong id="auction-timer">--:--</strong><span>martelo</span></div></div>
        </div>
        <div class="bid-actions">${[1, 2, 5].map((mult) => `<button type="button" class="bid-button" data-bid-raise="${lot.increment * mult}"><span>+ ${formatBRL(lot.increment * mult)}</span><b>${formatBRL(state.auctionBid + lot.increment * mult)}</b></button>`).join('')}</div>
        <form id="custom-bid-form" class="bid-custom"><div class="unit-input"><em>R$</em><input name="amount" type="number" min="100" step="100" placeholder="Acréscimo livre" /></div><button type="submit" class="bid-submit">${icon('gavel', 16)} Dar lance</button></form>
        <div class="bid-history-wrap"><div class="bid-history-head"><p class="eyebrow">HISTÓRICO DE LANCES</p><span class="history-live"><i></i> tempo real</span></div><div class="bid-history" id="auction-history">${auctionHistoryMarkup()}</div></div>
      </aside>
    </main>
    ${state.broadcastOpen ? broadcastModalTemplate() : ''}
    <div class="ficha-backdrop" id="ficha-backdrop" data-ficha-toggle></div>
    <aside class="ficha-drawer" id="ficha-drawer" aria-label="Ficha técnica do lote"><div class="ficha-head"><div><p class="eyebrow">FICHA TÉCNICA · ${lot.tag}</p><h3>${escapeHtml(lot.name)}</h3></div><button type="button" class="ficha-close" data-ficha-toggle aria-label="Fechar ficha">${icon('close', 17)}</button></div><div class="ficha-live"><span>Lance atual</span><b id="ficha-bid">${formatBRL(state.auctionBid)}</b><span class="live-pill"><i></i> AO VIVO</span></div><div class="ficha-rows">${Object.entries(lot.ficha).map(([key, value]) => `<div class="ficha-row"><span>${escapeHtml(key)}</span><b>${escapeHtml(value)}</b></div>`).join('')}</div><div class="ficha-foot">${icon('shield', 14)} Documentação conferida pela equipe GadOn antes do pregão.</div></aside>
    <div class="auction-sold" id="auction-sold" ${state.auctionStatus === 'sold' ? '' : 'hidden'}><div class="sold-confetti">${Array.from({ length: 14 }, (_, index) => `<i style="--i:${index}"></i>`).join('')}</div><div class="auction-sold-card"><div class="sold-hammer">${icon('gavel', 46)}</div><p class="eyebrow">MARTELO BATIDO</p><h2 data-sold-winner>Arrematado!</h2><strong data-sold-amount>${formatBRL(state.auctionBid)}</strong><span>Próximo lote em instantes…</span></div></div>
  </div>`;
}

function bindAuctionEvents() {
  document.querySelector('[data-action="auction-back"]')?.addEventListener('click', () => { stopAuctionEngine(); stopUserBroadcast(); state.page = 'home'; state.activeNav = 'Início'; render(); });
  document.querySelector('[data-action="open-broadcast"]')?.addEventListener('click', () => { state.broadcastOpen = true; render(); });
  document.querySelector('[data-action="close-broadcast"]')?.addEventListener('click', () => { state.broadcastOpen = false; render(); });
  document.querySelector('[data-action="stop-broadcast"]')?.addEventListener('click', () => { stopUserBroadcast(); resetAuctionLot(); render(); });
  document.querySelector('[data-action="flip-camera"]')?.addEventListener('click', flipBroadcastCamera);
  document.querySelector('#broadcast-form')?.addEventListener('submit', (event) => { event.preventDefault(); startUserBroadcast(Object.fromEntries(new FormData(event.currentTarget).entries())); });
  document.querySelectorAll('[data-ficha-toggle]').forEach((el) => el.addEventListener('click', () => { document.querySelector('#ficha-drawer')?.classList.toggle('open'); document.querySelector('#ficha-backdrop')?.classList.toggle('open'); }));
  document.querySelectorAll('[data-bid-raise]').forEach((el) => el.addEventListener('click', () => placeUserAuctionBid(Number(el.dataset.bidRaise))));
  document.querySelector('#custom-bid-form')?.addEventListener('submit', (event) => { event.preventDefault(); const amount = Number(new FormData(event.currentTarget).get('amount')); placeUserAuctionBid(amount); event.currentTarget.reset(); });
}

// Estrutura pronta para receber o conteúdo (aulas, dicas, passo a passo, documento e FAQ) produzido pelo Paulo.
const weigherLessons = [
  { id: 1, title: 'O papel do pesador no GadOn' },
  { id: 2, title: 'Contagem de cabeças no embarque' },
  { id: 3, title: 'Pesagem e registro no aplicativo' },
  { id: 4, title: 'Divergências e segurança da operação' },
];
const weigherQuiz = [
  { id: 'q1', question: 'No embarque, a contagem de cabeças não bate com a quantidade do anúncio. O que fazer?', options: ['Registrar a divergência no aplicativo antes de liberar o embarque', 'Ignorar se a diferença for pequena', 'Ajustar o número para bater com o anúncio'] },
  { id: 'q2', question: 'Quem perde quando a contagem de cabeças está errada?', options: ['Sempre o comprador', 'O pesador', 'Ninguém, a plataforma corrige depois'] },
  { id: 'q3', question: 'Quando o mini treinamento pode ser feito?', options: ['A qualquer momento', 'Depois de assistir e concluir todas as aulas', 'Antes da primeira aula'] },
];
const weigherAllWatched = () => weigherLessons.every((lesson) => state.weigherProgress.watched.includes(lesson.id));

function weigherStepsTemplate() {
  const progress = state.weigherProgress;
  const watchedCount = weigherLessons.filter((lesson) => progress.watched.includes(lesson.id)).length;
  const steps = [
    ['Assistir a todas as aulas', `${watchedCount} de ${weigherLessons.length} assistidas`, weigherAllWatched()],
    ['Concluir as aulas', progress.lessonsConcluded ? 'Aulas concluídas' : 'Disponível após assistir todas', progress.lessonsConcluded],
    ['Mini treinamento', progress.training?.passed ? 'Aprovado' : progress.lessonsConcluded ? 'Liberado' : 'Disponível após concluir as aulas', Boolean(progress.training?.passed)],
  ];
  return `<ol class="weigher-steps">${steps.map(([title, detail, done], index) => `<li class="${done ? 'done' : ''}"><i>${done ? icon('check', 16) : index + 1}</i><div><strong>${title}</strong><span>${detail}</span></div></li>`).join('')}</ol>`;
}

function weigherHomeTemplate() {
  const passed = Boolean(state.weigherProgress.training?.passed);
  const content = `<div class="weigher-page"><section class="weigher-hero"><div><p class="eyebrow">ÁREA DO PESADOR</p><h1>Olá, ${escapeHtml(state.profile.name.split(' ')[0])}.</h1><p>Você atua como prestador de serviço na pesagem e na contagem dos lotes negociados no GadOn. ${passed ? 'Seu treinamento está concluído.' : 'Conclua o treinamento para ser habilitado.'}</p><button type="button" class="primary-button" data-nav="Suporte">${passed ? 'Rever materiais' : 'Começar treinamento'} ${icon('arrow', 17)}</button></div><div class="weigher-status ${passed ? 'is-ready' : ''}">${icon(passed ? 'shield' : 'scale', 30)}<strong>${passed ? 'Pesador habilitado' : 'Treinamento pendente'}</strong><span>${passed ? `Aprovado em ${formatDateTime(state.weigherProgress.training.at)}` : 'Siga a ordem: aulas → conclusão → mini treinamento'}</span></div></section><section class="profile-card weigher-card"><div class="profile-card-heading"><div><p class="eyebrow">SEU PROGRESSO</p><h2>Treinamento obrigatório</h2></div></div>${weigherStepsTemplate()}</section><section class="weigher-warning">${icon('shield', 22)}<div><strong>Por que o treinamento é obrigatório?</strong><span>Se houver contagem errada das cabeças de gado, quem perde é o pesador. O pesador é uma parte essencial da segurança da plataforma.</span></div></section><section class="profile-card weigher-card"><div class="profile-card-heading"><div><p class="eyebrow">SERVIÇOS</p><h2>Pesagens e contagens</h2></div></div><div class="seller-products-empty"><span>${icon('scale', 28)}</span><strong>${passed ? 'Nenhum serviço agendado' : 'Disponível após a habilitação'}</strong><p>${passed ? 'Os serviços de pesagem aparecerão aqui quando forem atribuídos a você.' : 'Conclua o treinamento para receber serviços de pesagem.'}</p></div></section></div>`;
  return accountShellTemplate('Painel do pesador', content);
}

function weigherSupportTemplate() {
  const progress = state.weigherProgress;
  const lessons = weigherLessons.map((lesson, index) => { const watched = progress.watched.includes(lesson.id); return `<article class="weigher-lesson ${watched ? 'is-watched' : ''}"><div class="weigher-player">${icon('play', 30)}<span>Vídeo em produção</span></div><div class="weigher-lesson-body"><small>AULA ${index + 1}</small><strong>${escapeHtml(lesson.title)}</strong>${watched ? `<span class="weigher-badge">${icon('check', 14)} Assistida</span>` : `<button type="button" class="secondary-button" data-weigher-watch="${lesson.id}">Marcar como assistida</button>`}</div></article>`; }).join('');
  const conclude = progress.lessonsConcluded ? `<p class="weigher-concluded">${icon('check', 16)} Aulas concluídas. O mini treinamento está liberado.</p>` : `<div class="weigher-conclude"><span>${weigherAllWatched() ? 'Você assistiu a todas as aulas.' : 'Assista a todas as aulas para concluir.'}</span><button type="button" class="primary-button" data-weigher-action="conclude" ${weigherAllWatched() ? '' : 'disabled'}>Concluir aulas ${icon('check', 16)}</button></div>`;
  const answers = state.weigherAnswers;
  const quizResult = progress.training;
  const quiz = !progress.lessonsConcluded ? `<div class="weigher-locked">${icon('lock', 26)}<strong>Mini treinamento bloqueado</strong><span>Disponível depois de assistir e concluir todas as aulas.</span></div>` : quizResult?.passed ? `<div class="weigher-passed">${icon('shield', 26)}<strong>Mini treinamento aprovado</strong><span>Você acertou ${quizResult.score} de ${weigherQuiz.length} perguntas em ${formatDateTime(quizResult.at)}. Você está habilitado como pesador.</span></div>` : `<form id="weigher-quiz" class="weigher-quiz"><p class="weigher-sample-note">${icon('file', 14)} Perguntas de exemplo: o conteúdo final do treinamento será publicado aqui.</p>${weigherQuiz.map((item, index) => `<fieldset class="${quizResult?.wrong?.includes(item.id) ? 'is-wrong' : ''}"><legend>${index + 1}. ${escapeHtml(item.question)}</legend>${item.options.map((option, optionIndex) => `<label><input type="radio" name="${item.id}" value="${optionIndex}" ${Number(answers[item.id]) === optionIndex && answers[item.id] !== undefined ? 'checked' : ''} required /> <span>${escapeHtml(option)}</span></label>`).join('')}</fieldset>`).join('')}${quizResult && !quizResult.passed ? `<p class="weigher-retry">${icon('bell', 15)} Você acertou ${quizResult.score} de ${weigherQuiz.length}. Revise as perguntas marcadas e tente de novo.</p>` : ''}<button type="submit" class="primary-button">Enviar respostas ${icon('arrow', 16)}</button></form>`;
  const placeholder = (text) => `<div class="weigher-placeholder">${icon('file', 20)}<span>${text}</span></div>`;
  const faq = [['Como me torno um pesador habilitado?', 'Assista e conclua todas as aulas e depois faça o mini treinamento. A habilitação sai quando você acerta todas as perguntas.'], ['Por que o treinamento é obrigatório?', 'Se houver contagem errada das cabeças de gado, quem perde é o pesador. O treinamento garante a segurança da operação para todos.'], ['Onde encontro o documento do pesador?', 'Na seção "Documento do pesador", nesta página, assim que ele for publicado.']];
  const content = `<div class="weigher-page"><div class="profile-heading"><div><p class="eyebrow">SUPORTE DO PESADOR</p><h1>Suporte</h1><p>Aulas, dicas, passo a passo, documento do pesador e perguntas frequentes. Siga a ordem: aulas → conclusão → mini treinamento.</p></div></div><nav class="weigher-tabs" aria-label="Seções do suporte">${[['aulas', 'Aulas'], ['treinamento', 'Mini treinamento'], ['passo-a-passo', 'Passo a passo'], ['dicas', 'Dicas'], ['documento', 'Documento'], ['faq', 'FAQ']].map(([id, label]) => `<a href="#weigher-${id}">${label}</a>`).join('')}</nav><section class="profile-card weigher-card">${weigherStepsTemplate()}</section><section class="profile-card weigher-card" id="weigher-aulas"><div class="profile-card-heading"><div><p class="eyebrow">ETAPA 1 E 2</p><h2>Aulas</h2></div></div><div class="weigher-lessons">${lessons}</div>${conclude}</section><section class="profile-card weigher-card" id="weigher-treinamento"><div class="profile-card-heading"><div><p class="eyebrow">ETAPA 3</p><h2>Mini treinamento</h2></div></div>${quiz}</section><section class="profile-card weigher-card" id="weigher-passo-a-passo"><div class="profile-card-heading"><div><p class="eyebrow">GUIA</p><h2>Passo a passo</h2></div></div>${placeholder('O passo a passo do pesador será publicado aqui.')}</section><section class="profile-card weigher-card" id="weigher-dicas"><div class="profile-card-heading"><div><p class="eyebrow">BOAS PRÁTICAS</p><h2>Dicas</h2></div></div>${placeholder('As dicas para pesagem e contagem serão publicadas aqui.')}</section><section class="profile-card weigher-card" id="weigher-documento"><div class="profile-card-heading"><div><p class="eyebrow">DOCUMENTO</p><h2>Documento assinado do pesador</h2></div></div><div class="weigher-document">${icon('file', 24)}<div><strong>Termo do pesador</strong><span>Aguardando publicação do documento.</span></div><button type="button" class="secondary-button" disabled>Baixar documento</button></div></section><section class="profile-card weigher-card" id="weigher-faq"><div class="profile-card-heading"><div><p class="eyebrow">DÚVIDAS</p><h2>Perguntas frequentes</h2></div></div><div class="weigher-faq">${faq.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</div></section></div>`;
  return accountShellTemplate('Suporte', content);
}

function bindWeigherEvents() {
  bindShellEvents();
  const save = async (body) => { try { state.weigherProgress = (await apiRequest('/me/weigher', { method: 'PUT', body })).progress; render(); } catch (error) { showToast(error.message); } };
  document.querySelectorAll('[data-weigher-watch]').forEach((el) => el.addEventListener('click', () => save({ watched: [Number(el.dataset.weigherWatch)] })));
  document.querySelector('[data-weigher-action="conclude"]')?.addEventListener('click', async () => { if (!weigherAllWatched()) return; await save({ lessonsConcluded: true }); document.querySelector('#weigher-treinamento')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  document.querySelectorAll('.weigher-tabs a').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  document.querySelector('#weigher-quiz')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    state.weigherAnswers = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      state.weigherProgress = (await apiRequest('/me/weigher/training', { method: 'POST', body: { answers: state.weigherAnswers } })).progress;
      render();
      document.querySelector('#weigher-treinamento')?.scrollIntoView({ block: 'start' });
      if (state.weigherProgress.training?.passed) showToast('Mini treinamento aprovado. Você está habilitado como pesador.');
    } catch (error) { showToast(error.message); }
  });
}

function toggleFavorite(id) {
  const lotId = Number(id);
  const adding = !state.favorites.has(lotId);
  if (adding) state.favorites.add(lotId); else state.favorites.delete(lotId);
  render();
  apiRequest(`/me/favorites/${lotId}`, { method: adding ? 'PUT' : 'DELETE' }).catch((error) => { if (adding) state.favorites.delete(lotId); else state.favorites.add(lotId); render(); showToast(error.message); });
}

async function loadAdminData() {
  if (!state.isAdmin) return;
  const [stats, lotsPending, sellers, pre, freight] = await Promise.allSettled([apiRequest('/admin/stats'), apiRequest('/admin/lots?status=em_analise'), apiRequest('/admin/sellers?status=em_analise'), apiRequest('/admin/pre-cadastros'), apiRequest('/admin/freight-requests')]);
  if (stats.status === 'fulfilled') state.admin.stats = stats.value;
  if (lotsPending.status === 'fulfilled') state.admin.lots = lotsPending.value.lots.map((lot) => ({ ...toViewLot(lot), sellerName: lot.sellerName, sellerEmail: lot.sellerEmail }));
  if (sellers.status === 'fulfilled') state.admin.sellers = sellers.value.sellers;
  if (pre.status === 'fulfilled') state.admin.preRegistrations = pre.value.preRegistrations;
  if (freight.status === 'fulfilled') state.admin.freightRequests = freight.value.requests;
  state.admin.loaded = true;
}

function adminTemplate() {
  const { tab, stats } = state.admin;
  if (!state.isAdmin) return accountShellTemplate('Administração', '<div class="admin-page"><div class="empty-state">Acesso restrito à administração.</div></div>');
  const tabs = [['lots', 'Anúncios em análise', state.admin.lots.length], ['sellers', 'Vendedores em análise', state.admin.sellers.length], ['pre', 'Pré-cadastros', state.admin.preRegistrations.length], ['freight', 'Pedidos de frete', state.admin.freightRequests.filter((item) => item.status === 'novo').length]];
  const statCards = stats ? `<div class="admin-stats">${[['Contas', stats.users], ['Pré-cadastros', stats.preRegistrations], ['Anúncios publicados', stats.lotsPublished], ['Anúncios em análise', stats.lotsPending], ['Vendedores em análise', stats.sellersPending], ['Pedidos', stats.orders], ['Pedidos de frete novos', stats.freightRequests]].map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>` : '';
  let content = '';
  if (!state.admin.loaded) content = '<div class="empty-state">Carregando…</div>';
  else if (tab === 'lots') content = state.admin.lots.length ? state.admin.lots.map((lot) => `<article class="admin-row"><img src="${lot.image}" alt="" /><div class="admin-row-copy"><strong>${escapeHtml(lot.name)} · ${lot.heads} cabeças · ${lot.price}</strong><span>${escapeHtml(lot.breed)} · ${escapeHtml(lot.sex)} · ${escapeHtml(lot.place)} · ${escapeHtml(lot.seller)}</span><small>Vendedor: ${escapeHtml(lot.sellerName)} (${escapeHtml(lot.sellerEmail)})</small>${lot.description ? `<p>${escapeHtml(lot.description)}</p>` : ''}${lot.gallery.length > 1 ? `<div class="admin-thumbs">${lot.gallery.map((photo) => `<img src="${photo}" alt="" />`).join('')}</div>` : ''}</div><div class="admin-row-actions"><button type="button" class="primary-button" data-review-lot="${lot.id}" data-decision="aprovar">Aprovar</button><button type="button" class="secondary-button" data-review-lot="${lot.id}" data-decision="recusar">Pedir ajustes</button></div></article>`).join('') : '<div class="empty-state">Nenhum anúncio aguardando análise.</div>';
  else if (tab === 'sellers') content = state.admin.sellers.length ? state.admin.sellers.map((seller) => { const profile = seller.sellerProfile || {}; const docs = [...(profile.vaccinationDocuments || []), ...(profile.farmDocuments || [])]; return `<article class="admin-row"><div class="admin-row-copy"><strong>${escapeHtml(profile.producerName || seller.name)} · ${escapeHtml(profile.farmName || '')}</strong><span>${escapeHtml(profile.documentType || '')} ${escapeHtml(profile.documentNumber || '')} · ${escapeHtml(profile.municipality || '')}/${escapeHtml(profile.state || '')} · ${escapeHtml(profile.sanitaryStatus || '')}</span><small>${escapeHtml(profile.commercialEmail || seller.email)} · ${escapeHtml(profile.commercialPhone || seller.phone || 'sem telefone')}</small>${docs.length ? `<div class="admin-docs">${docs.map((doc) => `<button type="button" class="text-button" data-private-doc="${escapeHtml(doc.url)}" data-doc-name="${escapeHtml(doc.name)}">${icon('file', 14)} ${escapeHtml(doc.name)}</button>`).join('')}</div>` : '<small>Sem documentos anexados.</small>'}</div><div class="admin-row-actions"><button type="button" class="primary-button" data-review-seller="${seller.id}" data-decision="aprovar">Aprovar</button><button type="button" class="secondary-button" data-review-seller="${seller.id}" data-decision="recusar">Pedir ajustes</button></div></article>`; }).join('') : '<div class="empty-state">Nenhum vendedor aguardando análise.</div>';
  else if (tab === 'freight') content = state.admin.freightRequests.length ? `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Produtor</th><th>Rota</th><th>Carga</th><th>Telefone</th><th>Data</th><th>Status</th></tr></thead><tbody>${state.admin.freightRequests.map((row) => `<tr><td>${escapeHtml(row.name)}<small>${escapeHtml(row.email)}</small></td><td>${escapeHtml(row.route)}<small>${row.kind === 'volta' ? 'Volta vazia do Radar' : `Cotação${row.pickupDate ? ` · coleta ${formatDay(row.pickupDate)}` : ''}${row.price ? ` · ${formatBRL(row.price)}` : ''}`} · ${escapeHtml(row.carrier)}</small></td><td>${escapeHtml(row.cargoType)}${row.quantity ? `<small>${escapeHtml(row.quantity)}</small>` : ''}</td><td><a href="tel:${escapeHtml(row.phone.replace(/[^\d+]/g, ''))}">${escapeHtml(row.phone)}</a></td><td>${formatDay(row.createdAt)}</td><td><select data-freight-status="${row.id}" aria-label="Status do pedido">${[['novo', 'Novo'], ['contatado', 'Contatado'], ['fechado', 'Fechado'], ['cancelado', 'Cancelado']].map(([value, label]) => `<option value="${value}" ${row.status === value ? 'selected' : ''}>${label}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state">Nenhum pedido de frete ainda.</div>';
  else content = `<div class="admin-pre-head"><span>${state.admin.preRegistrations.length} pré-cadastros</span><button type="button" class="primary-button" data-action="export-pre">${icon('download', 16)} Exportar CSV</button></div>${state.admin.preRegistrations.length ? `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Nome</th><th>WhatsApp</th><th>E-mail</th><th>Cidade/UF</th><th>Perfis</th><th>Rebanho</th><th>Data</th></tr></thead><tbody>${state.admin.preRegistrations.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.phone)}</td><td>${escapeHtml(row.email)}</td><td>${escapeHtml([row.city, row.state].filter(Boolean).join('/'))}</td><td>${escapeHtml(row.profiles.join(', '))}</td><td>${escapeHtml(row.herd_size || '—')}</td><td>${formatDay(row.created_at)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state">Nenhum pré-cadastro ainda. Divulgue gadon.com.br/pre-cadastro.</div>'}`;
  return accountShellTemplate('Administração', `<div class="admin-page"><div class="profile-heading"><div><p class="eyebrow">ADMINISTRAÇÃO</p><h1>Painel de administração</h1><p>Aprove anúncios e vendedores e acompanhe os pré-cadastros.</p></div><button type="button" class="secondary-button" data-action="admin-refresh">${icon('repeat', 16)} Atualizar</button></div>${statCards}<nav class="admin-tabs">${tabs.map(([id, label, count]) => `<button type="button" class="${tab === id ? 'active' : ''}" data-admin-tab="${id}">${label} <b>${count}</b></button>`).join('')}</nav><div class="admin-list">${content}</div></div>`);
}

function bindAdminEvents() {
  bindShellEvents();
  const refresh = async () => { await loadAdminData(); render(); };
  document.querySelectorAll('[data-admin-tab]').forEach((el) => el.addEventListener('click', () => { state.admin.tab = el.dataset.adminTab; render(); }));
  document.querySelector('[data-action="admin-refresh"]')?.addEventListener('click', refresh);
  const review = async (path, decision) => {
    const note = decision === 'recusar' ? window.prompt('O que precisa ser ajustado? O vendedor verá esta mensagem.') : '';
    if (decision === 'recusar' && !note) return;
    try { await apiRequest(path, { method: 'POST', body: { decision, note } }); await refresh(); loadAppData(); showToast(decision === 'aprovar' ? 'Aprovado.' : 'Pedido de ajustes enviado.'); } catch (error) { showToast(error.message); }
  };
  document.querySelectorAll('[data-review-lot]').forEach((el) => el.addEventListener('click', () => review(`/admin/lots/${el.dataset.reviewLot}/review`, el.dataset.decision)));
  document.querySelectorAll('[data-review-seller]').forEach((el) => el.addEventListener('click', () => review(`/admin/sellers/${el.dataset.reviewSeller}/review`, el.dataset.decision)));
  const download = async (url, filename) => {
    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${loadSessionToken()}` } });
      if (!response.ok) throw new Error('Não foi possível baixar o arquivo.');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(await response.blob());
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } catch (error) { showToast(error.message); }
  };
  document.querySelectorAll('[data-private-doc]').forEach((el) => el.addEventListener('click', () => download(el.dataset.privateDoc, el.dataset.docName)));
  document.querySelectorAll('[data-freight-status]').forEach((el) => el.addEventListener('change', async () => {
    try { await apiRequest(`/admin/freight-requests/${el.dataset.freightStatus}`, { method: 'PATCH', body: { status: el.value } }); const row = state.admin.freightRequests.find((item) => item.id === Number(el.dataset.freightStatus)); if (row) row.status = el.value; showToast('Status atualizado.'); } catch (error) { showToast(error.message); }
  }));
  document.querySelector('[data-action="export-pre"]')?.addEventListener('click', () => download(`${API_URL}/admin/pre-cadastros?formato=csv`, 'pre-cadastros-gadon.csv'));
}

function bindLotEvents() {
  document.querySelectorAll('[data-favorite]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); toggleFavorite(el.dataset.favorite); }));
  document.querySelectorAll('[data-select-lot]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); const id = Number(el.dataset.selectLot); state.selectedLots.has(id) ? state.selectedLots.delete(id) : state.selectedLots.add(id); render(); }));
  document.querySelectorAll('[data-lot]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); openLotPage(el.dataset.lot); }));
  document.querySelectorAll('[data-action="reload-lots"]').forEach((el) => el.addEventListener('click', () => { state.lotsStatus = 'loading'; render(); loadAppData(); }));
}

function lotsGridMarkup(list, limit = list.length) {
  if (state.lotsStatus === 'loading' || state.lotsStatus === 'idle') return '<div class="empty-state lots-loading">Carregando lotes…</div>';
  if (state.lotsStatus === 'error') return `<div class="empty-state">Não foi possível carregar os lotes agora.<br><button type="button" class="secondary-button" data-action="reload-lots">Tentar de novo</button></div>`;
  return list.length ? list.slice(0, limit).map(lotCard).join('') : '<div class="empty-state">Nenhum lote encontrado. Tente outra busca.</div>';
}

function showToast(message) { state.toast = message; render(); setTimeout(() => { state.toast = ''; render(); }, 3200); }

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (button?.dataset.nav) { navigateTo(button.dataset.nav); return; }
  if ((state.accountMenuOpen || state.locationMenuOpen || state.notificationsOpen) && !event.target.closest('.account-menu-wrap, .location-wrap, .notification-wrap')) {
    Object.assign(state, { accountMenuOpen: false, locationMenuOpen: false, notificationsOpen: false });
    render();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (state.purchase && !state.purchase.paying) { state.purchase = null; render(); return; }
  if (state.accountMenuOpen || state.locationMenuOpen || state.notificationsOpen || state.mobileMenuOpen) {
    Object.assign(state, { accountMenuOpen: false, locationMenuOpen: false, notificationsOpen: false, mobileMenuOpen: false });
    render();
  }
});

applyTheme();
render();
refreshSession();

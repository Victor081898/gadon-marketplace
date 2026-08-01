import './styles.css';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

maplibregl.setWorkerUrl(maplibreWorkerUrl);

const lots = [
  { id: 1, name: 'Nelore selecionado', meta: '80 machos · 12@', weight: 12, price: 'R$ 28.000', unit: 'R$ 2.333,33 / cabeça', place: 'Campo Verde - MT', category: 'Nelore', sex: 'Machos', age: '18 a 24 meses', ageMonths: 21, purpose: 'Engorda', seller: 'Fazenda Santa Rita', image: '/home-hero-nelore.png', accent: 'blue' },
  { id: 2, name: 'Angus premium', meta: '50 fêmeas · 10@', weight: 10, price: 'R$ 23.500', unit: 'R$ 2.350,00 / cabeça', place: 'Dourados - MS', category: 'Angus', sex: 'Fêmeas', age: '20 a 28 meses', ageMonths: 24, purpose: 'Reprodução', seller: 'Agro Boa Vista', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=85', accent: 'orange' },
  { id: 3, name: 'Nelore matriz', meta: '120 matrizes · 15@', weight: 15, price: 'R$ 45.600', unit: 'R$ 2.280,00 / cabeça', place: 'Aparecida do Taboado - MS', category: 'Nelore', sex: 'Fêmeas', age: '24 a 36 meses', ageMonths: 30, purpose: 'Reprodução', seller: 'Fazenda JP', image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=900&q=85', accent: 'green' },
  { id: 4, name: 'Cruza industrial', meta: '60 machos · 10@', weight: 10, price: 'R$ 19.800', unit: 'R$ 1.980,00 / cabeça', place: 'Goiânia - GO', category: 'Cruza', sex: 'Machos', age: '16 a 22 meses', ageMonths: 19, purpose: 'Engorda', seller: 'Fazenda São Miguel', image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=900&q=85', accent: 'purple' },
  { id: 5, name: 'Bezerros Nelore', meta: '40 machos · 8@', weight: 8, price: 'R$ 11.000', unit: 'R$ 2.750,00 / cabeça', place: 'Rondonópolis - MT', category: 'Bezerros', sex: 'Machos', age: '8 a 12 meses', ageMonths: 10, purpose: 'Recria', seller: 'Fazenda Horizonte', image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=900&q=85', accent: 'blue' },
  { id: 6, name: 'Lote de reposição', meta: '30 fêmeas · 8@', weight: 8, price: 'R$ 6.900', unit: 'R$ 2.300,00 / cabeça', place: 'Campo Grande - MS', category: 'Outros', sex: 'Fêmeas', age: '12 a 18 meses', ageMonths: 15, purpose: 'Recria', seller: 'Estância Boa Água', image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=900&q=85', accent: 'orange' },
];

const SUPABASE_URL = 'https://fnpstspmhhphrbpycczm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucHN0c3BtaGhwaHJicHljY3ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDg2MzksImV4cCI6MjA5MDkyNDYzOX0.nANm27dc3x_vN8xw-z6OcyEX_zaCc-lVeh0UDJrAtns';
async function sendLead(source, { name = '', email = '', phone = '', details = {} } = {}) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/gadon_leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'return=minimal' },
      body: JSON.stringify({ source, name: name || 'Visitante GadOn', email, phone, details }),
    });
    return response.ok;
  } catch { return false; }
}

const auctionLots = [
  { id: 1, name: 'Nelore PO Elite', tag: 'LOTE 01', desc: '45 machos · 20@ média · Genética avaliada', place: 'Campo Verde - MT', seller: 'Fazenda Santa Rita', startBid: 92000, increment: 1000, image: '/home-hero-nelore.png',
    cameras: [{ type: 'video', src: '/videos/lote-nelore.mp4' }, { type: 'image', src: '/home-hero-nelore.png' }, { type: 'image', src: '/nelore-cadastro.png' }],
    ficha: { 'Raça': 'Nelore PO', 'Categoria': '45 machos', 'Peso médio': '20@ (≈600 kg)', 'Idade': '24 a 30 meses', 'Procedência': 'Fazenda Santa Rita · Campo Verde/MT', 'Vacinação': 'Em dia · aftosa e clostridiose', 'GTA': 'Emitida para o leilão', 'Regime': 'Pasto + suplementação mineral', 'Avaliação genética': 'Deca 1 · sumário ANCP' } },
  { id: 2, name: 'Matrizes Angus Prenhes', tag: 'LOTE 02', desc: '30 fêmeas prenhes · 16@ média · Prenhez confirmada', place: 'Dourados - MS', seller: 'Agro Boa Vista', startBid: 78000, increment: 1000, image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=85',
    cameras: [{ type: 'video', src: '/videos/lote-matrizes.mp4' }, { type: 'image', src: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=85' }, { type: 'image', src: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=85' }],
    ficha: { 'Raça': 'Angus', 'Categoria': '30 fêmeas prenhes', 'Peso médio': '16@ (≈480 kg)', 'Idade': '30 a 36 meses', 'Prenhez': 'Confirmada por ultrassom', 'Procedência': 'Agro Boa Vista · Dourados/MS', 'Vacinação': 'Em dia · aftosa e brucelose', 'GTA': 'Emitida para o leilão', 'Regime': 'Pasto rotacionado' } },
  { id: 3, name: 'Touro Nelore Reprodutor', tag: 'LOTE 03', desc: '1 touro PO · 32@ · Registro e avaliação genética', place: 'Rondonópolis - MT', seller: 'Fazenda Horizonte', startBid: 46000, increment: 500, image: '/nelore-cadastro.png',
    cameras: [{ type: 'video', src: '/videos/lote-touro.mp4' }, { type: 'image', src: '/nelore-cadastro.png' }, { type: 'image', src: '/home-hero-nelore.png' }],
    ficha: { 'Raça': 'Nelore PO', 'Categoria': 'Touro reprodutor', 'Peso': '32@ (≈960 kg)', 'Idade': '48 meses', 'Registro': 'RGD definitivo ABCZ', 'Procedência': 'Fazenda Horizonte · Rondonópolis/MT', 'Exame andrológico': 'Aprovado (últimos 60 dias)', 'Vacinação': 'Em dia', 'Avaliação genética': 'TOP 3% · sumário ANCP' } },
  { id: 4, name: 'Bezerros Desmama Premium', tag: 'LOTE 04', desc: '60 machos · 9@ média · Desmame recente', place: 'Goiânia - GO', seller: 'Fazenda São Miguel', startBid: 54000, increment: 500, image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=85',
    cameras: [{ type: 'video', src: '/videos/lote-bezerros.mp4' }, { type: 'image', src: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=85' }, { type: 'image', src: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=85' }],
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
const radarRoutes = [
  { id: 1, type: 'ida', origin: 'Campo Verde - MT', dest: 'Goiânia - GO', from: [-55.16, -15.55], to: [-49.25, -16.68], carrier: 'Transportadora Boiadeiro', cargo: '80 cabeças · Nelore', departs: 'Hoje · 06:20', status: 'Em trânsito', progress: 0.45 },
  { id: 2, type: 'ida', origin: 'Dourados - MS', dest: 'São Paulo - SP', from: [-54.81, -22.22], to: [-46.63, -23.55], carrier: 'AgroFrete Logística', cargo: '50 cabeças · Angus', departs: 'Hoje · 08:00', status: 'Em trânsito', progress: 0.2 },
  { id: 3, type: 'ida', origin: 'Rondonópolis - MT', dest: 'Campo Grande - MS', from: [-54.64, -16.47], to: [-54.65, -20.47], carrier: 'Boiadeiro Express', cargo: '40 bezerros', departs: 'Hoje · 07:30', status: 'Em trânsito', progress: 0.68 },
  { id: 4, type: 'volta', origin: 'Goiânia - GO', dest: 'Campo Grande - MS', from: [-49.25, -16.68], to: [-54.65, -20.47], carrier: 'Transportadora Boiadeiro', cargo: 'Espaço para 80 cabeças', departs: 'Hoje · 18:30', status: 'Volta disponível', price: 3850 },
  { id: 5, type: 'volta', origin: 'Cuiabá - MT', dest: 'Rondonópolis - MT', from: [-56.1, -15.6], to: [-54.64, -16.47], carrier: 'Rota Sul Transportes', cargo: 'Espaço para 12 toneladas', departs: 'Amanhã · 05:00', status: 'Volta disponível', price: 1450 },
  { id: 6, type: 'volta', origin: 'São Paulo - SP', dest: 'Dourados - MS', from: [-46.63, -23.55], to: [-54.81, -22.22], carrier: 'AgroFrete Logística', cargo: 'Espaço para 55 cabeças', departs: 'Amanhã · 09:30', status: 'Volta disponível', price: 4210 },
];
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
const formatBRL = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
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
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.home}</svg>`;
};

const auditStorageKey = 'gadon.audit-log.v1';
const loadAuditLog = () => { try { return JSON.parse(localStorage.getItem(auditStorageKey) || '[]'); } catch { return []; } };
const messageStorageKey = 'gadon.messages.v1';
const freightTripStorageKey = 'gadon.freight-trips.v1';
const freightDocumentStorageKey = 'gadon.freight-documents.v1';
const favoritesStorageKey = 'gadon.favorites.v1';
const historyStorageKey = 'gadon.lot-history.v1';
const profileStorageKey = 'gadon.profile.v1';
const sellerProfileStorageKey = 'gadon.seller-profile.v1';
const modeStorageKey = 'gadon.active-mode.v1';
const authStorageKey = 'gadon.auth.v1';
const themeStorageKey = 'gadon.theme.v1';
let audioRecorder = null;
let audioChunks = [];
let audioStream = null;
let audioTimer = null;
const defaultConversations = () => ([
  { id: 1, lotId: 1, name: 'Fazenda Santa Rita', initials: 'SR', role: 'Vendedor · Nelore selecionado', color: '#9a6045', online: true, unread: 2, updatedAt: '14:20', lastMessage: 'Podemos conversar sobre a retirada?', messages: [{ from: 'them', text: 'Olá João, o lote de 80 machos está disponível para retirada a partir da próxima semana.', time: '14:18' }, { from: 'me', text: 'Olá! Tenho interesse no lote. Podemos conversar sobre a retirada?', time: '14:20' }] },
  { id: 2, lotId: 2, name: 'Agro Boa Vista', initials: 'BV', role: 'Vendedor · Angus premium', color: '#c28b52', online: true, unread: 1, updatedAt: '13:15', lastMessage: 'Enviei as fotos atualizadas do lote.', messages: [{ from: 'them', text: 'Enviei as fotos atualizadas do lote.', time: '13:15' }] },
  { id: 3, lotId: 4, name: 'Fazenda São Miguel', initials: 'SM', role: 'Vendedor · Cruza industrial', color: '#677d91', online: false, unread: 0, updatedAt: 'Ontem', lastMessage: 'Obrigado pelo contato, João.', messages: [{ from: 'me', text: 'O lote está disponível para engorda?', time: 'Ontem' }, { from: 'them', text: 'Obrigado pelo contato, João.', time: 'Ontem' }] },
  { id: 4, lotId: 5, name: 'Transportadora Boiadeiro', initials: 'BT', role: 'Transportador parceiro', color: '#5f7e6d', online: true, unread: 0, updatedAt: '22 jul', lastMessage: 'A cotação de frete está pronta.', messages: [{ from: 'them', text: 'A cotação de frete está pronta.', time: '22 jul' }] },
]);
const loadMessages = () => { try { const parsed = JSON.parse(localStorage.getItem(messageStorageKey) || 'null'); return Array.isArray(parsed) && parsed.length ? parsed : defaultConversations(); } catch { return defaultConversations(); } };
const defaultFreightTrips = () => ([
  { id: 1, date: '2026-07-28', time: '06:20', origin: 'Campo Verde - MT', destination: 'Goiânia - GO', animals: '80', carrier: 'Transportadora Boiadeiro', status: 'Em andamento' },
  { id: 2, date: '2026-07-30', time: '08:00', origin: 'Dourados - MS', destination: 'São Paulo - SP', animals: '50', carrier: 'AgroFrete Logística', status: 'Programada' },
  { id: 3, date: '2026-08-02', time: '07:30', origin: 'Rondonópolis - MT', destination: 'Campo Grande - MS', animals: '40', carrier: 'Boiadeiro Express', status: 'Programada' },
]);
const loadFreightTrips = () => { try { const parsed = JSON.parse(localStorage.getItem(freightTripStorageKey) || 'null'); return Array.isArray(parsed) && parsed.length ? parsed : defaultFreightTrips(); } catch { return defaultFreightTrips(); } };
const defaultFreightRoutes = () => ([
  { id: 1, origin: 'Campo Verde - MT', destination: 'Goiânia - GO', distanceKm: 1065, price: 6480, carrier: 'Transportadora Boiadeiro', status: 'Em andamento', contractedAt: '28/07/2026' },
  { id: 2, origin: 'Dourados - MS', destination: 'São Paulo - SP', distanceKm: 1020, price: 6120, carrier: 'AgroFrete Logística', status: 'Programada', contractedAt: '30/07/2026' },
  { id: 3, origin: 'Rondonópolis - MT', destination: 'Cuiabá - MT', distanceKm: 215, price: 2150, carrier: 'Boiadeiro Express', status: 'Contratada', contractedAt: '02/08/2026' },
  { id: 4, origin: 'Rondonópolis - MT', destination: 'Campo Grande - MS', distanceKm: 560, price: 4360, carrier: 'Boiadeiro Express', status: 'Programada', contractedAt: '05/08/2026' },
]);
const loadFreightRoutes = () => { try { const parsed = JSON.parse(localStorage.getItem('gadon.freight.routes.v1') || 'null'); return Array.isArray(parsed) && parsed.length ? parsed : defaultFreightRoutes(); } catch { return defaultFreightRoutes(); } };
const defaultReturnLoads = () => ([
  { id: 1, region: 'Centro-Oeste', cargoType: 'Gado de corte', origin: 'Goiânia - GO', destination: 'Campo Grande - MS', carrier: 'Transportadora Boiadeiro', capacity: '80 cabeças', price: 3850, eta: 'Finaliza em 2h 30', availableAt: 'Hoje, 18:30', demand: 'Alta', x: 435, y: 165, lng: -49.25, lat: -16.68, destinationLng: -54.65, destinationLat: -20.47 },
  { id: 2, region: 'Sudeste', cargoType: 'Gado leiteiro', origin: 'Uberaba - MG', destination: 'Ribeirão Preto - SP', carrier: 'AgroFrete Logística', capacity: '42 cabeças', price: 2480, eta: 'Finaliza em 4h', availableAt: 'Hoje, 20:00', demand: 'Média', x: 508, y: 244, lng: -47.93, lat: -19.75, destinationLng: -47.81, destinationLat: -21.17 },
  { id: 3, region: 'Sul', cargoType: 'Bezerros', origin: 'Curitiba - PR', destination: 'Campo Grande - MS', carrier: 'Boiadeiro Express', capacity: '36 cabeças', price: 3160, eta: 'Finaliza em 6h', availableAt: 'Amanhã, 07:00', demand: 'Média', x: 435, y: 355, lng: -49.27, lat: -25.43, destinationLng: -54.65, destinationLat: -20.47 },
  { id: 4, region: 'Centro-Oeste', cargoType: 'Insumos agropecuários', origin: 'Rondonópolis - MT', destination: 'Dourados - MS', carrier: 'Rota Sul Transportes', capacity: '12 toneladas', price: 2740, eta: 'Finaliza em 1h 45', availableAt: 'Hoje, 17:45', demand: 'Alta', x: 355, y: 218, lng: -54.64, lat: -16.47, destinationLng: -54.81, destinationLat: -22.22 },
  { id: 5, region: 'Nordeste', cargoType: 'Gado de corte', origin: 'Barreiras - BA', destination: 'Goiânia - GO', carrier: 'Expresso Pecuário', capacity: '55 cabeças', price: 4210, eta: 'Finaliza em 8h', availableAt: 'Amanhã, 09:30', demand: 'Baixa', x: 365, y: 126, lng: -45.0, lat: -12.15, destinationLng: -49.25, destinationLat: -16.68 },
]);
const returnRegions = ['Todas', 'Centro-Oeste', 'Sudeste', 'Sul', 'Nordeste', 'Norte'];
const returnCargoTypes = ['Todos', 'Gado de corte', 'Gado leiteiro', 'Bezerros', 'Insumos agropecuários'];
const brazilMapPath = 'M158 17L158 36L122 42L104 61L76 62L77 91L63 98L59 118L16 120L2 137L7 156L0 170L40 170L61 164L85 173L92 188L140 205L162 200L182 212L211 211L227 224L259 232L261 264L279 265L272 294L297 320L311 343L292 371L311 383L349 391L337 407L365 424L356 434L362 451L392 410L396 427L419 432L427 415L450 407L461 384L486 382L486 361L513 353L513 334L540 324L540 304L563 292L572 269L596 257L596 233L607 208L626 197L621 181L646 174L639 158L621 140L585 133L565 120L527 115L513 103L484 102L463 90L427 95L412 80L383 80L369 71L338 74L313 64L277 68L257 52L230 54L225 38L200 37L193 16Z';
const brazilMapBoundaries = '<g class="map-boundaries"><path d="M122 42L158 36L193 16"/><path d="M104 61L158 36L175 82L140 111L112 154"/><path d="M175 82L213 80L250 91L250 123L221 150L211 211"/><path d="M225 38L230 54L257 52L277 68L250 91"/><path d="M277 68L313 64L338 74L338 108L320 132"/><path d="M338 74L369 71L383 80L390 110L365 129"/><path d="M383 80L412 80L427 95L463 90L484 102L470 126"/><path d="M484 102L513 103L527 115L565 120L585 133L563 147"/><path d="M565 120L621 140L607 160L626 174"/><path d="M16 137L61 164L85 173L112 154L140 169L162 200"/><path d="M250 123L320 132L345 168L330 200L280 208L259 232"/><path d="M320 132L365 129L390 161L427 175L407 211L385 245L350 260L279 265"/><path d="M390 161L470 126L500 160L540 171L520 208L563 220"/><path d="M500 160L563 147L607 160L596 194L572 214L596 233"/><path d="M407 211L430 244L420 278L385 300L350 293L297 320"/><path d="M420 278L486 255L540 270L513 294L540 304"/><path d="M350 293L385 300L407 325L450 340L486 361L461 384"/><path d="M297 320L311 343L337 346L365 370L392 382L386 410"/><path d="M311 383L349 391L337 407L365 424L356 434"/><path d="M392 382L427 367L461 384L450 407L427 415"/><path d="M486 361L513 334L540 324L563 292L572 269"/></g>';
const brazilMapCoordinates = [[-73.95, -7.4], [-70.4, -2.2], [-66.2, 0.5], [-60, 4.4], [-53, 4.2], [-48, 1.4], [-43, 2], [-38, -1.8], [-35, -5.8], [-34.5, -10.2], [-36.2, -13.4], [-35.8, -17.2], [-38.7, -20.6], [-37.5, -23.6], [-40.8, -25.7], [-44.6, -28.2], [-47.6, -32.4], [-51.8, -33.8], [-55.2, -32], [-58.2, -29.5], [-59.8, -25], [-62.8, -21.2], [-65.8, -17], [-69.5, -13.4], [-73.2, -11], [-75, -7.4], [-73.95, -7.4]];
const brazilRegionLines = [[[-62, 2], [-61, -7], [-57, -12]], [[-51, 4], [-51, -4], [-48, -10], [-45, -13]], [[-57, -12], [-55, -16], [-52, -20], [-48, -25]], [[-48, -1], [-48, -8], [-45, -13], [-43, -20]], [[-64, -19], [-60, -22], [-57, -25], [-55, -30]], [[-52, -20], [-49, -23], [-47, -28], [-48, -32]]];
const brazilMapStyle = { version: 8, sources: {}, layers: [{ id: 'return-map-background', type: 'background', paint: { 'background-color': '#f7f9fc' } }] };
const defaultFreightDocuments = () => ([
  { id: 1, type: 'GTA', name: 'GTA-MT-2026-00284', trip: 'VIA-1024 · Campo Verde → Goiânia', status: 'Emitido', statusClass: 'issued', fileName: 'GTA-MT-2026-00284.pdf', uploadedAt: '28/07/2026' },
  { id: 2, type: 'CT-e', name: 'CTE-45890', trip: 'VIA-1024 · Transportadora Boiadeiro', status: 'Emitido', statusClass: 'issued', fileName: 'CTE-45890.pdf', uploadedAt: '28/07/2026' },
  { id: 3, type: 'CDE', name: 'Comprovante de entrega', trip: 'VIA-1018 · Aguardando assinatura', status: 'Pendente', statusClass: 'pending', fileName: 'comprovante-entrega.pdf', uploadedAt: '27/07/2026' },
]);
const loadFreightDocuments = () => { try { const parsed = JSON.parse(localStorage.getItem(freightDocumentStorageKey) || 'null'); return Array.isArray(parsed) && parsed.length ? parsed : defaultFreightDocuments(); } catch { return defaultFreightDocuments(); } };
const loadFavorites = () => { try { const parsed = JSON.parse(localStorage.getItem(favoritesStorageKey) || '[]'); return new Set(Array.isArray(parsed) ? parsed.map(Number) : []); } catch { return new Set(); } };
const loadLotHistory = () => { try { const parsed = JSON.parse(localStorage.getItem(historyStorageKey) || '[]'); return Array.isArray(parsed) ? parsed.map(Number) : []; } catch { return []; } };
const defaultProfile = () => ({ name: 'João Pecuarista', email: 'joao@pecuarista.com.br', phone: '(65) 99999-1234', avatar: '', passwordChangedAt: null });
const loadProfile = () => { try { const parsed = JSON.parse(localStorage.getItem(profileStorageKey) || 'null'); return { ...defaultProfile(), ...(parsed && typeof parsed === 'object' ? parsed : {}) }; } catch { return defaultProfile(); } };
const defaultSellerProfile = () => ({ farmName: '', producerType: 'Produtor rural', documentType: 'CPF', documentNumber: '', stateRegistration: '', municipality: '', state: '', propertyRegistry: '', sanitaryStatus: '', sellerStatus: 'Não iniciado', cattlePhotos: [], vaccinationDocuments: [], farmDocuments: [], updatedAt: null });
const loadSellerProfile = () => { try { const parsed = JSON.parse(localStorage.getItem(sellerProfileStorageKey) || 'null'); return { ...defaultSellerProfile(), ...(parsed && typeof parsed === 'object' ? parsed : {}) }; } catch { return defaultSellerProfile(); } };
const loadMode = () => { try { return localStorage.getItem(modeStorageKey) === 'seller' ? 'seller' : 'buyer'; } catch { return 'buyer'; } };
const loadAuth = () => { try { return localStorage.getItem(authStorageKey) === 'true'; } catch { return false; } };
const saveAuth = (authenticated) => { try { localStorage.setItem(authStorageKey, authenticated ? 'true' : 'false'); } catch { /* sessão local indisponível */ } };
const loadDarkMode = () => { try { return localStorage.getItem(themeStorageKey) === 'dark'; } catch { return false; } };
const saveDarkMode = (enabled) => { try { localStorage.setItem(themeStorageKey, enabled ? 'dark' : 'light'); } catch { /* preferência local indisponível */ } };
const toggleTheme = (keepMobileMenuOpen = false) => { state.darkMode = !state.darkMode; saveDarkMode(state.darkMode); if (keepMobileMenuOpen) state.mobileMenuOpen = true; applyTheme(); render(); };
const notificationStorageKey = 'gadon.notifications.v1';
const defaultNotifications = () => ([
  { id: 1, type: 'message', title: 'Nova mensagem', source: 'Fazenda Santa Rita', body: 'Você recebeu uma nova mensagem sobre o lote Nelore selecionado.', time: '14:20', unread: true },
  { id: 2, type: 'truck', title: 'Cotação recebida', source: 'Transportadora Boiadeiro', body: 'Nova cotação para Campo Verde - MT → Goiânia - GO.', time: '13:45', unread: true },
  { id: 3, type: 'calendar', title: 'Frete programado', source: 'VIA-1024', body: 'Sua viagem está confirmada para 28 jul.', time: '12:10', unread: false },
  { id: 4, type: 'file', title: 'Documento pendente', source: 'Comprovante de entrega', body: 'O CDE da VIA-1018 aguarda assinatura.', time: 'Ontem', unread: false },
]);
const loadNotifications = () => { try { const parsed = JSON.parse(localStorage.getItem(notificationStorageKey) || 'null'); return Array.isArray(parsed) ? parsed : defaultNotifications(); } catch { return defaultNotifications(); } };
const defaultAdvancedFilters = () => ({ region: 'Todos', sex: 'Todos', farm: 'Todos', location: 'Todos', purpose: 'Todos', minWeight: '', maxWeight: '', minAge: '', maxAge: '' });
const initialAuthenticated = loadAuth();
const state = { activeNav: 'Início', query: '', category: 'Todos', collectionView: 'all', mode: loadMode(), favorites: loadFavorites(), selectedLots: new Set(), filterOpen: false, advancedFilters: defaultAdvancedFilters(), sort: 'relevance', lotHistory: loadLotHistory(), profile: loadProfile(), sellerProfile: loadSellerProfile(), authenticated: initialAuthenticated, darkMode: loadDarkMode(), authError: '', modalLot: null, modalTab: 'description', modalMediaIndex: 0, freightSimulationOpen: false, freightSimulationLots: [], freightOrigin: '', freightDestination: '', freightEstimate: null, toast: '', page: initialAuthenticated && loadMode() === 'seller' ? 'sellerMarketplace' : initialAuthenticated ? 'home' : 'login', auditLog: loadAuditLog(), messages: loadMessages(), activeConversationId: 1, messageQuery: '', recording: false, freightTrips: loadFreightTrips(), freightRoutes: loadFreightRoutes(), returnLoads: defaultReturnLoads(), returnRegion: 'Todas', returnCargoType: 'Todos', returnRoutesEnabled: true, returnRegionsEnabled: true, returnSelectedLoad: 1, returnPopupLoad: null, freightCalendarOpen: false, freightDocuments: loadFreightDocuments(), freightDocumentsOpen: false, freightDocumentsFullOpen: false, freightRoutesOpen: false, freightDocumentsView: 'all', calendarYear: 2026, calendarMonth: 6, notifications: loadNotifications(), notificationsOpen: false };
let returnMapInstance = null;
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
  userLocation: null, userLocationDemo: false, radarSelected: null, radarAlertShown: false,
  broadcastOpen: false, userAuctionLot: null,
  shopQuery: '', userProducts: loadUserProducts(), sellOpen: false, checkoutStep: 1, checkoutData: {}, lastOrderId: '', myStoreEditing: null,
});

function saveMessages() {
  try { localStorage.setItem(messageStorageKey, JSON.stringify(state.messages)); } catch { /* armazenamento local indisponível */ }
}

function saveFreightTrips() {
  try { localStorage.setItem(freightTripStorageKey, JSON.stringify(state.freightTrips)); } catch { /* armazenamento local indisponível */ }
}

function saveFreightDocuments() {
  try { localStorage.setItem(freightDocumentStorageKey, JSON.stringify(state.freightDocuments)); } catch { /* armazenamento local indisponível */ }
}

function saveFavorites() {
  try { localStorage.setItem(favoritesStorageKey, JSON.stringify([...state.favorites])); } catch { /* armazenamento local indisponível */ }
}

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
  state.mode = mode === 'seller' ? 'seller' : 'buyer';
  state.mobileMenuOpen = false;
  state.modalLot = null;
  state.selectedLots.clear();
  state.activeNav = state.mode === 'seller' ? 'Painel vendedor' : 'Início';
  if (state.mode === 'seller') {
    syncSellerIdentity();
    saveSellerProfile();
    state.page = 'sellerMarketplace';
  } else {
    state.page = 'home';
  }
  saveMode();
  render();
}

function saveLotHistory() {
  try { localStorage.setItem(historyStorageKey, JSON.stringify(state.lotHistory)); } catch { /* armazenamento local indisponível */ }
}

function saveNotifications() {
  try { localStorage.setItem(notificationStorageKey, JSON.stringify(state.notifications)); } catch { /* armazenamento local indisponível */ }
}

function getNotificationCount() {
  return state.notifications.filter((notification) => notification.unread).length;
}

function notificationPopover() {
  const unread = getNotificationCount();
  return state.notificationsOpen ? `<div class="notification-popover" role="dialog" aria-label="Notificações"><div class="notification-popover-head"><div><strong>Notificações</strong><span>${unread ? `${unread} não lidas` : 'Tudo em dia'}</span></div>${unread ? '<button type="button" data-notification-action="read-all">Marcar como lidas</button>' : ''}</div><div class="notification-list">${state.notifications.length ? state.notifications.map((notification) => `<button type="button" class="notification-item ${notification.unread ? 'unread' : ''}" data-notification-id="${notification.id}"><span class="notification-icon ${notification.type}">${icon(notification.type, 17)}</span><span class="notification-copy"><strong>${escapeHtml(notification.title)}</strong><small>${escapeHtml(notification.source)} · ${escapeHtml(notification.time)}</small><p>${escapeHtml(notification.body)}</p></span>${notification.unread ? '<i class="notification-dot"></i>' : ''}</button>`).join('') : '<div class="notification-empty">Nenhuma notificação por aqui.</div>'}</div></div>` : '';
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

function saveAuditLog(record) {
  state.auditLog = [record, ...state.auditLog].slice(0, 50);
  try { localStorage.setItem(auditStorageKey, JSON.stringify(state.auditLog)); } catch { /* armazenamento local indisponível */ }
}

function formatAuditDate(value) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

function createRegistrationLog(data) {
  const now = new Date();
  return {
    id: `GDN-${now.getFullYear()}-${String(Date.now()).slice(-6)}`,
    event: 'LOTE_HABILITADO',
    status: 'EM_VERIFICACAO',
    createdAt: now.toISOString(),
    actor: 'João Pecuarista',
    lot: {
      name: data.lotName || 'Lote sem nome',
      species: data.species || '',
      purpose: data.purpose || '',
      breed: data.breed || '',
      quantity: data.quantity || '',
      origin: [data.city, data.state].filter(Boolean).join(' - '),
      price: data.price || ''
    },
    steps: [
      { label: 'Cadastro preenchido', status: 'completed', at: now.toISOString() },
      { label: 'Enviado para verificação', status: 'completed', at: now.toISOString() },
      { label: 'Análise de documentos', status: 'current', at: null },
      { label: 'Publicação no marketplace', status: 'pending', at: null }
    ]
  };
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

function legacyFilterDrawerTemplate() {
  const regions = ['Todos', ...new Set(lots.map((lot) => lot.place.split(' - ').pop()))];
  return `<div class="filter-backdrop" data-filter-action="close"><section class="filter-drawer" role="dialog" aria-modal="true" aria-label="Filtros de lotes"><div class="filter-drawer-head"><div><p class="eyebrow">BUSCA INTELIGENTE</p><h2>Filtre os lotes</h2><p>Encontre exatamente o gado que procura.</p></div><button type="button" class="modal-close" data-filter-action="close">${icon('close', 18)}</button></div><form id="advanced-filters"><label><span>Região</span><select name="region">${regions.map((item) => `<option value="${item}" ${state.advancedFilters.region === item ? 'selected' : ''}>${item === 'Todos' ? 'Todas as regiões' : item}</option>`).join('')}</select></label><div class="filter-fields"><label><span>Peso mínimo (@)</span><input name="minWeight" type="number" min="0" step="1" value="${state.advancedFilters.minWeight}" placeholder="Ex.: 8" /></label><label><span>Peso máximo (@)</span><input name="maxWeight" type="number" min="0" step="1" value="${state.advancedFilters.maxWeight}" placeholder="Ex.: 18" /></label></div><div class="filter-drawer-actions"><button type="button" class="secondary-button" data-filter-action="reset">Limpar filtros</button><button type="submit" class="primary-button">Aplicar filtros ${icon('arrow', 15)}</button></div></form></section></div>`;
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
  const unread = state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
  return `<div class="app-shell search-shell"><aside class="sidebar"><div class="brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></div><div class="profile-mini"><div class="avatar">JP</div><div><strong>João Pecuarista</strong><span>Comprador verificado</span></div><button class="icon-button">${icon('chevron', 15)}</button></div><nav class="main-nav"><p class="nav-label">MENU PRINCIPAL</p>${['Início', 'Buscar gado', 'Leilão ao vivo', 'Loja rural', 'Radar de fretes', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'].map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(['home','search','gavel','store','route','cow','message','truck','repeat'][i])}<span>${item}</span>${item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}</button>`).join('')}<p class="nav-label nav-spacer">CONTA</p><button class="nav-item">${icon('heart')}<span>Favoritos</span>${state.favorites.size ? `<b>${state.favorites.size}</b>` : ''}</button><button class="nav-item">${icon('user')}<span>Meu perfil</span></button></nav><div class="sidebar-bottom"><div class="help-card"><div class="help-icon">?</div><div><strong>Precisa de ajuda?</strong><span>Fale com nosso suporte</span></div>${icon('chevron', 15)}</div><div class="sidebar-foot">GadOn <span>•</span> versão 1.0 MVP</div></div></aside><main class="main-content"><header class="topbar"><button class="mobile-menu icon-button">${icon('menu', 21)}</button><div class="crumb">Marketplace <span>/</span> Buscar gado</div><div class="top-actions"><button class="announce-button" data-action="register">${icon('plus', 15)} Habilitar lote</button><div class="notification-wrap"><button class="circle-action" data-action="notifications" aria-label="Abrir notificações">${icon('bell', 18)}${getNotificationCount() ? '<i></i>' : ''}</button>${notificationPopover()}</div><div class="top-avatar">JP</div><button class="top-user">João Pecuarista <span>⌄</span></button></div></header><div class="search-page ${!state.query.trim() && state.category === 'Todos' && activeFilterCount() === 0 ? 'search-page-empty' : ''}"><div class="search-page-heading"><div><p class="eyebrow">PESQUISA DE GADO</p><h1>Encontre a raça ideal para sua compra.</h1><p>Pesquise pelo nome da raça, veja os lotes disponíveis e selecione os animais para iniciar uma negociação.</p></div><span class="search-result-pill">${results.length} ${results.length === 1 ? 'lote encontrado' : 'lotes encontrados'}</span></div><section class="breed-search-panel"><div class="search-empty-hero">${icon('search', 48)}<p class="eyebrow">BUSCAR GADO</p><h2>Qual raça você procura?</h2><p>Digite o nome de uma raça para começar a pesquisa.</p></div><form id="breed-search-form" class="breed-search-form"><div class="breed-search-input">${icon('search', 19)}<input id="breed-search" value="${escapeHtml(state.query)}" placeholder="Digite o nome da raça: Nelore, Angus..." autocomplete="off" /><button type="button" data-action="search-clear" aria-label="Limpar pesquisa">${icon('close', 15)}</button></div><button type="submit" class="primary-button">Buscar gado ${icon('arrow', 15)}</button></form><div class="search-suggestions"><span>Raças populares</span>${breeds.map((breed) => `<button type="button" class="breed-chip ${state.category === breed && !state.query ? 'selected' : ''}" data-search-category="${escapeHtml(breed)}">${escapeHtml(breed)} <small>${lots.filter((lot) => lot.category === breed).length}</small></button>`).join('')}</div></section><div class="search-results-heading"><div><p class="eyebrow">CATÁLOGO DISPONÍVEL</p><h2>${state.query ? `Resultados para “${escapeHtml(state.query)}”` : 'Todos os lotes'}</h2></div><div class="search-results-actions"><button class="filter-button" data-action="filters">${icon('filter', 16)} Filtros <span>${activeFilterCount()}</span></button><select class="sort-select" id="lot-sort" aria-label="Ordenar resultados"><option value="relevance" ${state.sort === 'relevance' ? 'selected' : ''}>Mais relevantes</option><option value="recent" ${state.sort === 'recent' ? 'selected' : ''}>Mais recentes</option><option value="price-low" ${state.sort === 'price-low' ? 'selected' : ''}>Menor preço</option><option value="weight-high" ${state.sort === 'weight-high' ? 'selected' : ''}>Maior peso</option></select></div></div><div class="lots-grid search-results-grid">${results.length ? results.map(lotCard).join('') : `<div class="empty-state search-empty-state">Nenhum lote encontrado para essa pesquisa.<br><button type="button" class="secondary-button" data-action="search-clear">Limpar pesquisa</button></div>`}</div></div></main></div>${selectionBarTemplate()}${state.modalLot ? marketplaceModalTemplate(state.modalLot) : ''}${state.filterOpen ? filterDrawerTemplate() : ''}${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}`;
}

function getUserAnnouncements() {
  return state.auditLog.filter((record) => record.event === 'LOTE_HABILITADO' && record.lot).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function announcementsTemplate() {
  const announcements = getUserAnnouncements();
  if (!announcements.length) return accountShellTemplate(null, 'Meus anúncios', `<div class="announcements-empty-page"><div class="announcements-empty-content"><div class="announcements-empty-bag">${icon('bag', 46)}</div><h1>Nenhum Produto cadastrado!</h1></div></div>`);
  return accountShellTemplate(null, 'Meus anúncios', `<div class="announcements-page"><div class="announcements-heading"><div><p class="eyebrow">MEUS ANÚNCIOS</p><h1>Produtos cadastrados</h1><p>Acompanhe os lotes que você enviou para análise e publicação no GadOn.</p></div><span class="announcements-count">${announcements.length} ${announcements.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}</span></div><div class="announcements-grid">${announcements.map((record) => { const lot = record.lot; const status = record.status === 'EM_VERIFICACAO' ? 'Em verificação' : record.status || 'Registrado'; const origin = lot.origin || 'Origem não informada'; return `<article class="announcement-card"><div class="announcement-card-head"><span class="announcement-icon">${icon('bag', 20)}</span><span class="announcement-status">${escapeHtml(status)}</span></div><h2>${escapeHtml(lot.name || 'Lote sem nome')}</h2><p class="announcement-subtitle">${escapeHtml(lot.breed || 'Raça não informada')} · ${escapeHtml(lot.quantity ? `${lot.quantity} cabeças` : 'Quantidade não informada')}</p><div class="announcement-facts"><div><span>Origem</span><strong>${escapeHtml(origin)}</strong></div><div><span>Finalidade</span><strong>${escapeHtml(lot.purpose || 'Não informada')}</strong></div><div><span>Preço total</span><strong>${escapeHtml(lot.price || 'A definir')}</strong></div></div><div class="announcement-card-foot"><small>${record.createdAt ? `Cadastrado em ${escapeHtml(new Intl.DateTimeFormat('pt-BR').format(new Date(record.createdAt)))}` : 'Cadastro registrado'}</small><button type="button" class="secondary-button" data-announcement-protocol="${escapeHtml(record.id || '')}">Ver registro</button></div></article>`; }).join('')}</div></div>`);
}

function sellerMarketplaceTemplate() {
  syncSellerIdentity();
  const products = getUserAnnouncements();
  const seller = state.sellerProfile;
  const profileReady = seller.sellerStatus === 'Em análise' || seller.sellerStatus === 'Aprovado';
  const statusLabel = seller.sellerStatus === 'Aprovado' ? 'Perfil verificado' : seller.sellerStatus === 'Em análise' ? 'Documentos em análise' : 'Complete seu cadastro';
  return accountShellTemplate('sellerMarketplace', 'Painel vendedor', `<div class="seller-marketplace-page"><section class="seller-marketplace-hero"><div><p class="eyebrow">MODO VENDEDOR</p><h1>Venda seu gado com confiança.</h1><p>Tenha em um só lugar as ferramentas essenciais para cadastrar animais, publicar anúncios e acompanhar suas oportunidades.</p><div class="seller-hero-actions"><button type="button" class="primary-button" data-seller-action="new-lot">Cadastrar gado ${icon('arrow', 15)}</button><button type="button" class="secondary-button" data-seller-action="profile">${profileReady ? 'Editar perfil vendedor' : 'Completar perfil vendedor'}</button></div></div><div class="seller-hero-status"><span class="seller-marketplace-icon">${icon('cow', 28)}</span><strong>${escapeHtml(statusLabel)}</strong><small>${escapeHtml(seller.producerName || state.profile.name)}</small><button type="button" class="mode-switch-button" data-profile-mode="buyer">${icon('repeat', 14)} Voltar ao comprador</button></div></section>${!profileReady ? `<section class="seller-onboarding-card"><span class="seller-onboarding-icon">${icon('shield', 22)}</span><div><p class="eyebrow">PRÓXIMO PASSO</p><h2>Finalize a verificação da sua conta vendedora.</h2><p>Os dados pessoais, e-mail e telefone do comprador já foram preenchidos para você. Falta confirmar documento, fazenda, sanidade e anexos.</p></div><button type="button" class="primary-button" data-seller-action="profile">Continuar cadastro ${icon('arrow', 15)}</button></section>` : ''}<section class="seller-tool-grid"><article class="seller-tool-card featured"><span class="seller-tool-icon orange">${icon('cow', 22)}</span><div><p class="eyebrow">CATÁLOGO</p><h2>Meus produtos</h2><strong>${products.length}</strong><small>lotes registrados</small></div><button type="button" class="secondary-button" data-seller-action="products">Ver produtos ${icon('arrow', 14)}</button></article><article class="seller-tool-card"><span class="seller-tool-icon blue">${icon('plus', 22)}</span><div><p class="eyebrow">PUBLICAÇÃO</p><h2>Anunciar gado</h2><small>Cadastre raça, quantidade, preço, fotos, vacinação e origem.</small></div><button type="button" class="primary-button" data-seller-action="new-lot">Novo anúncio ${icon('arrow', 14)}</button></article><article class="seller-tool-card"><span class="seller-tool-icon purple">${icon('chart', 22)}</span><div><p class="eyebrow">CRESCIMENTO</p><h2>Promoções</h2><small>Destaque seus lotes e acompanhe campanhas para aumentar o alcance.</small></div><button type="button" class="secondary-button" data-seller-action="promotions">Criar promoção ${icon('arrow', 14)}</button></article></section><section class="seller-products-panel"><div class="seller-panel-heading"><div><p class="eyebrow">SEUS ANÚNCIOS</p><h2>Produtos cadastrados</h2><p>O status de cada lote acompanha a análise documental do GadOn.</p></div><button type="button" class="text-button" data-seller-action="new-lot">Cadastrar outro lote ${icon('arrow', 14)}</button></div>${products.length ? `<div class="seller-products-list">${products.slice(0, 4).map((record) => `<article class="seller-product-row"><span class="seller-product-icon">${icon('bag', 18)}</span><div><strong>${escapeHtml(record.lot.name || 'Lote sem nome')}</strong><small>${escapeHtml(record.lot.breed || 'Raça não informada')} · ${escapeHtml(record.lot.quantity ? `${record.lot.quantity} cabeças` : 'Quantidade não informada')}</small></div><span class="announcement-status">${escapeHtml(record.status === 'EM_VERIFICACAO' ? 'Em verificação' : record.status || 'Registrado')}</span><button type="button" class="secondary-button" data-announcement-protocol="${escapeHtml(record.id || '')}">Ver registro</button></article>`).join('')}</div>` : `<div class="seller-products-empty"><span>${icon('bag', 28)}</span><strong>Nenhum produto cadastrado</strong><p>Seu primeiro anúncio aparecerá aqui depois do cadastro completo.</p><button type="button" class="primary-button" data-seller-action="new-lot">Cadastrar primeiro lote ${icon('arrow', 14)}</button></div>`}</section></div>`);
}

function bindSellerMarketplaceEvents() {
  bindAccountNavigation();
  const sellerReturnButton = document.querySelector('.seller-marketplace-hero [data-profile-mode="buyer"]');
  if (sellerReturnButton) sellerReturnButton.innerHTML = `${icon('repeat', 14)} Voltar ao perfil comprador`;
  document.querySelectorAll('[data-seller-action="new-lot"]').forEach((el) => el.addEventListener('click', () => { state.page = 'register'; state.activeNav = 'Anunciar gado'; state.toast = ''; render(); }));
  document.querySelectorAll('[data-seller-action="profile"]').forEach((el) => el.addEventListener('click', () => { syncSellerIdentity(); state.page = 'sellerProfile'; state.activeNav = 'Perfil vendedor'; render(); }));
  document.querySelectorAll('[data-seller-action="products"]').forEach((el) => el.addEventListener('click', () => { state.activeNav = 'Meus produtos'; showToast('Aqui você acompanha seus lotes cadastrados e os respectivos protocolos.'); }));
  document.querySelectorAll('[data-seller-action="promotions"]').forEach((el) => el.addEventListener('click', () => showToast('A campanha foi preparada. A publicação de promoções será conectada ao serviço de anúncios.')));
  document.querySelectorAll('[data-announcement-protocol]').forEach((el) => el.addEventListener('click', () => showToast(`Registro ${el.dataset.announcementProtocol || 'do anúncio'} disponível no diário de verificação.`)));
}

function bindAnnouncementsEvents() {
  bindAccountNavigation();
  document.querySelectorAll('[data-announcement-protocol]').forEach((el) => el.addEventListener('click', () => showToast(`Registro ${el.dataset.announcementProtocol || 'do anúncio'} disponível no diário de verificação.`)));
}

function authBrandTemplate() {
  return `<div class="auth-brand"><div class="auth-brand-logo"><img src="/gadon.jpeg" alt="Logo GadOn" /></div><p class="eyebrow">GADON · O MERCADO DO GADO</p><h1>Compra, venda e frete inteligente em um só lugar.</h1><p>Entre para acompanhar seus lotes, negociações, favoritos e operações de transporte.</p><div class="auth-brand-points"><span>${icon('shield', 15)} Ambiente de negociação protegido</span><span>${icon('cow', 15)} Marketplace especializado em gado</span><span>${icon('truck', 15)} Fretes parceiros para sua operação</span></div></div>`;
}

function registerReferenceDividerTemplate() {
  return `<div class="register-reference-divider" aria-hidden="true"><svg class="register-reference-divider-desktop-svg" viewBox="0 0 220 1000" preserveAspectRatio="none" focusable="false"><path d="M155 0 C65 70 0 130 25 205 C40 265 120 245 137 330 C152 407 70 452 67 570 C65 690 125 770 112 1000"></path></svg><svg class="register-reference-divider-mobile-svg" viewBox="0 0 400 280" preserveAspectRatio="none" focusable="false"><path class="register-reference-divider-mobile-mask" d="M0 34 C46 92 98 102 159 130 C228 162 286 232 400 208 V280 H0 Z"></path><path d="M0 34 C46 92 98 102 159 130 C228 162 286 232 400 208"></path></svg><div class="register-reference-cow-badge">${icon('cow', 30)}</div></div>`;
}

function welcomePopupTemplate() {
  return `<div class="welcome-overlay" data-welcome-overlay><div class="welcome-card" role="dialog" aria-modal="true" aria-label="Boas-vindas ao GadOn"><button type="button" class="welcome-close" data-welcome-action="close" aria-label="Fechar">${icon('close', 18)}</button><div class="welcome-art"><img class="welcome-logo" src="/gadon-logo-transparent.png" alt="GadOn — O mercado do Gado" /><span class="welcome-spark one"></span><span class="welcome-spark two"></span><span class="welcome-spark three"></span></div><p class="eyebrow">SEJA BEM-VINDO AO GADON</p><h2>O mercado do gado<br/>chegou<span>.</span></h2><p class="welcome-sub">Compra, venda, leilões ao vivo, loja rural e frete inteligente — tudo em uma única plataforma feita para o pecuarista.</p><ul class="welcome-perks"><li>${icon('gavel', 16)} Leilões ao vivo com lances em tempo real</li><li>${icon('mic', 16)} Cadastre seu gado falando — a plataforma preenche por você</li><li>${icon('store', 16)} Loja rural: rações, sementes, terras e equipamentos</li></ul><div class="welcome-actions"><button type="button" class="welcome-create" data-welcome-action="create">Criar minha conta ${icon('arrow', 17)}</button><button type="button" class="welcome-skip" data-welcome-action="close">Já tenho conta</button></div><small class="welcome-note">${icon('shield', 13)} Cadastro gratuito · lançamento oficial</small></div></div>`;
}

function loginReferenceTemplate() {
  const heroImage = '/nelore-cadastro.png';
  return `<div class="register-reference-shell"><main class="register-reference-card"><section class="register-reference-form-panel"><header class="register-reference-header"><div class="register-reference-brand"><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div><nav><button type="button" class="register-reference-nav active">Início</button><button type="button" class="register-reference-nav active">Entrar</button></nav></header><div class="register-reference-copy"><p>ACESSO SEGURO</p><h1>Entrar na sua conta<span>.</span></h1><span>Ainda não tem uma conta? <button type="button" data-auth-action="register">Criar nova conta</button></span></div>${state.authError ? `<div class="auth-error register-reference-error" role="alert">${icon('bell', 15)} ${escapeHtml(state.authError)}</div>` : ''}<form id="login-reference-form" class="register-reference-form"><div class="register-reference-fields"><label class="register-reference-full"><span>E-mail ou nome de usuário</span><div>${icon('user', 17)}<input name="identifier" type="text" autocomplete="username" placeholder="seu@email.com ou seu usuário" required /></div></label><label class="register-reference-full"><span>Senha</span><div class="register-reference-password">${icon('lock', 17)}<input id="reference-login-password" name="password" type="password" autocomplete="current-password" placeholder="••••••••" minlength="6" required /><button type="button" data-auth-action="toggle-login-password" aria-label="Mostrar senha">${icon('eye', 17)}</button></div></label></div><div class="register-reference-login-options"><label class="register-reference-terms"><input type="checkbox" /> <span>Lembrar de mim</span></label><button type="button" class="register-reference-forgot" data-auth-action="forgot">Esqueci minha senha</button></div><div class="register-reference-actions"><button type="button" class="google-button" data-auth-action="google"><span>G</span> Entrar com Google</button><button type="submit" class="register-reference-submit">Entrar ${icon('arrow', 17)}</button></div><div class="register-reference-security">${icon('shield', 19)} <span>Seus dados estão protegidos com segurança de ponta.</span></div></form></section><section class="register-reference-visual" style="--reference-cattle-image:url('${heroImage}')"><div class="register-reference-curve"></div><div class="register-reference-cow-badge">${icon('cow', 30)}</div><div class="register-reference-visual-logo"><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></section></main></div>`;
}

function loginTemplate() {
  return `<div class="auth-shell"><section class="auth-brand-panel">${authBrandTemplate()}</section><main class="auth-main"><div class="auth-card"><div class="auth-card-heading"><p class="eyebrow">BEM-VINDO AO GADON</p><h1>Entrar na sua conta</h1><p>Acesse seu painel para continuar sua operação.</p></div>${state.authError ? `<div class="auth-error" role="alert">${icon('bell', 15)} ${escapeHtml(state.authError)}</div>` : ''}<form id="login-form" class="auth-form"><label><span>E-mail ou nome de usuário</span><div class="auth-input">${icon('user', 17)}<input name="identifier" type="text" autocomplete="username" placeholder="seu@email.com ou seu usuário" required /></div></label><label><span>Senha</span><div class="auth-input">${icon('lock', 17)}<input name="password" type="password" autocomplete="current-password" placeholder="Digite sua senha" minlength="6" required /></div></label><div class="auth-form-options"><label class="auth-check"><input type="checkbox" /> <span>Lembrar de mim</span></label><button type="button" class="auth-link" data-auth-action="forgot">Esqueci minha senha</button></div><button type="submit" class="primary-button auth-submit">Entrar ${icon('arrow', 16)}</button></form><div class="auth-divider"><span>ou</span></div><button type="button" class="secondary-button auth-create-button" data-auth-action="register">Criar uma nova conta ${icon('plus', 15)}</button><small class="auth-demo-note">Protótipo local: use um e-mail ou nome de usuário e uma senha com pelo menos 6 caracteres.</small></div><p class="auth-footer">${icon('shield', 13)} Seus dados serão tratados conforme as regras de segurança da plataforma.</p></main></div>`;
}

function accountRegistrationTemplate() {
  return `<div class="auth-shell auth-register-shell"><section class="auth-brand-panel">${authBrandTemplate()}</section><main class="auth-main"><div class="auth-card auth-register-card"><button type="button" class="auth-back-link" data-auth-action="back-login">${icon('back', 15)} Voltar para o login</button><div class="auth-card-heading"><p class="eyebrow">PRIMEIRO ACESSO</p><h1>Criar uma nova conta</h1><p>Preencha seus dados para começar a usar o GadOn.</p></div>${state.authError ? `<div class="auth-error" role="alert">${icon('bell', 15)} ${escapeHtml(state.authError)}</div>` : ''}<form id="account-registration-form" class="auth-form"><div class="auth-form-grid"><label><span>Nome completo <b>*</b></span><div class="auth-input">${icon('user', 17)}<input name="name" autocomplete="name" placeholder="João Pecuarista" required maxlength="80" /></div></label><label><span>E-mail <b>*</b></span><div class="auth-input">${icon('mail', 17)}<input name="email" type="email" autocomplete="email" placeholder="seuemail@exemplo.com" required /></div></label><label><span>Número de celular</span><div class="auth-input">${icon('phone', 17)}<input name="phone" type="tel" autocomplete="tel" placeholder="(00) 00000-0000" /></div></label><label><span>Senha <b>*</b></span><div class="auth-input">${icon('lock', 17)}<input name="password" type="password" autocomplete="new-password" placeholder="Mínimo de 6 caracteres" minlength="6" required /></div></label><label class="auth-field-full"><span>Confirmar senha <b>*</b></span><div class="auth-input">${icon('lock', 17)}<input name="confirmation" type="password" autocomplete="new-password" placeholder="Digite a senha novamente" minlength="6" required /></div></label></div><label class="auth-check auth-terms"><input name="terms" type="checkbox" required /> <span>Li e concordo com os termos de uso e a política de privacidade do GadOn.</span></label><button type="submit" class="primary-button auth-submit">Criar conta ${icon('arrow', 16)}</button></form></div><p class="auth-footer">${icon('shield', 13)} O cadastro de conta é uma etapa separada do cadastro de lotes.</p></main></div>`;
}

function accountRegistrationReferenceTemplate() {
  const heroImage = '/nelore-cadastro.png';
  return `<div class="register-reference-shell"><main class="register-reference-card"><section class="register-reference-form-panel"><header class="register-reference-header"><div class="register-reference-brand"><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div><nav><button type="button" class="register-reference-nav active">Início</button><button type="button" class="register-reference-nav" data-auth-action="back-login">Entrar</button></nav></header><div class="register-reference-copy"><p>COMECE AGORA</p><h1>Criar nova conta<span>.</span></h1><span>Já tem uma conta? <button type="button" data-auth-action="back-login">Entrar</button></span></div>${state.authError ? `<div class="auth-error register-reference-error" role="alert">${icon('bell', 15)} ${escapeHtml(state.authError)}</div>` : ''}<form id="account-registration-reference-form" class="register-reference-form"><div class="register-reference-fields"><label><span>Nome</span><div>${icon('user', 17)}<input name="name" autocomplete="given-name" placeholder="Seu nome" required maxlength="60" /></div></label><label><span>Sobrenome</span><div>${icon('user', 17)}<input name="surname" autocomplete="family-name" placeholder="Seu sobrenome" required maxlength="80" /></div></label><label class="register-reference-full"><span>E-mail</span><div>${icon('mail', 17)}<input name="email" type="email" autocomplete="email" placeholder="seu@email.com" required /></div></label><label class="register-reference-full"><span>Celular / WhatsApp</span><div>${icon('phone', 17)}<input name="phone" type="tel" autocomplete="tel" placeholder="(00) 00000-0000" /></div></label><label class="register-reference-full"><span>Senha</span><div class="register-reference-password">${icon('lock', 17)}<input id="reference-password" name="password" type="password" autocomplete="new-password" placeholder="••••••••" minlength="6" required /><button type="button" data-auth-action="toggle-password" aria-label="Mostrar senha">${icon('eye', 17)}</button></div></label></div><div class="register-role-block"><p class="register-role-label">Como você quer usar o GadOn?</p><div class="register-role-options"><label class="register-role-option"><input type="radio" name="role" value="comprador" checked /><span>${icon('cart', 15)} Comprador</span></label><label class="register-role-option"><input type="radio" name="role" value="vendedor" /><span>${icon('cow', 15)} Vendedor</span></label><label class="register-role-option"><input type="radio" name="role" value="ambos" /><span>${icon('repeat', 15)} Os dois</span></label></div></div><label class="register-reference-terms"><input name="terms" type="checkbox" required /><span>Eu concordo com os <a href="#" data-auth-action="terms">Termos de Uso</a> e a <a href="#" data-auth-action="privacy">Política de Privacidade</a>.</span></label><div class="register-reference-actions"><button type="button" class="google-button" data-auth-action="google"><span>G</span> Criar com Google</button><button type="submit" class="register-reference-submit">Criar conta ${icon('arrow', 17)}</button></div><div class="register-reference-security">${icon('shield', 19)} <span>Seus dados estão protegidos com segurança de ponta.</span></div></form></section><section class="register-reference-visual" style="--reference-cattle-image:url('${heroImage}')"><div class="register-reference-curve"></div><div class="register-reference-cow-badge">${icon('cow', 30)}</div><div class="register-reference-visual-logo"><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></section></main></div>`;
}

function logout() {
  state.authenticated = false;
  state.authError = '';
  state.toast = '';
  state.page = 'login';
  state.notificationsOpen = false;
  saveAuth(false);
  render();
}

function bindLoginEvents() {
  document.querySelector('#login-reference-form, #login-form')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); const identifier = (data.identifier || data.email || '').trim(); const looksLikeEmail = identifier.includes('@'); const validEmail = !looksLikeEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier); if (!identifier || !validEmail || data.password.length < 6) { state.authError = 'Informe um e-mail ou nome de usuário válido e uma senha com pelo menos 6 caracteres.'; render(); return; } state.profile = looksLikeEmail ? { ...state.profile, email: identifier } : { ...state.profile, name: identifier }; saveProfile(); state.authenticated = true; state.authError = ''; state.page = 'home'; saveAuth(true); render(); });
  document.querySelectorAll('[data-auth-action="register"]').forEach((el) => el.addEventListener('click', () => { state.authError = ''; state.page = 'accountRegister'; render(); }));
  document.querySelector('[data-auth-action="forgot"]')?.addEventListener('click', () => { state.authError = 'A recuperação de senha será conectada ao serviço de autenticação.'; render(); });
  document.querySelector('[data-auth-action="toggle-login-password"]')?.addEventListener('click', (event) => { const input = document.querySelector('#reference-login-password'); if (!input) return; input.type = input.type === 'password' ? 'text' : 'password'; event.currentTarget.setAttribute('aria-label', input.type === 'password' ? 'Mostrar senha' : 'Ocultar senha'); });
  document.querySelector('[data-auth-action="google"]')?.addEventListener('click', () => { state.authError = 'O acesso com Google será conectado ao serviço de autenticação.'; render(); });
  document.querySelectorAll('[data-welcome-action]').forEach((el) => el.addEventListener('click', () => { const create = el.dataset.welcomeAction === 'create'; state.welcomeOpen = false; if (create) { state.authError = ''; state.page = 'accountRegister'; } render(); }));
  document.querySelector('[data-welcome-overlay]')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) { state.welcomeOpen = false; render(); } });
}

function bindAccountRegistrationEvents() {
  document.querySelectorAll('[data-auth-action="back-login"]').forEach((el) => el.addEventListener('click', () => { state.authError = ''; state.page = 'login'; render(); }));
  document.querySelector('#account-registration-reference-form')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); if (data.password.length < 6) { state.authError = 'A senha precisa ter pelo menos 6 caracteres.'; render(); return; } const fullName = `${data.name.trim()} ${data.surname.trim()}`.trim(); const role = data.role || 'comprador'; sendLead('cadastro-conta', { name: fullName, email: data.email.trim(), phone: (data.phone || '').trim(), details: { origem: 'criar-conta', perfil: role } }); state.profile = { ...state.profile, name: fullName, email: data.email.trim(), phone: (data.phone || '').trim(), role, avatar: '', passwordChangedAt: null }; saveProfile(); state.authenticated = true; state.authError = ''; saveAuth(true); if (role === 'vendedor') { state.mode = 'seller'; saveMode(); syncSellerIdentity(); saveSellerProfile(); state.page = 'sellerMarketplace'; state.activeNav = 'Painel vendedor'; } else { state.mode = 'buyer'; saveMode(); state.page = 'home'; state.activeNav = 'Início'; } render(); showToast(`Bem-vindo ao GadOn, ${data.name.trim()}! Conta de ${role === 'ambos' ? 'comprador e vendedor' : role} criada.`); });
  document.querySelector('[data-auth-action="toggle-password"]')?.addEventListener('click', (event) => { const input = document.querySelector('#reference-password'); if (!input) return; input.type = input.type === 'password' ? 'text' : 'password'; event.currentTarget.setAttribute('aria-label', input.type === 'password' ? 'Mostrar senha' : 'Ocultar senha'); });
  document.querySelector('[data-auth-action="google"]')?.addEventListener('click', () => { state.authError = 'A criação com Google será conectada ao serviço de autenticação.'; render(); });
  document.querySelectorAll('[data-auth-action="terms"],[data-auth-action="privacy"]').forEach((el) => el.addEventListener('click', (event) => event.preventDefault()));
}

function accountSidebarTemplate(activePage) {
  const unread = state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
  const isSeller = state.mode === 'seller';
  const navItems = isSeller ? ['Painel vendedor', 'Meus produtos', 'Anunciar gado', 'Promoções'] : ['Início', 'Buscar gado', 'Leilão ao vivo', 'Loja rural', 'Radar de fretes', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'];
  const navIcons = isSeller ? ['home', 'bag', 'cow', 'chart'] : ['home', 'search', 'gavel', 'store', 'route', 'cow', 'message', 'truck', 'repeat'];
  return `<aside class="sidebar"><div class="brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></div><button class="profile-mini profile-mini-button" data-account-page="${isSeller ? 'sellerProfile' : 'profile'}"><div class="avatar">${escapeHtml(state.profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase())}</div><div><strong>${escapeHtml(state.profile.name)}</strong><span>${isSeller ? 'Vendedor em preparação' : 'Comprador verificado'}</span></div><span class="icon-button">${icon('chevron', 15)}</span></button><nav class="main-nav"><p class="nav-label">${isSeller ? 'CENTRAL DE VENDAS' : 'MENU PRINCIPAL'}</p>${navItems.map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(navIcons[i])}<span>${item}</span>${!isSeller && item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}</button>`).join('')}<p class="nav-label nav-spacer">CONTA</p>${isSeller ? `<button class="nav-item ${activePage === 'sellerProfile' ? 'active' : ''}" data-account-page="sellerProfile">${icon('user')}<span>Perfil vendedor</span></button>` : `<button class="nav-item ${activePage === 'favorites' ? 'active' : ''}" data-account-page="favorites">${icon('heart')}<span>Favoritos</span>${state.favorites.size ? `<b>${state.favorites.size}</b>` : ''}</button><button class="nav-item ${activePage === 'profile' ? 'active' : ''}" data-account-page="profile">${icon('user')}<span>Meu perfil</span></button>`}</nav><div class="sidebar-bottom"><button type="button" class="mode-switch-button" data-profile-mode="${isSeller ? 'buyer' : 'seller'}">${icon('repeat', 15)} ${isSeller ? 'Trocar para comprador' : 'Ativar perfil vendedor'}</button><div class="help-card"><div class="help-icon">?</div><div><strong>Precisa de ajuda?</strong><span>Fale com nosso suporte</span></div>${icon('chevron', 15)}</div><div class="sidebar-foot">GadOn <span>•</span> versão 1.0 MVP</div></div></aside>`;
}

function accountTopbarTemplate(crumb) {
  const initials = state.profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const isSeller = state.mode === 'seller';
  return `<header class="topbar"><button class="mobile-menu icon-button">${icon('menu', 21)}</button><div class="crumb">Marketplace <span>/</span> ${escapeHtml(crumb)}</div><div class="top-actions"><button class="mode-switch-button top-mode-switch" data-profile-mode="${isSeller ? 'buyer' : 'seller'}">${icon('repeat', 14)} ${isSeller ? 'Perfil comprador' : 'Perfil vendedor'}</button><button class="announce-button" data-action="register">${icon('plus', 15)} ${isSeller ? 'Anunciar gado' : 'Habilitar lote'}</button><div class="notification-wrap"><button class="circle-action" data-action="notifications" aria-label="Abrir notificações">${icon('bell', 18)}${getNotificationCount() ? '<i></i>' : ''}</button>${notificationPopover()}</div><button class="top-avatar" data-account-page="${isSeller ? 'sellerProfile' : 'profile'}">${escapeHtml(initials)}</button><button class="top-user" data-account-page="${isSeller ? 'sellerProfile' : 'profile'}">${escapeHtml(state.profile.name)} <span>⌄</span></button></div></header>`;
}

function mobileMenuTemplate() {
  const initials = state.profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const isSeller = state.mode === 'seller';
  const navItems = isSeller ? ['Painel vendedor', 'Meus produtos', 'Anunciar gado', 'Promoções'] : ['Início', 'Buscar gado', 'Leilão ao vivo', 'Loja rural', 'Radar de fretes', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'];
  const navIcons = isSeller ? ['home', 'bag', 'cow', 'chart'] : ['home', 'search', 'gavel', 'store', 'route', 'cow', 'message', 'truck', 'repeat'];
  const unread = state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
  return `<div class="mobile-drawer-backdrop ${state.mobileMenuOpen ? 'is-open' : ''}" data-mobile-menu-close></div><aside class="mobile-drawer ${state.mobileMenuOpen ? 'is-open' : ''}" aria-label="Menu principal" aria-hidden="${state.mobileMenuOpen ? 'false' : 'true'}"><div class="mobile-drawer-head"><div><p class="eyebrow">NAVEGAÇÃO</p><h2>Menu GadOn</h2></div><button type="button" class="mobile-drawer-close" data-mobile-menu-close aria-label="Fechar menu">${icon('close', 19)}</button></div><button type="button" class="mobile-drawer-profile" data-account-page="${isSeller ? 'sellerProfile' : 'profile'}"><span class="mobile-drawer-avatar">${escapeHtml(initials || 'JP')}</span><span><strong>${escapeHtml(state.profile.name)}</strong><small>${isSeller ? 'Vendedor em preparação' : 'Comprador verificado'}</small></span>${icon('chevron', 16)}</button><nav class="mobile-drawer-nav"><p class="mobile-drawer-label">${isSeller ? 'CENTRAL DE VENDAS' : 'MENU PRINCIPAL'}</p>${navItems.map((item, i) => `<button type="button" class="mobile-drawer-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(navIcons[i], 18)}<span>${item}</span>${!isSeller && item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}</button>`).join('')}<p class="mobile-drawer-label">CONTA</p>${isSeller ? `<button type="button" class="mobile-drawer-item ${state.page === 'sellerProfile' ? 'active' : ''}" data-account-page="sellerProfile">${icon('user', 18)}<span>Perfil vendedor</span></button>` : `<button type="button" class="mobile-drawer-item ${state.page === 'favorites' ? 'active' : ''}" data-account-page="favorites">${icon('heart', 18)}<span>Favoritos</span>${state.favorites.size ? `<b>${state.favorites.size}</b>` : ''}</button><button type="button" class="mobile-drawer-item ${state.page === 'profile' ? 'active' : ''}" data-account-page="profile">${icon('user', 18)}<span>Meu perfil</span></button>`}<button type="button" class="mobile-drawer-item mode-switch-drawer" data-profile-mode="${isSeller ? 'buyer' : 'seller'}">${icon('repeat', 18)}<span>${isSeller ? 'Trocar para comprador' : 'Ativar perfil vendedor'}</span></button><p class="mobile-drawer-label">PREFERÊNCIAS</p><button type="button" class="mobile-drawer-item mobile-theme-action" data-action="mobile-theme">${icon(state.darkMode ? 'sun' : 'moon', 18)}<span>${state.darkMode ? 'Modo claro' : 'Modo escuro'}</span><i>${state.darkMode ? 'Ativo' : 'Inativo'}</i></button><button type="button" class="mobile-drawer-item mobile-logout-action" data-action="logout">${icon('logout', 18)}<span>Sair da conta</span></button></nav><p class="mobile-drawer-foot">GadOn <span>•</span> O mercado do Gado</p></aside>`;
}

function mountMobileMenu() {
  if (!state.authenticated) return;
  mountDesktopAccountTools();
  if (state.freightSimulationOpen) {
    document.querySelector('#app')?.insertAdjacentHTML('beforeend', freightSimulationModalTemplate());
    bindFreightSimulationEvents();
  }
  if (!document.querySelector('.mobile-menu')) return;
  document.querySelector('#app')?.insertAdjacentHTML('beforeend', mobileMenuTemplateV2());
  document.querySelectorAll('.mobile-menu').forEach((el) => el.addEventListener('click', () => { state.mobileMenuOpen = true; render(); }));
  document.querySelectorAll('[data-mobile-menu-close]').forEach((el) => el.addEventListener('click', () => { state.mobileMenuOpen = false; render(); }));
  document.querySelectorAll('.mobile-drawer [data-nav]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); const item = el.dataset.nav; state.activeNav = item; state.page = item === 'Mensagens' ? 'messages' : item === 'Fretes' ? 'freight' : item === 'Fretes de retorno' ? 'returnFreight' : item === 'Buscar gado' ? 'search' : item === 'Meus anúncios' ? 'announcements' : item === 'Meus produtos' || item === 'Painel vendedor' || item === 'Promoções' ? 'sellerMarketplace' : item === 'Anunciar gado' ? 'register' : 'home'; if (item === 'Buscar gado') { state.collectionView = 'all'; state.query = ''; state.category = 'Todos'; state.advancedFilters = defaultAdvancedFilters(); } state.mobileMenuOpen = false; render(); }));
  document.querySelectorAll('.mobile-drawer [data-account-page]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); const page = el.dataset.accountPage; if (page === 'sellerProfile') { state.mode = 'seller'; saveMode(); syncSellerIdentity(); saveSellerProfile(); state.activeNav = 'Perfil vendedor'; } else { state.activeNav = page === 'favorites' ? 'Favoritos' : 'Meu perfil'; state.collectionView = 'all'; } state.collectionView = 'all'; state.modalLot = null; state.mobileMenuOpen = false; state.page = page; render(); }));
  document.querySelectorAll('.mobile-drawer [data-profile-mode]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); switchProfileMode(el.dataset.profileMode); }));
  document.querySelectorAll('[data-action="mobile-theme"]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); toggleTheme(true); }));
  document.querySelectorAll('.mobile-drawer [data-action="logout"]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); logout(); }));
}

function accountSidebarTemplateV2(activePage) {
  const unread = state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
  const isSeller = state.mode === 'seller';
  const navItems = isSeller ? ['Painel vendedor', 'Meus produtos', 'Anunciar gado', 'Promoções'] : ['Início', 'Buscar gado', 'Leilão ao vivo', 'Loja rural', 'Radar de fretes', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'];
  const navIcons = isSeller ? ['home', 'bag', 'cow', 'chart'] : ['home', 'search', 'gavel', 'store', 'route', 'cow', 'message', 'truck', 'repeat'];
  const accountItems = isSeller
    ? `<button class="nav-item ${activePage === 'sellerProfile' ? 'active' : ''}" data-account-page="sellerProfile">${icon('user')}<span>Perfil vendedor</span></button>`
    : `<button class="nav-item ${activePage === 'favorites' ? 'active' : ''}" data-account-page="favorites">${icon('heart')}<span>Favoritos</span>${state.favorites.size ? `<b>${state.favorites.size}</b>` : ''}</button><button class="nav-item ${activePage === 'profile' ? 'active' : ''}" data-account-page="profile">${icon('user')}<span>Meu perfil</span></button><button class="nav-item ${activePage === 'sellerProfile' ? 'active' : ''}" data-account-page="sellerProfile">${icon('user')}<span>Perfil vendedor</span></button>`;
  return `<aside class="sidebar"><div class="brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></div><button class="profile-mini profile-mini-button" data-account-page="${isSeller ? 'sellerProfile' : 'profile'}"><div class="avatar">${escapeHtml(state.profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase())}</div><div><strong>${escapeHtml(state.profile.name)}</strong><span>${isSeller ? 'Vendedor em preparação' : 'Comprador verificado'}</span></div><span class="icon-button">${icon('chevron', 15)}</span></button><nav class="main-nav"><p class="nav-label">${isSeller ? 'CENTRAL DE VENDAS' : 'MENU PRINCIPAL'}</p>${navItems.map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(navIcons[i])}<span>${item}</span>${!isSeller && item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}</button>`).join('')}<p class="nav-label nav-spacer">CONTA</p>${accountItems}<button class="nav-item theme-nav-item" data-action="desktop-theme">${icon(state.darkMode ? 'sun' : 'moon')}<span>${state.darkMode ? 'Modo claro' : 'Modo escuro'}</span></button></nav><div class="sidebar-bottom"><div class="help-card"><div class="help-icon">?</div><div><strong>Precisa de ajuda?</strong><span>Fale com nosso suporte</span></div>${icon('chevron', 15)}</div><div class="sidebar-foot">GadOn <span>•</span> versão 1.0 MVP</div></div></aside>`;
}

function accountTopbarTemplateV2(crumb) {
  const initials = state.profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const isSeller = state.mode === 'seller';
  return `<header class="topbar"><button class="mobile-menu icon-button">${icon('menu', 21)}</button><div class="crumb">Marketplace <span>/</span> ${escapeHtml(crumb)}</div><div class="top-actions"><button class="announce-button" data-action="register">${icon('plus', 15)} ${isSeller ? 'Anunciar gado' : 'Habilitar lote'}</button><div class="notification-wrap"><button class="circle-action" data-action="notifications" aria-label="Abrir notificações">${icon('bell', 18)}${getNotificationCount() ? '<i></i>' : ''}</button>${notificationPopover()}</div><button class="top-avatar" data-account-page="${isSeller ? 'sellerProfile' : 'profile'}">${escapeHtml(initials)}</button><button class="top-user" data-account-page="${isSeller ? 'sellerProfile' : 'profile'}">${escapeHtml(state.profile.name)} <span>⌄</span></button></div></header>`;
}

function mobileMenuTemplateV2() {
  const initials = state.profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const isSeller = state.mode === 'seller';
  const navItems = isSeller ? ['Painel vendedor', 'Meus produtos', 'Anunciar gado', 'Promoções'] : ['Início', 'Buscar gado', 'Leilão ao vivo', 'Loja rural', 'Radar de fretes', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'];
  const navIcons = isSeller ? ['home', 'bag', 'cow', 'chart'] : ['home', 'search', 'gavel', 'store', 'route', 'cow', 'message', 'truck', 'repeat'];
  const unread = state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
  const accountItems = isSeller
    ? `<button type="button" class="mobile-drawer-item ${state.page === 'sellerProfile' ? 'active' : ''}" data-account-page="sellerProfile">${icon('user', 18)}<span>Perfil vendedor</span></button>`
    : `<button type="button" class="mobile-drawer-item ${state.page === 'favorites' ? 'active' : ''}" data-account-page="favorites">${icon('heart', 18)}<span>Favoritos</span>${state.favorites.size ? `<b>${state.favorites.size}</b>` : ''}</button><button type="button" class="mobile-drawer-item ${state.page === 'profile' ? 'active' : ''}" data-account-page="profile">${icon('user', 18)}<span>Meu perfil</span></button><button type="button" class="mobile-drawer-item ${state.page === 'sellerProfile' ? 'active' : ''}" data-account-page="sellerProfile">${icon('user', 18)}<span>Perfil vendedor</span></button>`;
  return `<div class="mobile-drawer-backdrop ${state.mobileMenuOpen ? 'is-open' : ''}" data-mobile-menu-close></div><aside class="mobile-drawer ${state.mobileMenuOpen ? 'is-open' : ''}" aria-label="Menu principal" aria-hidden="${state.mobileMenuOpen ? 'false' : 'true'}"><div class="mobile-drawer-head"><div><p class="eyebrow">NAVEGAÇÃO</p><h2>Menu GadOn</h2></div><button type="button" class="mobile-drawer-close" data-mobile-menu-close aria-label="Fechar menu">${icon('close', 19)}</button></div><button type="button" class="mobile-drawer-profile" data-account-page="${isSeller ? 'sellerProfile' : 'profile'}"><span class="mobile-drawer-avatar">${escapeHtml(initials || 'JP')}</span><span><strong>${escapeHtml(state.profile.name)}</strong><small>${isSeller ? 'Vendedor em preparação' : 'Comprador verificado'}</small></span>${icon('chevron', 16)}</button><nav class="mobile-drawer-nav"><p class="mobile-drawer-label">${isSeller ? 'CENTRAL DE VENDAS' : 'MENU PRINCIPAL'}</p>${navItems.map((item, i) => `<button type="button" class="mobile-drawer-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(navIcons[i], 18)}<span>${item}</span>${!isSeller && item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}</button>`).join('')}<p class="mobile-drawer-label">CONTA</p>${accountItems}<button type="button" class="mobile-drawer-item mobile-theme-action" data-action="mobile-theme">${icon(state.darkMode ? 'sun' : 'moon', 18)}<span>${state.darkMode ? 'Modo claro' : 'Modo escuro'}</span><i>${state.darkMode ? 'Ativo' : 'Inativo'}</i></button><button type="button" class="mobile-drawer-item mode-switch-drawer" data-profile-mode="${isSeller ? 'buyer' : 'seller'}">${icon('repeat', 18)}<span>${isSeller ? 'Voltar ao perfil comprador' : 'Ativar perfil vendedor'}</span></button><button type="button" class="mobile-drawer-item mobile-logout-action" data-action="logout">${icon('logout', 18)}<span>Sair da conta</span></button></nav><p class="mobile-drawer-foot">GadOn <span>•</span> O mercado do Gado</p></aside>`;
}

function mountDesktopAccountTools() {
  const nav = document.querySelector('.sidebar .main-nav');
  if (!nav) return;
  if (!nav.querySelector('[data-account-page="sellerProfile"]')) {
    nav.insertAdjacentHTML('beforeend', `<button class="nav-item injected-account-seller" data-account-page="sellerProfile">${icon('user')}<span>Perfil vendedor</span></button>`);
    nav.querySelector('.injected-account-seller')?.addEventListener('click', () => { state.mode = 'seller'; saveMode(); syncSellerIdentity(); saveSellerProfile(); state.activeNav = 'Perfil vendedor'; state.page = 'sellerProfile'; render(); });
  }
  if (!nav.querySelector('.theme-nav-item')) {
    nav.insertAdjacentHTML('beforeend', `<button class="nav-item theme-nav-item" data-action="desktop-theme">${icon(state.darkMode ? 'sun' : 'moon')}<span>${state.darkMode ? 'Modo claro' : 'Modo escuro'}</span></button>`);
    nav.querySelector('.theme-nav-item')?.addEventListener('click', () => toggleTheme());
  }
}

function accountShellTemplate(activePage, crumb, content) {
  return `<div class="app-shell account-shell">${accountSidebarTemplateV2(activePage)}<main class="main-content">${accountTopbarTemplateV2(crumb)}${content}</main></div><button type="button" class="account-logout-button" data-action="logout">${icon('logout', 15)} Sair da conta</button>${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}`;
}

function profileTemplate() {
  const profile = state.profile;
  const initials = profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const avatar = profile.avatar ? `<img src="${escapeHtml(profile.avatar)}" alt="Foto de perfil de ${escapeHtml(profile.name)}" />` : `<span>${escapeHtml(initials)}</span>`;
  return accountShellTemplate('profile', 'Meu perfil', `<div class="profile-page"><div class="profile-heading"><div><p class="eyebrow">CONTA E SEGURANÇA</p><h1>Meu perfil</h1><p>Atualize seus dados de contato e preferências de acesso ao GadOn.</p></div><span class="profile-status"><i></i> Conta verificada</span></div><div class="profile-layout"><section class="profile-card profile-identity-card"><div class="profile-avatar-panel"><div class="profile-avatar">${avatar}</div><label class="avatar-upload">${icon('camera', 15)} Alterar foto<input id="profile-avatar-file" type="file" accept="image/*" /></label><small>JPG ou PNG · até 2 MB</small></div><div class="profile-identity-copy"><p class="eyebrow">PERFIL DO USUÁRIO</p><h2>${escapeHtml(profile.name)}</h2><p>Comprador verificado no marketplace</p><div class="profile-trust"><span>${icon('shield', 14)} Perfil protegido</span><span>${icon('check', 14)} Dados atualizados</span></div></div></section><form id="profile-form" class="profile-card profile-form"><div class="profile-card-heading"><div><p class="eyebrow">DADOS DA CONTA</p><h2>Informações pessoais</h2></div><span class="profile-card-icon">${icon('user', 18)}</span></div><div class="profile-form-grid"><label><span>Nome de usuário <b>*</b></span><input name="name" value="${escapeHtml(profile.name)}" required maxlength="80" /></label><label><span>E-mail cadastrado <b>*</b></span><input name="email" type="email" value="${escapeHtml(profile.email)}" required /></label><label><span>Número de celular</span><input name="phone" type="tel" value="${escapeHtml(profile.phone)}" placeholder="(00) 00000-0000" /></label><label><span>Perfil</span><input value="Comprador verificado" disabled /></label></div><div class="profile-form-actions"><span>${icon('shield', 14)} Seus dados ficam salvos neste dispositivo.</span><button type="submit" class="primary-button">Salvar alterações ${icon('check', 15)}</button></div></form><section class="profile-card profile-security-card"><div class="profile-card-heading"><div><p class="eyebrow">ACESSO</p><h2>Segurança da conta</h2><p>Troque sua senha sempre que precisar reforçar a proteção.</p></div><span class="profile-card-icon">${icon('lock', 18)}</span></div><div class="password-status"><div class="password-status-icon">${icon('lock', 18)}</div><div><strong>Senha cadastrada</strong><span>•••••••••••• ${profile.passwordChangedAt ? `· atualizada em ${new Intl.DateTimeFormat('pt-BR').format(new Date(profile.passwordChangedAt))}` : '· protegida'}</span></div><button type="button" class="secondary-button" data-profile-action="toggle-password">Alterar senha</button></div><form id="password-form" class="password-form" hidden><label><span>Nova senha <b>*</b></span><input name="password" type="password" minlength="8" required placeholder="Mínimo de 8 caracteres" /></label><label><span>Confirmar nova senha <b>*</b></span><input name="confirmation" type="password" minlength="8" required placeholder="Repita a nova senha" /></label><div class="password-form-actions"><small>Por segurança, a senha não é armazenada em texto puro nesta demonstração.</small><button type="submit" class="primary-button">Atualizar senha ${icon('check', 15)}</button></div></form></section><section class="profile-card profile-preferences-card"><div><p class="eyebrow">PREFERÊNCIAS</p><h2>Como o GadOn pode ajudar</h2><p>Receba avisos sobre mensagens, favoritos e oportunidades de frete.</p></div><div class="preference-list"><label><input type="checkbox" checked /> <span><strong>Novas mensagens</strong><small>Alertar quando um vendedor responder.</small></span></label><label><input type="checkbox" checked /> <span><strong>Atualizações de favoritos</strong><small>Acompanhar alterações nos lotes salvos.</small></span></label><label><input type="checkbox" checked /> <span><strong>Oportunidades de frete</strong><small>Mostrar cargas compatíveis com suas rotas.</small></span></label></div></section></div></div>`);
}

function sellerProfileAccessTemplate() {
  const status = state.sellerProfile.sellerStatus === 'Em análise' ? 'Em análise' : 'Ainda não ativado';
  return `<section class="profile-card seller-access-card"><div class="seller-access-copy"><p class="eyebrow">VENDA NO GADON</p><h2>Ative seu perfil vendedor</h2><p>Cadastre sua fazenda, comprove a origem dos animais e publique lotes com mais confiança para os compradores.</p><div class="seller-access-points"><span>${icon('cow', 14)} Cadastro completo do gado</span><span>${icon('shield', 14)} Documentos e vacinação</span><span>${icon('file', 14)} Verificação da propriedade</span></div></div><div class="seller-access-action"><span class="seller-access-status"><i></i> ${status}</span><button type="button" class="primary-button" data-seller-action="open-profile">Abrir perfil vendedor ${icon('arrow', 15)}</button></div></section>`;
}

function sellerProfileTemplate() {
  syncSellerIdentity();
  const seller = state.sellerProfile;
  const status = seller.sellerStatus === 'Em análise' ? 'Cadastro em análise' : seller.sellerStatus === 'Aprovado' ? 'Perfil verificado' : 'Cadastro em preparação';
  const fileSummary = (files, empty) => files?.length ? files.map((file) => `<span>${icon('file', 12)} ${escapeHtml(file)}</span>`).join('') : `<small>${empty}</small>`;
  return accountShellTemplate('sellerProfile', 'Perfil vendedor', `<div class="seller-profile-page"><div class="seller-profile-heading"><div><p class="eyebrow">PERFIL COMERCIAL</p><h1>Perfil vendedor</h1><p>Organize sua identidade rural e deixe seus lotes prontos para uma negociação segura.</p></div><span class="seller-profile-status"><i></i> ${status}</span></div><div class="seller-mode-switch"><div><span class="seller-mode-icon">${icon('user', 19)}</span><div><strong>Você está no modo vendedor</strong><small>O comprador continua disponível no seu perfil pessoal.</small></div></div><button type="button" class="secondary-button" data-account-page="profile">Voltar ao perfil comprador</button></div><form id="seller-profile-form" class="seller-profile-form"><div class="seller-profile-grid"><section class="profile-card seller-card"><div class="profile-card-heading"><div><p class="eyebrow">IDENTIDADE DO VENDEDOR</p><h2>Dados do produtor</h2><p>Informe os dados que aparecerão na identificação comercial.</p></div><span class="profile-card-icon orange-profile-icon">${icon('user', 18)}</span></div><div class="seller-form-grid"><label><span>Nome do produtor / empresa <b>*</b></span><input name="producerName" value="${escapeHtml(seller.producerName || state.profile.name)}" required maxlength="100" /></label><label><span>Tipo de produtor <b>*</b></span><select name="producerType" required><option ${seller.producerType === 'Produtor rural' ? 'selected' : ''}>Produtor rural</option><option ${seller.producerType === 'Empresa rural' ? 'selected' : ''}>Empresa rural</option><option ${seller.producerType === 'Cooperativa' ? 'selected' : ''}>Cooperativa</option></select></label><label><span>Documento do responsável <b>*</b></span><select name="documentType"><option ${seller.documentType === 'CPF' ? 'selected' : ''}>CPF</option><option ${seller.documentType === 'CNPJ' ? 'selected' : ''}>CNPJ</option></select></label><label><span>Número do documento <b>*</b></span><input name="documentNumber" value="${escapeHtml(seller.documentNumber)}" placeholder="Informe o documento" required /></label><label><span>E-mail comercial <b>*</b></span><input name="commercialEmail" type="email" value="${escapeHtml(seller.commercialEmail || state.profile.email)}" required /></label><label><span>Telefone comercial</span><input name="commercialPhone" type="tel" value="${escapeHtml(seller.commercialPhone || state.profile.phone)}" placeholder="(00) 00000-0000" /></label></div></section><section class="profile-card seller-card"><div class="profile-card-heading"><div><p class="eyebrow">FAZENDA E ORIGEM</p><h2>Comprovação da propriedade</h2><p>Essas informações ajudam a validar a origem e a logística do lote.</p></div><span class="profile-card-icon">${icon('pin', 18)}</span></div><div class="seller-form-grid"><label class="seller-field-full"><span>Nome da fazenda / propriedade <b>*</b></span><input name="farmName" value="${escapeHtml(seller.farmName)}" placeholder="Ex.: Fazenda Santa Rita" required /></label><label><span>Município <b>*</b></span><input name="municipality" value="${escapeHtml(seller.municipality)}" placeholder="Campo Verde" required /></label><label><span>UF <b>*</b></span><select name="state" required><option value="">Selecione</option>${['MT','MS','GO','MG','SP','PR','BA','Outro estado'].map((uf) => `<option ${seller.state === uf ? 'selected' : ''}>${uf}</option>`).join('')}</select></label><label><span>Registro da propriedade</span><input name="propertyRegistry" value="${escapeHtml(seller.propertyRegistry)}" placeholder="CAR, CCIR ou registro estadual" /></label><label><span>Inscrição estadual rural</span><input name="stateRegistration" value="${escapeHtml(seller.stateRegistration)}" placeholder="Se aplicável" /></label></div><div class="seller-legal-note">${icon('shield', 15)} <span>Os documentos serão conferidos antes da publicação. Não inclua dados bancários nem documentos de terceiros.</span></div></section><section class="profile-card seller-card"><div class="profile-card-heading"><div><p class="eyebrow">SANIDADE ANIMAL</p><h2>Vacinação e rastreabilidade</h2><p>Registre o status sanitário e anexe comprovantes legíveis.</p></div><span class="profile-card-icon green-profile-icon">${icon('shield', 18)}</span></div><div class="seller-form-grid"><label><span>Situação das vacinações <b>*</b></span><select name="sanitaryStatus" required><option value="">Selecione</option><option ${seller.sanitaryStatus === 'Vacinações em dia' ? 'selected' : ''}>Vacinações em dia</option><option ${seller.sanitaryStatus === 'Em atualização' ? 'selected' : ''}>Em atualização</option><option ${seller.sanitaryStatus === 'A confirmar com veterinário' ? 'selected' : ''}>A confirmar com veterinário</option></select></label><label><span>Rastreabilidade</span><select name="traceability"><option value="">Selecione</option><option ${seller.traceability === 'Identificação individual' ? 'selected' : ''}>Identificação individual</option><option ${seller.traceability === 'SISBOV' ? 'selected' : ''}>SISBOV</option><option ${seller.traceability === 'Identificação da fazenda' ? 'selected' : ''}>Identificação da fazenda</option><option ${seller.traceability === 'Em processo' ? 'selected' : ''}>Em processo</option></select></label></div><div class="seller-upload-grid"><label class="seller-upload-box"><input type="file" name="vaccinationDocuments" data-seller-files="vaccinationDocuments" accept=".pdf,image/*" multiple /><span class="seller-upload-icon">${icon('upload', 20)}</span><strong>Comprovantes de vacinação</strong><small>PDF ou imagem · múltiplos arquivos</small><em>Adicionar documentos</em><div class="seller-file-list">${fileSummary(seller.vaccinationDocuments, 'Nenhum comprovante adicionado')}</div></label><label class="seller-upload-box"><input type="file" name="farmDocuments" data-seller-files="farmDocuments" accept=".pdf,image/*" multiple /><span class="seller-upload-icon orange-upload-icon">${icon('file', 20)}</span><strong>Documentos da propriedade</strong><small>CAR, CCIR, registro ou declaração</small><em>Adicionar documentos</em><div class="seller-file-list">${fileSummary(seller.farmDocuments, 'Nenhum documento adicionado')}</div></label></div></section></div><div class="seller-profile-actions"><span>${icon('shield', 14)} A validação definitiva depende dos órgãos competentes e da análise documental.</span><button type="submit" class="primary-button">Salvar perfil vendedor ${icon('check', 15)}</button></div></form><section class="profile-card seller-cattle-card"><div><p class="eyebrow">CATÁLOGO DE GADO</p><h2>Cadastre o produto que será vendido</h2><p>Use o cadastro completo para informar raça, quantidade, sexo, idade, peso, preço, origem, sanidade, fotos e documentos do lote.</p><div class="seller-cattle-checks"><span>${icon('cow', 14)} Características do lote</span><span>${icon('camera', 14)} Fotos dos animais</span><span>${icon('file', 14)} GTA e certificados</span></div></div><button type="button" class="primary-button" data-seller-action="new-lot">Cadastrar gado completo ${icon('arrow', 15)}</button></section></div>`);
}

function favoritesTemplate() {
  const favoriteLots = lots.filter((lot) => state.favorites.has(lot.id));
  if (!favoriteLots.length) return accountShellTemplate('favorites', 'Favoritos', `<div class="favorites-empty-page"><div class="favorites-empty-content"><div class="favorites-empty-cart">${icon('cart', 46)}</div><h1>Carrinho vazio</h1></div></div>`);
  const totalValue = favoriteLots.reduce((sum, lot) => sum + (Number(lot.price.replace(/\D/g, '')) || 0), 0);
  const totalLabel = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue);
  const content = `<div class="favorites-page"><div class="favorites-heading"><div><p class="eyebrow">SUA SELEÇÃO</p><h1>Favoritos</h1><p>Guarde os lotes que despertaram seu interesse e compare antes de negociar.</p></div><span class="favorites-count">${favoriteLots.length} ${favoriteLots.length === 1 ? 'lote salvo' : 'lotes salvos'}</span></div>${favoriteLots.length ? `<div class="favorites-layout"><section><div class="favorites-toolbar"><div><h2>Produtos favoritados</h2><span>Seu carrinho de oportunidades</span></div><button class="secondary-button" data-nav="Buscar gado">${icon('search', 15)} Buscar mais gado</button></div><div class="favorites-grid">${favoriteLots.map(lotCard).join('')}</div></section><aside class="favorites-summary-card"><div class="favorites-summary-icon">${icon('heart', 20)}</div><p class="eyebrow">RESUMO DA SELEÇÃO</p><h2>Pronto para negociar?</h2><p>Revise os lotes salvos e converse diretamente com os vendedores.</p><div class="favorites-summary-lines"><div><span>Lotes salvos</span><strong>${favoriteLots.length}</strong></div><div><span>Valor de referência</span><strong>${totalLabel}</strong></div><div><span>Documentação</span><strong>${favoriteLots.length ? 'Disponível em cada lote' : '—'}</strong></div></div><button class="primary-button favorites-buy-button" data-action="buy-favorites">Negociar seleção ${icon('arrow', 15)}</button><small>${icon('shield', 13)} A compra é combinada diretamente entre as partes.</small></aside></div>` : `<section class="favorites-empty"><div class="favorites-empty-icon">${icon('heart', 28)}</div><h2>Você ainda não favoritou nenhum lote.</h2><p>Use o coração nos cards do catálogo para montar sua seleção de compra.</p><button class="primary-button" data-nav="Buscar gado">Buscar gado ${icon('arrow', 15)}</button></section>`}</div>`;
  return accountShellTemplate('favorites', 'Favoritos', content);
}

function bindAccountNavigation() {
  document.querySelectorAll('[data-nav]').forEach((el) => el.addEventListener('click', () => { const item = el.dataset.nav; state.activeNav = item; if (item === 'Mensagens') state.page = 'messages'; else if (item === 'Fretes') state.page = 'freight'; else if (item === 'Fretes de retorno') state.page = 'returnFreight'; else if (item === 'Buscar gado') { state.page = 'search'; state.collectionView = 'all'; state.query = ''; state.category = 'Todos'; state.advancedFilters = defaultAdvancedFilters(); } else if (item === 'Meus anúncios' || item === 'Meus produtos') state.page = state.mode === 'seller' ? 'sellerMarketplace' : 'announcements'; else if (item === 'Anunciar gado') state.page = 'register'; else if (item === 'Perfil vendedor') state.page = 'sellerProfile'; else if (item === 'Promoções') { state.page = 'sellerMarketplace'; state.toast = 'A área de promoções está pronta para receber suas campanhas.'; } else if (item === 'Painel vendedor') state.page = 'sellerMarketplace'; else state.page = 'home'; render(); }));
  document.querySelectorAll('[data-account-page]').forEach((el) => el.addEventListener('click', () => { const page = el.dataset.accountPage; if (page === 'sellerProfile') { state.mode = 'seller'; saveMode(); syncSellerIdentity(); saveSellerProfile(); state.activeNav = 'Perfil vendedor'; state.page = 'sellerProfile'; } else { state.activeNav = page === 'favorites' ? 'Favoritos' : 'Meu perfil'; state.collectionView = 'all'; state.modalLot = null; state.page = page; } render(); }));
  document.querySelectorAll('[data-profile-mode]').forEach((el) => el.addEventListener('click', () => switchProfileMode(el.dataset.profileMode)));
  document.querySelectorAll('[data-action="desktop-theme"]').forEach((el) => el.addEventListener('click', () => toggleTheme()));
  document.querySelectorAll('[data-action="logout"]').forEach((el) => el.addEventListener('click', logout));
  document.querySelectorAll('[data-action="register"]').forEach((el) => el.addEventListener('click', () => { state.page = 'register'; state.toast = ''; render(); }));
  bindNotificationEvents();
}

function bindProfileEvents() {
  bindAccountNavigation();
  document.querySelector('.profile-page')?.insertAdjacentHTML('beforeend', sellerProfileAccessTemplate());
  document.querySelector('[data-seller-action="open-profile"]')?.addEventListener('click', () => { state.mode = 'seller'; saveMode(); syncSellerIdentity(); saveSellerProfile(); state.activeNav = 'Perfil vendedor'; state.page = 'sellerProfile'; state.toast = ''; render(); });
  document.querySelector('#profile-form')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); state.profile = { ...state.profile, name: data.name.trim(), email: data.email.trim(), phone: data.phone.trim() }; saveProfile(); showToast('Dados do perfil atualizados.'); });
  document.querySelector('#profile-avatar-file')?.addEventListener('change', async (event) => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) { showToast('Escolha uma imagem para a foto de perfil.'); return; } if (file.size > 2 * 1024 * 1024) { showToast('A foto deve ter no máximo 2 MB.'); return; } state.profile.avatar = await readAsDataUrl(file); saveProfile(); render(); showToast('Foto de perfil atualizada.'); });
  document.querySelector('[data-profile-action="toggle-password"]')?.addEventListener('click', () => { const form = document.querySelector('#password-form'); if (!form) return; form.hidden = !form.hidden; if (!form.hidden) form.querySelector('input')?.focus(); });
  document.querySelector('#password-form')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); if (data.password.length < 8) { showToast('A nova senha precisa ter pelo menos 8 caracteres.'); return; } if (data.password !== data.confirmation) { showToast('A confirmação da senha não confere.'); return; } state.profile.passwordChangedAt = new Date().toISOString(); saveProfile(); showToast('Senha atualizada com segurança.'); });
}

function bindSellerProfileEvents() {
  document.querySelector('.seller-mode-switch [data-account-page="profile"]')?.addEventListener('click', (event) => { event.preventDefault(); event.stopImmediatePropagation(); switchProfileMode('buyer'); });
  bindAccountNavigation();
  document.querySelectorAll('[data-seller-files]').forEach((input) => input.addEventListener('change', () => { const list = input.closest('.seller-upload-box')?.querySelector('.seller-file-list'); if (!list) return; const files = [...input.files].map((file) => `<span>${icon('file', 12)} ${escapeHtml(file.name)}</span>`); list.innerHTML = files.length ? files.join('') : '<small>Nenhum arquivo selecionado</small>'; }));
  document.querySelector('[data-seller-action="new-lot"]')?.addEventListener('click', () => { state.page = 'register'; state.toast = ''; render(); });
  document.querySelector('#seller-profile-form')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); const selectedFiles = (name, fallback) => { const files = [...event.currentTarget.querySelector(`input[name="${name}"]`)?.files || []].map((file) => file.name); return files.length ? files : fallback; }; state.sellerProfile = { ...state.sellerProfile, ...data, vaccinationDocuments: selectedFiles('vaccinationDocuments', state.sellerProfile.vaccinationDocuments), farmDocuments: selectedFiles('farmDocuments', state.sellerProfile.farmDocuments), sellerStatus: 'Em análise', updatedAt: new Date().toISOString() }; saveSellerProfile(); state.mode = 'seller'; saveMode(); state.page = 'sellerMarketplace'; state.activeNav = 'Painel vendedor'; state.toast = 'Perfil vendedor salvo e enviado para análise documental.'; render(); });
}

function bindFavoritesEvents() {
  bindAccountNavigation();
  bindLotEvents();
  document.querySelector('[data-action="buy-favorites"]')?.addEventListener('click', () => { const selected = lots.filter((lot) => state.favorites.has(lot.id)); if (selected.length) openFreightSimulation(selected); });
  document.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', (event) => { if (event.target === el || el.classList.contains('modal-close') || el.classList.contains('secondary-button')) { state.modalLot = null; render(); } }));
  document.querySelectorAll('[data-modal-tab]').forEach((el) => el.addEventListener('click', () => { state.modalTab = el.dataset.modalTab; render(); }));
  document.querySelectorAll('[data-modal-media]').forEach((el) => el.addEventListener('click', () => { state.modalMediaIndex = Number(el.dataset.modalMedia); render(); }));
  document.querySelectorAll('[data-action="favorite-modal"]').forEach((el) => el.addEventListener('click', () => { const id = state.modalLot?.id; if (!id) return; state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id); saveFavorites(); render(); }));
  document.querySelectorAll('[data-action="share-lot"]').forEach((el) => el.addEventListener('click', async () => { const lot = state.modalLot; if (!lot) return; try { await navigator.clipboard?.writeText(`${lot.name} · ${lot.place}`); showToast('Referência do lote copiada para compartilhar.'); } catch { showToast('Lote pronto para ser compartilhado.'); } }));
  document.querySelectorAll('[data-action="buy-lot"]').forEach((el) => el.addEventListener('click', () => openFreightSimulation([state.modalLot])));
  document.querySelectorAll('[data-action="contact"]').forEach((el) => el.addEventListener('click', () => { const lot = state.modalLot; if (!lot) return; state.activeNav = 'Mensagens'; state.page = 'messages'; state.modalLot = null; render(); }));
}

function destroyReturnMap() {
  if (returnMapInstance) {
    returnMapInstance.remove();
    returnMapInstance = null;
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = state.darkMode ? 'dark' : 'light';
}

function render() {
  destroyReturnMap();
  destroyRadarMap();
  if (state.page !== 'auction' && userAuctionStream) stopUserBroadcast();
  if (!state.authenticated) {
    document.querySelector('#app').innerHTML = state.page === 'accountRegister' ? accountRegistrationReferenceTemplate() : loginReferenceTemplate();
    document.querySelector('.register-reference-card')?.insertAdjacentHTML('beforeend', registerReferenceDividerTemplate());
    if (state.welcomeOpen && state.page !== 'accountRegister') document.querySelector('#app').insertAdjacentHTML('beforeend', welcomePopupTemplate());
    if (state.page === 'accountRegister') bindAccountRegistrationEvents();
    else bindLoginEvents();
    return;
  }
  if (state.page === 'radar') {
    document.querySelector('#app').innerHTML = radarTemplate();
    bindRadarEvents();
    mountRadarMap();
    return;
  }
  if (state.page === 'auction') {
    document.querySelector('#app').innerHTML = auctionTemplate();
    bindAuctionEvents();
    startAuctionEngine();
    return;
  }
  if (state.page === 'shop') {
    document.querySelector('#app').innerHTML = shopTemplate();
    bindShopEvents();
    return;
  }
  if (state.page === 'myStore') {
    document.querySelector('#app').innerHTML = myStoreTemplate();
    bindMyStoreEvents();
    return;
  }
  if (state.page === 'register') {
    document.querySelector('#app').innerHTML = registrationTemplate();
    bindRegistrationEvents();
    return;
  }
  if (state.page === 'messages') {
    document.querySelector('#app').innerHTML = messagesTemplate();
    mountMobileMenu();
    bindMessagesEvents();
    return;
  }
  if (state.page === 'freight') {
    document.querySelector('#app').innerHTML = freightTemplate();
    mountMobileMenu();
    bindFreightEvents();
    return;
  }
  if (state.page === 'returnFreight') {
    document.querySelector('#app').innerHTML = returnFreightTemplate();
    mountMobileMenu();
    bindReturnFreightEvents();
    mountReturnMap();
    return;
  }
  if (state.page === 'search') {
    document.querySelector('#app').innerHTML = searchPageTemplate();
    mountMobileMenu();
    bindSearchEvents();
    return;
  }
  if (state.page === 'announcements') {
    document.querySelector('#app').innerHTML = announcementsTemplate();
    mountMobileMenu();
    bindAnnouncementsEvents();
    return;
  }
  if (state.page === 'sellerMarketplace') {
    document.querySelector('#app').innerHTML = sellerMarketplaceTemplate();
    mountMobileMenu();
    bindSellerMarketplaceEvents();
    return;
  }
  if (state.page === 'profile') {
    document.querySelector('#app').innerHTML = profileTemplate();
    mountMobileMenu();
    bindProfileEvents();
    return;
  }
  if (state.page === 'sellerProfile') {
    document.querySelector('#app').innerHTML = sellerProfileTemplate();
    mountMobileMenu();
    bindSellerProfileEvents();
    return;
  }
  if (state.page === 'favorites') {
    document.querySelector('#app').innerHTML = favoritesTemplate();
    mountMobileMenu();
    bindFavoritesEvents();
    return;
  }

  const filtered = getFilteredLots();
  const profileInitials = state.profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  document.querySelector('#app').innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div>
          <div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div>
        </div>
        <div class="profile-mini"><div class="avatar">${escapeHtml(profileInitials)}</div><div><strong>${escapeHtml(state.profile.name)}</strong><span>Comprador verificado</span></div><button class="icon-button">${icon('chevron', 15)}</button></div>
        <nav class="main-nav">
          <p class="nav-label">MENU PRINCIPAL</p>
          ${['Início', 'Buscar gado', 'Leilão ao vivo', 'Loja rural', 'Radar de fretes', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'].map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(['home','search','gavel','store','route','cow','message','truck','repeat'][i])}<span>${item}</span>${item === 'Mensagens' && state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0) ? `<b>${state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0)}</b>` : ''}</button>`).join('')}
          <p class="nav-label nav-spacer">CONTA</p>
          <button class="nav-item ${state.collectionView === 'favorites' ? 'active' : ''}" data-account-view="favorites">${icon('heart')}<span>Favoritos</span>${state.favorites.size ? `<b>${state.favorites.size}</b>` : ''}</button>
          <button class="nav-item">${icon('user')}<span>Meu perfil</span></button>
        </nav>
        <div class="sidebar-bottom"><div class="help-card"><div class="help-icon">?</div><div><strong>Precisa de ajuda?</strong><span>Fale com nosso suporte</span></div>${icon('chevron', 15)}</div><div class="sidebar-foot">GadOn <span>•</span> versão 1.0 MVP</div></div>
      </aside>

      <main class="main-content">
        <header class="topbar"><button class="mobile-menu icon-button">${icon('menu', 21)}</button><div class="crumb">Marketplace <span>/</span> ${state.activeNav}</div><div class="top-actions"><button class="announce-button" data-action="register">${icon('plus', 15)} Habilitar lote</button><div class="notification-wrap"><button class="circle-action" data-action="notifications" aria-label="Abrir notificações">${icon('bell', 18)}${getNotificationCount() ? '<i></i>' : ''}</button>${notificationPopover()}</div><div class="top-avatar">${escapeHtml(profileInitials)}</div><button class="top-user">${escapeHtml(state.profile.name)} <span>⌄</span></button></div></header>
        <div class="page-body">
          <section class="welcome-row"><div><p class="eyebrow">DOMINGO, 26 DE JULHO DE 2026</p><h1>Encontre seu próximo lote.</h1><p class="welcome-sub">Negocie direto com produtores de todo o Brasil.</p></div><div class="location-pill">${icon('pin', 16)} <span>Campo Verde, MT</span><span class="down">⌄</span></div></section>
          <section class="hero-card"><div class="hero-copy"><span class="hero-kicker">GADON MARKETPLACE</span><h2>O gado certo.<br><em>Do seu jeito.</em></h2><p>Compra, venda e frete inteligente em um só lugar.</p><button class="primary-button" data-scroll="lots">Buscar lotes ${icon('arrow', 16)}</button></div><div class="hero-art" role="img" aria-label="Gado Nelore em um pasto ao pôr do sol"><div class="hero-note"><span class="status-dot"></span> 2.351 lotes ativos agora</div></div></section>
          <section class="quick-stats"><div class="quick-stat"><div class="stat-icon blue-bg">${icon('cow', 19)}</div><div><strong>2.351</strong><span>lotes ativos</span></div></div><div class="quick-stat"><div class="stat-icon orange-bg">${icon('message', 19)}</div><div><strong>1.128</strong><span>negociações abertas</span></div></div><div class="quick-stat"><div class="stat-icon green-bg">${icon('truck', 19)}</div><div><strong>843</strong><span>fretes realizados</span></div></div><div class="quick-stat highlight"><div class="stat-icon purple-bg">${icon('repeat', 19)}</div><div><strong>Encontre cargas para a viagem de volta</strong><span>Aproveite a viagem de volta</span></div><button data-nav="Fretes de retorno">${icon('arrow', 15)}</button></div></section>
          <section class="feature-promos"><button class="promo-card promo-auction" data-nav="Leilão ao vivo"><span class="live-pill"><i></i> AO VIVO</span><div><p class="eyebrow">LEILÃO GADON</p><h3>Nelore PO Elite em pregão agora</h3><p>Lances em tempo real · o martelo bate em minutos</p></div><span class="promo-cta">Dar lance ${icon('gavel', 16)}</span></button><button class="promo-card promo-shop" data-nav="Loja rural"><div><p class="eyebrow">LOJA RURAL</p><h3>Rações, sementes, terras e equipamentos</h3><p>Tudo para a fazenda em um só lugar</p></div><span class="promo-cta">Visitar loja ${icon('store', 16)}</span></button></section>
          <section class="section-block" id="lots"><div class="section-heading"><div><p class="eyebrow">PARA VOCÊ</p><h2>${state.collectionView === 'favorites' ? 'Meus favoritos' : state.collectionView === 'history' ? 'Histórico de visualizações' : 'Lotes em destaque'}</h2></div><button class="text-button" data-nav="Buscar gado">Ver todos ${icon('arrow', 15)}</button></div><div class="filter-row"><div class="search-field">${icon('search', 17)}<input id="search" value="${state.query}" placeholder="Busque por raça, cidade ou categoria..." /></div><div class="category-tabs">${['Todos', 'Nelore', 'Angus', 'Cruza', 'Bezerros'].map(c => `<button class="tab ${state.category === c ? 'selected' : ''}" data-category="${c}">${c}</button>`).join('')}</div><button class="filter-button" data-action="filters">${icon('filter', 16)} Filtros <span>${activeFilterCount()}</span></button><select class="sort-select" id="lot-sort" aria-label="Ordenar lotes"><option value="relevance" ${state.sort === 'relevance' ? 'selected' : ''}>Mais relevantes</option><option value="recent" ${state.sort === 'recent' ? 'selected' : ''}>Mais recentes</option><option value="price-low" ${state.sort === 'price-low' ? 'selected' : ''}>Menor preço</option><option value="weight-high" ${state.sort === 'weight-high' ? 'selected' : ''}>Maior peso</option></select></div><div class="lots-grid">${filtered.length ? filtered.slice(0, 4).map(lotCard).join('') : `<div class="empty-state">Nenhum lote encontrado. Tente outra busca.</div>`}</div></section>
          <section class="operations"><div class="operation-panel freight"><div class="operation-icon">${icon('truck', 22)}</div><div><p class="eyebrow">FRETE PARCEIRO</p><h3>Leve seu gado com segurança.</h3><p>Solicite cotações de transportadoras parceiras para sua rota.</p><button class="primary-button" data-nav="Fretes">Cotar frete ${icon('arrow', 15)}</button></div><div class="route-lines"></div></div><div class="operation-panel return logistics-panel"><div class="operation-icon">${icon('repeat', 22)}</div><div class="logistics-panel-content"><p class="eyebrow">INTELIGÊNCIA LOGÍSTICA</p><h3>Encontre cargas para a viagem de volta</h3><p>Aproveite o trajeto de retorno e reduza o custo do frete.</p><button class="primary-button logistics-opportunity-button" data-nav="Fretes de retorno">Ver oportunidades ${icon('arrow', 15)}</button></div></div></section>
          <section class="trust-row"><div>${icon('heart', 20)}<span><strong>Negociação direta</strong> fale com o anunciante</span></div><div>${icon('truck', 20)}<span><strong>Transportadores parceiros</strong> frete com cotação</span></div><div>${icon('user', 20)}<span><strong>Perfis verificados</strong> mais segurança</span></div><div>${icon('chart', 20)}<span><strong>Gestão completa</strong> para seu negócio</span></div></section>
        </div>
      </main>
    </div>
    ${selectionBarTemplate()}\n    ${state.modalLot ? marketplaceModalTemplate(state.modalLot) : ''}
    ${state.filterOpen ? filterDrawerTemplate() : ''}
    ${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}
  `;
  mountMobileMenu();
  bindEvents();
}

function lotCard(lot) {
  const isFavorite = state.favorites.has(lot.id);
  const isSelected = state.selectedLots.has(lot.id);
  return `<article class="lot-card ${isSelected ? 'is-selected' : ''}"><div class="lot-image"><img src="${lot.image}" alt="${lot.name}" /><span class="verified">✓ Verificado</span><button class="favorite ${isFavorite ? 'is-favorite' : ''}" data-favorite="${lot.id}" aria-label="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${icon('heart', 18)}</button>${isSelected ? '<span class="selected-badge">Selecionado</span>' : ''}</div><div class="lot-info"><div class="lot-title-row"><div><h3>${lot.name}</h3><p>${lot.meta}</p></div><span class="lot-badge ${lot.accent}">${lot.category}</span></div><div class="lot-price">${lot.price} <small>${lot.unit}</small></div><div class="lot-meta">${icon('pin', 14)} ${lot.place}</div><div class="lot-footer"><span><span class="online-dot"></span> ${lot.seller}</span><div class="lot-actions"><button class="select-lot-button ${isSelected ? 'selected' : ''}" data-select-lot="${lot.id}">${isSelected ? '✓ Selecionado' : 'Selecionar'}</button><button class="view-button" data-lot="${lot.id}">Ver lote ${icon('chevron', 13)}</button></div></div></div></article>`;
}

function selectionBarTemplate() {
  const selected = lots.filter((lot) => state.selectedLots.has(lot.id));
  if (!selected.length) return '';
  return `<div class="selection-bar"><div><span class="selection-icon">${icon('cow', 18)}</span><div><strong>${selected.length} lote${selected.length === 1 ? '' : 's'} selecionado${selected.length === 1 ? '' : 's'}</strong><small>${selected.map((lot) => escapeHtml(lot.name)).join(' · ')}</small></div></div><div class="selection-actions"><button type="button" class="secondary-button" data-action="clear-selection">Limpar</button><button type="button" class="secondary-button" data-action="simulate-freight">Simular frete</button><button type="button" class="primary-button" data-action="buy-selected">Solicitar compra ${icon('arrow', 15)}</button></div></div>`;
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

function freightEstimateSummary() {
  if (!state.freightEstimate) return `<div class="freight-simulation-empty">Informe origem e destino para visualizar a estimativa automática.</div>`;
  return `<div class="freight-simulation-result"><div><span>${icon('route', 16)} Distância estimada</span><strong>${state.freightEstimate.distanceKm.toLocaleString('pt-BR')} km</strong></div><div><span>${icon('truck', 16)} Frete estimado</span><strong>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(state.freightEstimate.price)}</strong></div><small>${state.freightEstimate.animals} cabeça(s) · valor de referência sujeito à cotação da transportadora</small></div>`;
}

function openFreightSimulation(selectedLots) {
  const targets = selectedLots.filter(Boolean);
  if (!targets.length) return;
  state.freightSimulationLots = targets;
  state.freightOrigin = state.freightOrigin || targets[0].place || '';
  state.freightDestination = '';
  state.freightEstimate = null;
  state.modalLot = null;
  state.freightSimulationOpen = true;
  render();
}

function bindFreightSimulationEvents() {
  if (!state.freightSimulationOpen) return;
  document.querySelectorAll('[data-freight-sim-close]').forEach((el) => el.addEventListener('click', (event) => { if (event.target === el || el.classList.contains('modal-close') || el.classList.contains('secondary-button')) { state.freightSimulationOpen = false; state.freightEstimate = null; render(); } }));
  const form = document.querySelector('#freight-simulation-form');
  const update = () => { const data = Object.fromEntries(new FormData(form).entries()); state.freightOrigin = data.origin || ''; state.freightDestination = data.destination || ''; state.freightEstimate = freightEstimate(state.freightOrigin, state.freightDestination, state.freightSimulationLots); const output = document.querySelector('#freight-estimate-output'); if (output) output.innerHTML = freightEstimateSummary(); const continueButton = document.querySelector('[data-action="continue-purchase"]'); if (continueButton) continueButton.disabled = !state.freightEstimate; };
  form?.addEventListener('submit', (event) => { event.preventDefault(); update(); });
  form?.querySelectorAll('input').forEach((input) => input.addEventListener('input', update));
  document.querySelector('[data-action="continue-purchase"]')?.addEventListener('click', () => { const selected = state.freightSimulationLots; state.freightSimulationOpen = false; beginLotNegotiation(selected[0], true, selected); });
}

function freightSimulationModalTemplate() {
  const selected = state.freightSimulationLots.length ? state.freightSimulationLots : [state.modalLot].filter(Boolean);
  return `<div class="modal-backdrop freight-simulation-backdrop" data-freight-sim-close><section class="freight-simulation-modal" role="dialog" aria-modal="true" aria-label="Simulação de frete"><button type="button" class="modal-close" data-freight-sim-close>${icon('close', 19)}</button><div class="freight-simulation-head"><span class="freight-simulation-icon">${icon('truck', 22)}</span><div><p class="eyebrow">PLANEJE SUA COMPRA</p><h2>Simulação automática de frete</h2><p>Informe o trajeto e tenha uma referência antes de conversar com o vendedor.</p></div></div><div class="freight-simulation-lots"><span>Produto selecionado</span><strong>${selected.map((lot) => escapeHtml(lot.name)).join(' · ')}</strong></div><form id="freight-simulation-form"><div class="freight-simulation-fields"><label><span>Origem</span><input name="origin" value="${escapeHtml(state.freightOrigin)}" placeholder="Ex.: Campo Verde - MT" required /></label><label><span>Destino</span><input name="destination" value="${escapeHtml(state.freightDestination)}" placeholder="Ex.: Goiânia - GO" required /></label></div><div id="freight-estimate-output">${freightEstimateSummary()}</div><div class="freight-simulation-actions"><button type="button" class="secondary-button" data-freight-sim-close>Continuar depois</button><button type="submit" class="primary-button">Calcular frete ${icon('arrow', 15)}</button><button type="button" class="primary-button" data-action="continue-purchase" ${state.freightEstimate ? '' : 'disabled'}>Continuar negociação</button></div></form><p class="freight-simulation-note">A simulação é uma estimativa de planejamento. A cotação final depende de distância validada, quantidade, documentação e disponibilidade da transportadora.</p></section></div>`;
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

function modalTemplate(lot) {
  return `<div class="modal-backdrop" data-close-modal><div class="modal" role="dialog" aria-modal="true"><button class="modal-close" data-close-modal>${icon('close', 19)}</button><div class="modal-photo"><img src="${lot.image}" alt="${lot.name}" /><span class="modal-photo-label">${icon('cow', 15)} Lote verificado</span></div><div class="modal-body"><div class="modal-title"><div><span class="eyebrow">DETALHES DO LOTE</span><h2>${lot.name}</h2><p>${lot.seller} · vendedor verificado</p></div><button class="favorite is-favorite">${icon('heart', 18)}</button></div><div class="modal-price"><strong>${lot.price}</strong><span>${lot.unit}</span></div><div class="detail-grid"><div><span>Categoria</span><strong>${lot.category}</strong></div><div><span>Quantidade</span><strong>${lot.meta.split('·')[0]}</strong></div><div><span>Peso médio</span><strong>${lot.meta.split('·')[1]}</strong></div><div><span>Idade</span><strong>${lot.age}</strong></div><div><span>Localização</span><strong>${lot.place}</strong></div><div><span>Negociação</span><strong>Direto com o vendedor</strong></div></div><div class="modal-description"><h4>Sobre este lote</h4><p>Animais bem avaliados, manejo completo e prontos para confinamento. Entre em contato com o anunciante para conferir documentação, vídeos e condições de retirada.</p></div><div class="modal-actions"><button class="secondary-button" data-close-modal>Fechar</button><button class="primary-button" data-action="contact">Conversar com vendedor ${icon('arrow', 15)}</button></div><p class="no-checkout">${icon('message', 14)} O GadOn conecta as partes. O pagamento é combinado fora da plataforma.</p></div></div></div>`;
}

function marketplaceModalTemplate(lot) {
  const media = [lot.image, ...lots.filter((item) => item.id !== lot.id).map((item) => item.image)].slice(0, 4);
  const activeMedia = media[state.modalMediaIndex % media.length];
  const tabs = [['description', 'Descrição'], ['media', 'Fotos e vídeos'], ['documents', 'Documentação'], ['health', 'Sanidade'], ['location', 'Localização'], ['additional', 'Informações adicionais']];
  let tabContent = {
    description: `<div class="detail-grid"><div><span>Categoria</span><strong>${escapeHtml(lot.category)}</strong></div><div><span>Quantidade</span><strong>${escapeHtml(lot.meta.split('·')[0])}</strong></div><div><span>Peso médio</span><strong>${escapeHtml(lot.meta.split('·')[1])}</strong></div><div><span>Idade média</span><strong>${escapeHtml(lot.age)}</strong></div><div><span>Raça</span><strong>${escapeHtml(lot.category)}</strong></div><div><span>Condição</span><strong>À vista ou a combinar</strong></div></div><div class="modal-description"><h4>Sobre este lote</h4><p>Animais bem avaliados, manejo completo e prontos para confinamento. Converse com o anunciante para conferir condições de retirada e disponibilidade.</p></div>`,
    media: `<div class="modal-media-panel"><div class="media-video-card"><span>${icon('play', 20)}</span><strong>Vídeo do manejo</strong><small>Solicite ao vendedor vídeos recentes do lote.</small></div><div class="media-grid">${media.map((source, index) => `<button type="button" data-modal-media="${index}" class="media-grid-item ${index === state.modalMediaIndex % media.length ? 'active' : ''}"><img src="${source}" alt="Imagem ${index + 1} de ${escapeHtml(lot.name)}" /></button>`).join('')}</div></div>`,
    documents: `<div class="document-checklist"><div><span>${icon('shield', 16)}</span><strong>Perfil do vendedor verificado</strong><small>Identidade e dados cadastrais conferidos.</small><b>Conferido</b></div><div><span>${icon('file', 16)}</span><strong>Documentação sanitária</strong><small>GTA e comprovantes disponíveis sob consulta.</small><b>Solicitar</b></div><div><span>${icon('file', 16)}</span><strong>Origem do lote</strong><small>Informações da propriedade e procedência.</small><b>Disponível</b></div></div>`,
    location: `<div class="location-panel"><div class="location-map"><span>${icon('pin', 25)}</span><strong>${escapeHtml(lot.place)}</strong><small>Localização aproximada por segurança</small></div><div class="location-facts"><span>Retirada</span><strong>Combinada diretamente com o vendedor</strong><span>Frete</span><strong>Solicite uma cotação pela plataforma</strong></div></div>`,
    additional: `<div class="additional-info"><div><span>Finalidade sugerida</span><strong>Engorda e recria</strong></div><div><span>Negociação</span><strong>Direto com o vendedor</strong></div><div><span>Publicado por</span><strong>${escapeHtml(lot.seller)}</strong></div><div><span>Atualização</span><strong>Informações recentes do anunciante</strong></div></div>`
  }[state.modalTab] || '';
  if (state.modalTab === 'documents') tabContent = legalDocumentsTemplate(lot);
  if (state.modalTab === 'health') tabContent = healthTemplate(lot);
  return `<div class="modal-backdrop" data-close-modal><div class="modal marketplace-modal" role="dialog" aria-modal="true"><button class="modal-close" data-close-modal>${icon('close', 19)}</button><div class="modal-gallery"><div class="modal-photo"><img src="${activeMedia}" alt="${escapeHtml(lot.name)}" /><span class="modal-photo-label">${icon('cow', 15)} Lote verificado</span><span class="photo-counter">${state.modalMediaIndex % media.length + 1}/${media.length}</span></div><div class="modal-thumbnails">${media.map((source, index) => `<button type="button" data-modal-media="${index}" class="modal-thumbnail ${index === state.modalMediaIndex % media.length ? 'active' : ''}"><img src="${source}" alt="Miniatura ${index + 1}" /></button>`).join('')}</div></div><div class="modal-body"><div class="modal-title"><div><span class="eyebrow">PÁGINA DO LOTE</span><h2>${escapeHtml(lot.name)}</h2><p>${escapeHtml(lot.place)} · publicado por ${escapeHtml(lot.seller)}</p></div><div class="modal-tools"><button type="button" class="modal-tool ${state.favorites.has(lot.id) ? 'is-favorite' : ''}" data-action="favorite-modal" aria-label="Favoritar lote">${icon('heart', 17)}</button><button type="button" class="modal-tool" data-action="share-lot" aria-label="Compartilhar lote">${icon('share', 17)}</button></div></div><div class="modal-price"><strong>${escapeHtml(lot.price)}</strong><span>${escapeHtml(lot.unit)}</span></div><div class="negotiation-status"><span><i></i> Negociação aberta</span><small>Fale diretamente com o vendedor e acompanhe a proposta no chat.</small></div><div class="modal-tabs">${tabs.map(([id, label]) => `<button type="button" class="modal-tab ${state.modalTab === id ? 'active' : ''}" data-modal-tab="${id}">${label}</button>`).join('')}</div><div class="modal-tab-content">${tabContent}</div><div class="modal-actions"><button class="secondary-button" data-close-modal>Fechar</button><button class="primary-button" data-action="buy-lot">Comprar / solicitar proposta ${icon('arrow', 15)}</button></div><p class="no-checkout">${icon('message', 14)} Negocie livremente. O pagamento é combinado fora da plataforma.</p></div></div></div>`;
}

function beginLotNegotiation(lot, isPurchase = false, selectedLots = [lot]) {
  const targets = (isPurchase ? selectedLots : [lot]).filter(Boolean);
  if (!targets.length) return;
  const conversations = targets.map((target) => {
    let conversation = state.messages.find((item) => item.lotId === target.id);
    if (!conversation) {
      conversation = { id: Date.now() + target.id, lotId: target.id, name: target.seller, initials: target.seller.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase(), role: `Vendedor · ${target.name}`, color: '#7a6a56', online: true, unread: 0, updatedAt: 'agora', lastMessage: 'Nova conversa iniciada.', messages: [{ from: 'them', text: `Olá! Vi que você se interessou pelo lote ${target.name}. Como posso ajudar?`, time: 'agora' }] };
      state.messages.unshift(conversation);
    }
    if (isPurchase) {
      const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date());
      const text = `Olá! Tenho interesse em comprar o lote ${target.name}. Gostaria de receber uma proposta e combinar a retirada.`;
      conversation.messages.push({ from: 'me', text, time });
      conversation.lastMessage = 'Solicitação de compra enviada.';
      conversation.updatedAt = 'agora';
    }
    return conversation;
  });
  saveMessages();
  state.activeConversationId = conversations[0].id;
  state.selectedLots.clear();
  state.modalLot = null;
  state.activeNav = 'Mensagens';
  state.page = 'messages';
  state.toast = '';
  render();
}

function bindNotificationEvents() {
  document.querySelectorAll('[data-action="notifications"]').forEach((el) => el.addEventListener('click', () => { state.notificationsOpen = !state.notificationsOpen; render(); }));
  document.querySelectorAll('[data-notification-action="read-all"]').forEach((el) => el.addEventListener('click', () => { state.notifications = state.notifications.map((notification) => ({ ...notification, unread: false })); saveNotifications(); render(); }));
  document.querySelectorAll('[data-notification-id]').forEach((el) => el.addEventListener('click', () => { const notification = state.notifications.find((item) => item.id === Number(el.dataset.notificationId)); if (!notification) return; notification.unread = false; saveNotifications(); state.notificationsOpen = false; if (notification.type === 'message') { state.activeNav = 'Mensagens'; state.page = 'messages'; } else { state.activeNav = 'Fretes'; state.page = 'freight'; } render(); }));
}

function bindEvents() {
  document.querySelectorAll('[data-nav]').forEach((el) => el.addEventListener('click', () => { state.activeNav = el.dataset.nav; if (el.dataset.nav === 'Mensagens') state.page = 'messages'; else if (el.dataset.nav === 'Fretes') state.page = 'freight'; else if (el.dataset.nav === 'Fretes de retorno') state.page = 'returnFreight'; else if (el.dataset.nav === 'Buscar gado') { state.page = 'search'; state.collectionView = 'all'; state.query = ''; state.category = 'Todos'; state.advancedFilters = defaultAdvancedFilters(); } else { state.page = 'home'; } render(); }));
  document.querySelectorAll('[data-category]').forEach((el) => el.addEventListener('click', () => { state.category = el.dataset.category; render(); }));
  const search = document.querySelector('#search');
  search?.addEventListener('input', (event) => { state.query = event.target.value; document.querySelector('.lots-grid').innerHTML = getFilteredLots().slice(0, 4).map(lotCard).join('') || '<div class="empty-state">Nenhum lote encontrado. Tente outra busca.</div>'; bindLotEvents(); });
  bindLotEvents();
  document.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', (event) => { if (event.target === el || el.classList.contains('modal-close') || el.classList.contains('secondary-button')) { state.modalLot = null; render(); } }));
  document.querySelectorAll('[data-scroll]').forEach((el) => el.addEventListener('click', () => document.querySelector(`#${el.dataset.scroll}`)?.scrollIntoView({ behavior: 'smooth' })));
  document.querySelectorAll('[data-action="register"]').forEach((el) => el.addEventListener('click', () => { state.page = 'register'; state.toast = ''; render(); }));
  document.querySelectorAll('[data-action="filters"]').forEach((el) => el.addEventListener('click', () => { state.filterOpen = true; render(); }));
  document.querySelectorAll('[data-filter-action="close"]').forEach((el) => el.addEventListener('click', (event) => { if (event.target === el || el.classList.contains('modal-close')) { state.filterOpen = false; render(); } }));
  document.querySelector('[data-filter-action="reset"]')?.addEventListener('click', () => { state.advancedFilters = defaultAdvancedFilters(); state.filterOpen = false; render(); });
  document.querySelector('#advanced-filters')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); state.advancedFilters = { region: data.region || 'Todos', sex: data.sex || 'Todos', farm: data.farm || 'Todos', location: data.location || 'Todos', purpose: data.purpose || 'Todos', minWeight: data.minWeight || '', maxWeight: data.maxWeight || '', minAge: data.minAge || '', maxAge: data.maxAge || '' }; state.filterOpen = false; render(); });
  document.querySelector('#lot-sort')?.addEventListener('change', (event) => { state.sort = event.target.value; render(); });
  document.querySelectorAll('[data-account-view]').forEach((el) => el.addEventListener('click', () => { state.collectionView = el.dataset.accountView; state.activeNav = 'Início'; state.page = el.dataset.accountView === 'favorites' ? 'favorites' : 'home'; render(); }));
  document.querySelectorAll('[data-modal-tab]').forEach((el) => el.addEventListener('click', () => { state.modalTab = el.dataset.modalTab; render(); }));
  document.querySelectorAll('[data-modal-media]').forEach((el) => el.addEventListener('click', () => { state.modalMediaIndex = Number(el.dataset.modalMedia); render(); }));
  document.querySelectorAll('[data-action="favorite-modal"]').forEach((el) => el.addEventListener('click', () => { const id = state.modalLot?.id; if (!id) return; state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id); saveFavorites(); render(); }));
  document.querySelectorAll('[data-action="share-lot"]').forEach((el) => el.addEventListener('click', async () => { const lot = state.modalLot; if (!lot) return; try { await navigator.clipboard?.writeText(`${lot.name} · ${lot.place}`); showToast('Referência do lote copiada para compartilhar.'); } catch { showToast('Lote pronto para ser compartilhado.'); } }));
  document.querySelectorAll('[data-action="buy-lot"]').forEach((el) => el.addEventListener('click', () => openFreightSimulation([state.modalLot])));
  document.querySelector('[data-action="clear-selection"]')?.addEventListener('click', () => { state.selectedLots.clear(); render(); });
  document.querySelectorAll('[data-action="simulate-freight"]').forEach((el) => el.addEventListener('click', () => { const selected = lots.filter((lot) => state.selectedLots.has(lot.id)); openFreightSimulation(selected); }));
  document.querySelector('[data-action="buy-selected"]')?.addEventListener('click', () => { const selected = lots.filter((lot) => state.selectedLots.has(lot.id)); openFreightSimulation(selected); });
  document.querySelectorAll('[data-action="contact"]').forEach((el) => el.addEventListener('click', () => { const lot = state.modalLot; let conversation = state.messages.find((item) => item.lotId === lot?.id); if (!conversation && lot) { conversation = { id: Date.now(), lotId: lot.id, name: lot.seller, initials: lot.seller.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase(), role: `Vendedor · ${lot.name}`, color: '#7a6a56', online: true, unread: 0, updatedAt: 'agora', lastMessage: 'Nova conversa iniciada.', messages: [{ from: 'them', text: `Olá! Vi que você se interessou pelo lote ${lot.name}. Como posso ajudar?`, time: 'agora' }] }; state.messages.unshift(conversation); saveMessages(); } if (conversation) state.activeConversationId = conversation.id; state.modalLot = null; state.activeNav = 'Mensagens'; state.page = 'messages'; render(); }));
  bindNotificationEvents();
}

function bindSearchEvents() {
  document.querySelector('#breed-search-form')?.addEventListener('submit', (event) => { event.preventDefault(); state.query = document.querySelector('#breed-search')?.value.trim() || ''; render(); });
  document.querySelector('#breed-search')?.addEventListener('input', (event) => { state.query = event.target.value; render(); setTimeout(() => { const input = document.querySelector('#breed-search'); input?.focus(); input?.setSelectionRange(state.query.length, state.query.length); }, 0); });
  document.querySelectorAll('[data-search-category]').forEach((el) => el.addEventListener('click', () => { state.category = el.dataset.searchCategory; state.query = ''; render(); }));
  document.querySelectorAll('[data-action="search-clear"]').forEach((el) => el.addEventListener('click', () => { state.query = ''; state.category = 'Todos'; render(); setTimeout(() => document.querySelector('#breed-search')?.focus(), 0); }));
  bindEvents();
}

function messagesTemplate() {
  const active = state.messages.find((conversation) => conversation.id === state.activeConversationId) || state.messages[0];
  const lot = lots.find((item) => item.id === active?.lotId);
  const conversations = state.messages.filter((conversation) => `${conversation.name} ${conversation.role} ${conversation.lastMessage}`.toLowerCase().includes(state.messageQuery.toLowerCase()));
  const unreadCount = state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
  return `<div class="app-shell messages-shell">
    <aside class="sidebar"><div class="brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></div><div class="profile-mini"><div class="avatar">JP</div><div><strong>João Pecuarista</strong><span>Comprador verificado</span></div><button class="icon-button">${icon('chevron', 15)}</button></div><nav class="main-nav"><p class="nav-label">MENU PRINCIPAL</p>${['Início', 'Buscar gado', 'Leilão ao vivo', 'Loja rural', 'Radar de fretes', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'].map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(['home','search','gavel','store','route','cow','message','truck','repeat'][i])}<span>${item}</span>${item === 'Mensagens' && unreadCount ? `<b>${unreadCount}</b>` : ''}</button>`).join('')}<p class="nav-label nav-spacer">CONTA</p><button class="nav-item">${icon('heart')}<span>Favoritos</span></button><button class="nav-item">${icon('user')}<span>Meu perfil</span></button></nav><div class="sidebar-bottom"><div class="help-card"><div class="help-icon">?</div><div><strong>Precisa de ajuda?</strong><span>Fale com nosso suporte</span></div>${icon('chevron', 15)}</div><div class="sidebar-foot">GadOn <span>•</span> versão 1.0 MVP</div></div></aside>
    <main class="main-content"><header class="topbar"><button class="mobile-menu icon-button">${icon('menu', 21)}</button><div class="crumb">Marketplace <span>/</span> Mensagens</div><div class="top-actions"><button class="announce-button" data-action="register">${icon('plus', 15)} Habilitar lote</button><div class="notification-wrap"><button class="circle-action" data-action="notifications" aria-label="Abrir notificações">${icon('bell', 18)}${getNotificationCount() ? '<i></i>' : ''}</button>${notificationPopover()}</div><div class="top-avatar">JP</div><button class="top-user">João Pecuarista <span>⌄</span></button></div></header><div class="messages-page"><div class="messages-heading"><div><p class="eyebrow">COMUNICAÇÃO DIRETA</p><h1>Mensagens</h1><p>Negocie lotes e combine os próximos passos com segurança.</p></div><div class="message-summary"><span class="summary-dot"></span><strong>${state.messages.length}</strong><span>conversas ativas</span></div></div><div class="messages-layout"><section class="conversation-panel"><div class="conversation-head"><div><h2>Conversas</h2><span>${unreadCount ? `${unreadCount} não lidas` : 'Tudo em dia'}</span></div><button class="new-message-button" data-chat-action="new">${icon('plus', 15)} Nova conversa</button></div><div class="message-search">${icon('search', 16)}<input id="message-search" value="${escapeHtml(state.messageQuery)}" placeholder="Buscar conversa..." /></div><div class="conversation-list">${conversations.length ? conversations.map(conversationListItem).join('') : '<div class="conversation-empty">Nenhuma conversa encontrada.</div>'}</div></section><section class="chat-panel">${active ? `<div class="chat-head"><div class="chat-person"><div class="chat-avatar" style="background:${active.color}">${escapeHtml(active.initials)}</div><div><h2>${escapeHtml(active.name)}</h2><p><span class="${active.online ? 'online-dot' : 'offline-dot'}"></span>${active.online ? 'Online agora' : 'Visto recentemente'} · ${escapeHtml(active.role)}</p></div></div><div class="chat-actions"><button data-chat-action="quote">${icon('file', 16)} Cotar frete</button><button class="icon-button">${icon('dots', 19)}</button></div></div><div class="lot-context">${icon('cow', 15)}<span><b>${escapeHtml(lot?.name || active.role.replace('Vendedor · ', ''))}</b>${lot ? ` · ${escapeHtml(lot.place)} · ${escapeHtml(lot.price)}` : ''}</span><button data-lot="${active.lotId}">Ver lote ${icon('chevron', 13)}</button></div><div class="chat-messages">${active.messages.map(messageBubble).join('')}</div><form id="chat-form" class="chat-composer"><input id="chat-attachment" type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" multiple /><button type="button" class="composer-tool" data-chat-action="attach" aria-label="Anexar arquivos">${icon('plus', 18)}</button><button type="button" class="composer-tool ${state.recording ? 'recording' : ''}" data-chat-action="record" aria-label="${state.recording ? 'Parar gravação' : 'Gravar áudio'}">${icon(state.recording ? 'stop' : 'mic', 17)}</button><input id="chat-input" name="message" autocomplete="off" placeholder="${state.recording ? 'Gravando áudio...' : 'Escreva uma mensagem...'}" maxlength="500" ${state.recording ? 'disabled' : ''} /><button type="submit" class="send-button" aria-label="Enviar mensagem" ${state.recording ? 'disabled' : ''}>${icon('send', 17)}</button></form><div class="chat-note">${icon('shield', 13)} Nunca compartilhe senhas ou dados bancários. O pagamento é combinado fora da plataforma.</div>` : '<div class="chat-no-selection">Selecione uma conversa para começar.</div>'}</section></div></div></main>
  </div>${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}`;
}

function conversationListItem(conversation) {
  return `<button class="conversation-item ${conversation.id === state.activeConversationId ? 'selected' : ''}" data-conversation="${conversation.id}"><div class="conversation-avatar" style="background:${conversation.color}">${escapeHtml(conversation.initials)}</div><div class="conversation-copy"><div class="conversation-row"><strong>${escapeHtml(conversation.name)}</strong><time>${escapeHtml(conversation.updatedAt)}</time></div><span>${escapeHtml(conversation.role)}</span><p>${escapeHtml(conversation.lastMessage)}</p></div>${conversation.unread ? `<b class="unread-count">${conversation.unread}</b>` : ''}</button>`;
}

function messageBubble(message) {
  const body = message.type === 'attachment' ? `<div class="attachment-list">${message.attachments.map((attachment) => attachment.url ? `<div class="attachment-image"><img src="${escapeHtml(attachment.url)}" alt="${escapeHtml(attachment.name)}" /><span>${escapeHtml(attachment.name)}</span></div>` : `<div class="attachment-file">${icon('file', 17)}<span><b>${escapeHtml(attachment.name)}</b><small>${escapeHtml(attachment.sizeLabel)}</small></span></div>`).join('')}</div>` : message.type === 'audio' ? `<div class="audio-message">${message.url ? `<audio controls src="${escapeHtml(message.url)}"></audio>` : `<span>${icon('mic', 15)} Áudio gravado</span>`}</div>` : escapeHtml(message.text).replace(/\n/g, '<br>');
  return `<div class="message-row ${message.from === 'me' ? 'mine' : 'theirs'}"><div class="message-bubble">${body}<small>${escapeHtml(message.time)} ${message.from === 'me' ? '✓✓' : ''}</small></div></div>`;
}

function bindMessagesEvents() {
  document.querySelectorAll('[data-nav]').forEach((el) => el.addEventListener('click', () => { state.activeNav = el.dataset.nav; state.page = el.dataset.nav === 'Mensagens' ? 'messages' : el.dataset.nav === 'Fretes' ? 'freight' : el.dataset.nav === 'Fretes de retorno' ? 'returnFreight' : el.dataset.nav === 'Buscar gado' ? 'search' : 'home'; if (el.dataset.nav === 'Buscar gado') { state.collectionView = 'all'; state.query = ''; state.category = 'Todos'; state.advancedFilters = defaultAdvancedFilters(); } render(); }));
  document.querySelectorAll('[data-action="register"]').forEach((el) => el.addEventListener('click', () => { state.page = 'register'; state.toast = ''; render(); }));
  document.querySelectorAll('[data-conversation]').forEach((el) => el.addEventListener('click', () => { state.activeConversationId = Number(el.dataset.conversation); const conversation = state.messages.find((item) => item.id === state.activeConversationId); if (conversation) conversation.unread = 0; saveMessages(); render(); }));
  document.querySelector('#message-search')?.addEventListener('input', (event) => { state.messageQuery = event.target.value; render(); setTimeout(() => { const input = document.querySelector('#message-search'); input?.focus(); input?.setSelectionRange(state.messageQuery.length, state.messageQuery.length); }, 0); });
  document.querySelector('#chat-attachment')?.addEventListener('change', async (event) => { const files = Array.from(event.target.files || []); if (!files.length) return; if (files.some((file) => file.size > 10 * 1024 * 1024)) { showToast('Cada anexo deve ter no máximo 10 MB.'); return; } const conversation = state.messages.find((item) => item.id === state.activeConversationId); if (!conversation) return; const attachments = await Promise.all(files.map(fileToAttachment)); const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date()); conversation.messages.push({ from: 'me', type: 'attachment', attachments, text: `${attachments.length} anexo(s)`, time }); conversation.lastMessage = `📎 ${attachments.length} anexo(s)`; conversation.updatedAt = 'agora'; saveMessages(); render(); });
  document.querySelector('#chat-form')?.addEventListener('submit', (event) => { event.preventDefault(); const input = document.querySelector('#chat-input'); const text = input?.value.trim(); const conversation = state.messages.find((item) => item.id === state.activeConversationId); if (!text || !conversation) return; const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date()); conversation.messages.push({ from: 'me', text, time }); conversation.lastMessage = text; conversation.updatedAt = 'agora'; saveMessages(); render(); setTimeout(() => document.querySelector('#chat-input')?.focus(), 0); });
  document.querySelectorAll('[data-chat-action="attach"]').forEach((el) => el.addEventListener('click', () => document.querySelector('#chat-attachment')?.click()));
  document.querySelectorAll('[data-chat-action="record"]').forEach((el) => el.addEventListener('click', () => { if (state.recording) stopAudioRecording(); else startAudioRecording(); }));
  document.querySelectorAll('[data-chat-action="quote"]').forEach((el) => el.addEventListener('click', () => showToast('Cotação de frete vinculada à conversa.')));
  document.querySelectorAll('[data-chat-action="new"]').forEach((el) => el.addEventListener('click', () => showToast('Escolha um lote no marketplace para iniciar uma conversa.')));
  document.querySelectorAll('[data-lot]').forEach((el) => el.addEventListener('click', () => { const lot = lots.find((item) => item.id === Number(el.dataset.lot)); if (lot) { state.modalLot = lot; state.page = 'home'; state.activeNav = 'Início'; render(); } }));
  bindNotificationEvents();
}

function allTripsTemplate() {
  const trips = [...state.freightTrips].sort((a, b) => `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`));
  const totalAnimals = trips.reduce((sum, trip) => sum + (Number(trip.animals) || 0), 0);
  const scheduled = trips.filter((trip) => trip.status === 'Programada').length;
  const underway = trips.filter((trip) => trip.status === 'Em andamento').length;
  return `<section class="all-trips-panel"><div class="all-trips-heading"><div><p class="eyebrow">VISÃO CONSOLIDADA</p><h3>Todas as viagens marcadas</h3><p>Confira as operações cadastradas para analisar sua programação de fretes.</p></div><span class="panel-status">${trips.length} operação${trips.length === 1 ? '' : 'ões'}</span></div><div class="trip-analysis"><div><b>${trips.length}</b><small>Viagens</small></div><div><b>${totalAnimals}</b><small>Cabeças previstas</small></div><div><b>${scheduled}</b><small>Programadas</small></div><div><b>${underway}</b><small>Em andamento</small></div></div><div class="all-trips-list">${trips.length ? trips.map((trip) => { const date = formatShortDate(trip.date); const statusClass = trip.status === 'Em andamento' ? 'underway' : trip.status === 'Concluída' ? 'completed' : 'scheduled'; return `<article class="all-trip-row"><div class="date-box"><b>${date.day}</b><small>${date.month}</small></div><div class="all-trip-route"><strong>${escapeHtml(trip.origin)} → ${escapeHtml(trip.destination)}</strong><span>${escapeHtml(trip.carrier || 'Transportadora a selecionar')} · ${escapeHtml(trip.time || 'Horário não informado')} · ${escapeHtml(trip.animals || '0')} cabeças</span></div><em class="trip-badge ${statusClass}">${escapeHtml(trip.status || 'Programada')}</em></article>`; }).join('') : '<div class="all-trips-empty">Nenhuma viagem marcada. Cadastre a primeira operação pelo formulário ao lado.</div>'}</div></section>`;
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
  const eventsByDay = state.freightTrips.filter((trip) => trip.date.startsWith(prefix)).reduce((map, trip) => { const day = Number(trip.date.slice(-2)); map[day] = map[day] || []; map[day].push(trip); return map; }, {});
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, index) => { if (index < firstDay) return '<div class="calendar-day empty"></div>'; const day = index - firstDay + 1; const events = eventsByDay[day] || []; const isToday = year === 2026 && month === 6 && day === 27; const holidayKey = `${prefix}-${String(day).padStart(2, '0')}`; const holidayName = holidays[holidayKey]; return `<div class="calendar-day ${isToday ? 'today' : ''} ${holidayName ? 'holiday-day' : ''}" title="${holidayName ? 'Feriado nacional: ' + escapeHtml(holidayName) : ''}"><b>${day}</b>${holidayName ? `<span class="holiday-indicator">${icon('flag', 11)}<em>Feriado</em></span><small class="holiday-name">${escapeHtml(holidayName)}</small>` : ''}${events.map((trip) => `<span class="calendar-event ${trip.status === 'Em andamento' ? 'current-event' : ''}">${escapeHtml(trip.origin.split(' - ')[0])} → ${escapeHtml(trip.destination.split(' - ')[0])}</span>`).join('')}</div>`; }).join('');
  return `<div class="calendar-backdrop"><div class="calendar-dialog"><div class="calendar-dialog-head"><div><p class="eyebrow">AGENDA DE VIAGENS</p><h2>Programar frete futuro</h2><p>Escolha uma data e organize a próxima coleta.</p></div><button class="modal-close" data-freight-action="close-calendar">${icon('close', 19)}</button></div><div class="calendar-layout"><div class="calendar-view"><div class="calendar-month"><button data-calendar-nav="prev">${icon('back', 15)}</button><strong>${monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}</strong><button data-calendar-nav="next">${icon('chevron', 15)}</button></div><div class="calendar-weekdays"><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span><span>DOM</span></div><div class="calendar-grid">${cells}</div><div class="calendar-legend"><span><i class="legend-current"></i> Em andamento</span><span><i class="legend-scheduled"></i> Programada</span><span><i class="legend-today"></i> Hoje</span><span><i class="legend-holiday"></i> Feriado nacional</span></div>${monthHolidays.length ? `<div class="calendar-holiday-list"><strong>Feriados nacionais neste mês</strong>${monthHolidays.map(([holidayDate, holidayName]) => `<span>${holidayDate.slice(-2)} · ${escapeHtml(holidayName)}</span>`).join('')}</div>` : ''}</div><form id="calendar-form" class="calendar-form"><div class="calendar-form-heading"><span class="module-icon blue-bg">${icon('calendar', 19)}</span><div><h3>Nova viagem</h3><p>Os dados aparecerão na agenda.</p></div></div><label><span>Data da coleta <b>*</b></span><input name="date" type="date" min="2026-07-27" required /></label><label><span>Horário previsto</span><input name="time" type="time" value="08:00" /></label><label><span>Origem <b>*</b></span><input name="origin" placeholder="Campo Verde - MT" required /></label><label><span>Destino <b>*</b></span><input name="destination" placeholder="Goiânia - GO" required /></label><label><span>Quantidade de animais <b>*</b></span><div class="freight-unit"><input name="animals" type="number" min="1" placeholder="80" required /><em>cabeças</em></div></label><label><span>Transportadora</span><select name="carrier"><option>Transportadora Boiadeiro</option><option>AgroFrete Logística</option><option>Boiadeiro Express</option><option>A selecionar</option></select></label><button type="submit" class="primary-button">Programar viagem ${icon('arrow', 15)}</button><small class="calendar-form-note">Você poderá adicionar os documentos da viagem depois.</small></form></div>${allTripsTemplate()}</div></div>`;
}

function freightDocumentModalTemplate() {
  const trips = state.freightTrips.filter((trip) => trip.status !== 'Concluída');
  return `<div class="document-modal-backdrop"><section class="document-modal" role="dialog" aria-modal="true" aria-label="Adicionar documento"><div class="document-modal-head"><div><p class="eyebrow">GESTÃO DE DOCUMENTOS</p><h2>Adicionar documento</h2><p>Vincule o arquivo à viagem correta para manter a operação organizada.</p></div><button type="button" class="modal-close" data-freight-action="close-document">${icon('close', 19)}</button></div><form id="freight-document-form" class="document-form"><label><span>Tipo de documento <b>*</b></span><select name="type" required><option value="GTA">GTA</option><option value="CT-e">CT-e</option><option value="CDE">Comprovante de entrega</option><option value="Vacinação">Certificado de vacinação</option><option value="Exames">Exame de brucelose / tuberculose</option><option value="Outro">Outro documento</option></select></label><label><span>Viagem relacionada <b>*</b></span><select name="trip" required><option value="">Selecione a viagem</option>${trips.map((trip) => `<option value="${escapeHtml(`VIA-${String(trip.id).padStart(4, '0')} · ${trip.origin} → ${trip.destination}`)}">${escapeHtml(`${trip.origin} → ${trip.destination} · ${trip.date}`)}</option>`).join('')}</select></label><label><span>Arquivo <b>*</b></span><div class="document-upload-field"><input id="freight-document-file" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" required /><span>${icon('upload', 18)} <strong>Escolher arquivo</strong><small id="freight-document-file-name">PDF, imagem ou documento até 10 MB</small></span></div></label><div class="document-form-grid"><label><span>Validade</span><input name="expiresAt" type="date" /></label><label><span>Identificação / número</span><input name="reference" placeholder="Ex.: GTA-MT-2026-00284" /></label></div><label><span>Observações</span><textarea name="notes" rows="3" placeholder="Inclua alguma informação importante sobre o documento..."></textarea></label><div class="document-form-actions"><button type="button" class="secondary-button" data-freight-action="close-document">Cancelar</button><button type="submit" class="primary-button">Salvar documento ${icon('arrow', 15)}</button></div></form></section></div>`;
}

function getReturnLoads() {
  return state.returnLoads.filter((load) => (state.returnRegion === 'Todas' || load.region === state.returnRegion) && (state.returnCargoType === 'Todos' || load.cargoType === state.returnCargoType));
}

async function resolveReturnRoute(load) {
  const cacheKey = `gadon.route.ret.${load.id}`;
  try { const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null'); if (cached?.points?.length) { load.points = cached.points; load.roadKm = cached.roadKm; return; } } catch { /* sem cache */ }
  try {
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${load.lng},${load.lat};${load.destinationLng},${load.destinationLat}?overview=full&geometries=geojson`);
    const data = await response.json();
    const road = data.routes?.[0];
    if (road?.geometry?.coordinates?.length) {
      load.points = road.geometry.coordinates;
      load.roadKm = Math.round(road.distance / 1000);
      try { localStorage.setItem(cacheKey, JSON.stringify({ points: load.points, roadKm: load.roadKm })); } catch { /* cache indisponível */ }
      return;
    }
  } catch { /* OSRM indisponível — usa arco aproximado */ }
  load.points = routeArc([load.lng, load.lat], [load.destinationLng, load.destinationLat], -0.16);
  load.roadKm = haversineKm([load.lng, load.lat], [load.destinationLng, load.destinationLat]);
}

function mountReturnMap() {
  const container = document.querySelector('#return-map');
  if (!container) return;
  returnMapInstance = new maplibregl.Map({ container, style: radarOsmStyle(), center: [-50, -18], zoom: 4.6 });
  returnMapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
  const map = returnMapInstance;
  map.on('load', async () => {
    const loads = state.returnLoads;
    const seenCities = new Set();
    loads.forEach((load) => {
      [[[load.lng, load.lat], load.origin], [[load.destinationLng, load.destinationLat], load.destination]].forEach(([coords, label]) => {
        if (seenCities.has(label)) return;
        seenCities.add(label);
        const cityEl = document.createElement('div');
        cityEl.className = 'radar-city-dot';
        cityEl.innerHTML = `<i></i><span>${escapeHtml(label)}</span>`;
        new maplibregl.Marker({ element: cityEl, anchor: 'left' }).setLngLat(coords).addTo(map);
      });
    });
    const bounds = new maplibregl.LngLatBounds();
    loads.forEach((load) => { bounds.extend([load.lng, load.lat]); bounds.extend([load.destinationLng, load.destinationLat]); });
    map.fitBounds(bounds, { padding: window.innerWidth < 860 ? { top: 40, bottom: 40, left: 40, right: 40 } : { top: 60, bottom: 60, left: 380, right: 60 }, duration: 900 });
    await Promise.all(loads.map(resolveReturnRoute));
    if (returnMapInstance !== map) return;
    loads.forEach((load) => {
      map.addSource(`ret-${load.id}`, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: load.points } } });
      map.addLayer({ id: `ret-${load.id}-casing`, type: 'line', source: `ret-${load.id}`, layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffffff', 'line-width': 6, 'line-opacity': 0.75 } });
      map.addLayer({ id: `ret-${load.id}`, type: 'line', source: `ret-${load.id}`, layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': load.demand === 'Alta' ? '#f47a18' : '#1d6fb8', 'line-width': 3, 'line-opacity': 0.95, 'line-dasharray': [0.5, 1.6] } });
      const truckEl = document.createElement('div');
      truckEl.className = 'radar-truck volta';
      if (load.demand === 'Alta') truckEl.classList.add('alta');
      truckEl.innerHTML = icon('truck', 15);
      truckEl.addEventListener('click', () => selectReturnLoad(load.id));
      new maplibregl.Marker({ element: truckEl }).setLngLat([load.lng, load.lat]).addTo(map);
    });
  });
}

function selectReturnLoad(id) {
  state.returnSelectedLoad = id;
  const load = state.returnLoads.find((item) => item.id === id);
  if (!load) return;
  document.querySelectorAll('[data-return-load]').forEach((el) => el.classList.toggle('selected', Number(el.dataset.returnLoad) === id));
  if (returnMapInstance && load.points) {
    const mid = load.points[Math.floor(load.points.length / 2)];
    returnMapInstance.flyTo({ center: mid, zoom: 6, duration: 900 });
  }
  const detail = document.querySelector('#return-detail');
  if (detail) {
    detail.innerHTML = `<div class="radar-detail-card volta"><div class="radar-detail-head"><span class="demand-pill ${load.demand.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}">Demanda ${load.demand}</span><span class="radar-detail-status">${escapeHtml(load.eta)}</span></div><strong>${escapeHtml(load.origin)} → ${escapeHtml(load.destination)}</strong><p>${escapeHtml(load.cargoType)} · ${escapeHtml(load.carrier)}</p><div class="radar-detail-meta"><span>${icon('cow', 13)} ${escapeHtml(load.capacity)}</span><span>${icon('route', 13)} ${load.roadKm || haversineKm([load.lng, load.lat], [load.destinationLng, load.destinationLat])} km pela estrada</span><span>${icon('calendar', 13)} ${escapeHtml(load.availableAt)}</span><span class="radar-price">${formatBRL(load.price)}</span></div><div class="return-checklist"><span>${icon('check', 12)} GTA e seguro conferidos</span><span>${icon('check', 12)} Transportadora verificada</span><span>${icon('check', 12)} Rastreamento em tempo real</span></div><button type="button" class="primary-button radar-request-cta" data-return-request="${load.id}">Solicitar este retorno ${icon('arrow', 14)}</button></div>`;
    detail.querySelector('[data-return-request]')?.addEventListener('click', () => openReturnRequest(load.id));
  }
}

function openReturnRequest(id) {
  const load = state.returnLoads.find((item) => item.id === id);
  const slot = document.querySelector('#return-modal-slot');
  if (!load || !slot) return;
  slot.innerHTML = `<div class="checkout-overlay"><div class="checkout-card"><div class="checkout-head"><strong>${icon('repeat', 17)} Solicitar frete de retorno</strong><button type="button" data-return-modal-close aria-label="Fechar">${icon('close', 17)}</button></div><div class="radar-request-route"><span class="demand-pill ${load.demand.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}">Demanda ${load.demand}</span><b>${escapeHtml(load.origin)} → ${escapeHtml(load.destination)}</b><small>${escapeHtml(load.carrier)} · ${escapeHtml(load.availableAt)} · ${formatBRL(load.price)}</small></div><form id="return-request-form" class="checkout-form"><label><span>Tipo de carga</span><select name="cargoType">${returnCargoTypes.filter((type) => type !== 'Todos').map((type) => `<option ${type === load.cargoType ? 'selected' : ''}>${type}</option>`).join('')}</select></label><label><span>Quantidade / peso</span><input name="quantity" placeholder="Ex.: 40 cabeças ou 8 toneladas" required /></label><label><span>Celular / WhatsApp</span><input name="phone" type="tel" value="${escapeHtml(state.profile.phone)}" placeholder="(00) 00000-0000" /></label><button type="submit" class="primary-button">Solicitar espaço ${icon('check', 16)}</button></form></div></div>`;
  const close = () => { slot.innerHTML = ''; };
  slot.querySelector('[data-return-modal-close]')?.addEventListener('click', close);
  slot.querySelector('#return-request-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    sendLead('frete-retorno-solicitacao', { name: state.profile.name, email: state.profile.email, phone: data.phone, details: { rota: `${load.origin} → ${load.destination}`, transportadora: load.carrier, saida: load.availableAt, carga: data.cargoType, quantidade: data.quantity, valor: load.price, origemPagina: 'fretes-de-retorno' } });
    slot.innerHTML = `<div class="checkout-overlay"><div class="checkout-card checkout-success"><div class="checkout-check">${icon('check', 34)}</div><h2>Solicitação enviada!</h2><p>A <b>${escapeHtml(load.carrier)}</b> foi avisada do seu interesse no retorno <b>${escapeHtml(load.origin)} → ${escapeHtml(load.destination)}</b>. Você receberá o contato para fechar o frete.</p><button type="button" class="primary-button" data-return-modal-close>Fechar</button></div></div>`;
    slot.querySelector('[data-return-modal-close]')?.addEventListener('click', close);
  });
}

function triggerReturnAlert() {
  const load = getReturnLoads()[0] || state.returnLoads[0];
  if (!load) return;
  const body = `${load.cargoType} · ${load.origin} → ${load.destination}, ${load.availableAt.toLowerCase()}. ${load.capacity} por ${formatBRL(load.price)} — demanda ${load.demand.toLowerCase()}.`;
  state.notifications.unshift({ id: Date.now(), type: 'truck', title: 'Oportunidade de frete de retorno', source: load.origin, body, time: 'agora', unread: true });
  saveNotifications();
  try { if (typeof Notification !== 'undefined' && Notification.permission === 'granted') new Notification('GadOn · Frete de retorno disponível', { body, icon: '/gadon.jpeg' }); } catch { /* notificações indisponíveis */ }
  const slot = document.querySelector('#return-alert-slot');
  if (!slot) return;
  slot.innerHTML = `<div class="radar-alert"><span class="radar-alert-icon">${icon('repeat', 20)}</span><div class="radar-alert-copy"><strong>Oportunidade de retorno! 🚛</strong><p>${escapeHtml(body)}</p></div><div class="radar-alert-actions"><button type="button" class="radar-alert-cta" data-return-alert-request="${load.id}">Solicitar retorno</button><button type="button" class="radar-alert-skip" data-return-alert-dismiss>Agora não</button></div></div>`;
  slot.querySelector('[data-return-alert-request]')?.addEventListener('click', () => { slot.innerHTML = ''; openReturnRequest(load.id); });
  slot.querySelector('[data-return-alert-dismiss]')?.addEventListener('click', () => { slot.innerHTML = ''; });
}

function returnLoadCard(load) {
  return `<button type="button" class="radar-card volta ${state.returnSelectedLoad === load.id ? 'selected' : ''}" data-return-load="${load.id}"><div class="radar-card-top"><span class="demand-pill ${load.demand.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}">Demanda ${load.demand}</span><span class="radar-card-status">${icon('clock', 12)} ${escapeHtml(load.eta)}</span></div><strong>${escapeHtml(load.origin)} <em>→</em> ${escapeHtml(load.destination)}</strong><span class="radar-card-meta">${escapeHtml(load.cargoType)} · ${escapeHtml(load.capacity)} · ${escapeHtml(load.carrier)}</span><div class="radar-card-foot"><small>${icon('calendar', 12)} ${escapeHtml(load.availableAt)}</small><b>${formatBRL(load.price)}</b></div></button>`;
}

function returnFreightTemplate() {
  const loads = getReturnLoads();
  const highDemand = state.returnLoads.filter((load) => load.demand === 'Alta').length;
  return `<div class="radar-shell return-shell">
    <header class="radar-topbar"><button class="back-link" data-action="return-back">${icon('back', 16)} Voltar</button><div class="radar-title"><strong>${icon('repeat', 19)} Fretes de retorno</strong><span class="live-pill"><i></i> OPORTUNIDADES</span></div><div class="radar-actions"><button type="button" id="return-alert-button" class="radar-action-button ghost">${icon('bell', 15)} Alerta de oportunidade</button></div></header>
    <div class="return-filterbar"><div class="return-chips">${returnRegions.map((region) => `<button type="button" class="tab ${state.returnRegion === region ? 'selected' : ''}" data-return-region="${region}">${region}</button>`).join('')}</div><select id="return-cargo-select" class="sort-select" aria-label="Tipo de carga">${returnCargoTypes.map((type) => `<option ${state.returnCargoType === type ? 'selected' : ''}>${type}</option>`).join('')}</select><div class="return-summary"><span><b>${loads.length}</b> disponíveis</span><span class="demand-pill alta">${highDemand} alta demanda</span></div></div>
    <div class="radar-body">
      <aside class="radar-panel">
        <div class="radar-panel-head"><p class="eyebrow">CARGAS DE RETORNO</p><div class="radar-legend"><span><i class="legend-volta" style="border-color:#f47a18"></i> Alta demanda</span><span><i class="legend-volta"></i> Demais rotas</span></div></div>
        <div class="radar-cards">${loads.length ? loads.map(returnLoadCard).join('') : `<div class="radar-detail-empty">${icon('search', 22)}<p>Nenhuma carga com esses filtros.</p></div>`}</div>
        <div class="radar-detail" id="return-detail"><div class="radar-detail-empty">${icon('repeat', 22)}<p>Selecione uma carga para ver a ficha completa e solicitar o retorno.</p></div></div>
      </aside>
      <div id="return-map" class="radar-map"></div>
    </div>
    <div id="return-alert-slot"></div>
    <div id="return-modal-slot"></div>
  </div>`;
}

function bindReturnFreightEvents() {
  document.querySelector('[data-action="return-back"]')?.addEventListener('click', () => { state.page = 'home'; state.activeNav = 'Início'; render(); });
  document.querySelectorAll('[data-return-region]').forEach((el) => el.addEventListener('click', () => { state.returnRegion = el.dataset.returnRegion; render(); }));
  document.querySelector('#return-cargo-select')?.addEventListener('change', (event) => { state.returnCargoType = event.target.value; render(); });
  document.querySelectorAll('[data-return-load]').forEach((el) => el.addEventListener('click', () => selectReturnLoad(Number(el.dataset.returnLoad))));
  document.querySelector('#return-alert-button')?.addEventListener('click', () => { if (typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission(); triggerReturnAlert(); });
}

function freightDocumentListTemplate() {
  return state.freightDocuments.length ? state.freightDocuments.map((document) => `<div class="document-row"><span class="doc-type">${escapeHtml(document.type)}</span><div><strong>${escapeHtml(document.name)}</strong><small>${escapeHtml(document.trip)}${document.expiresAt ? ` · validade ${escapeHtml(document.expiresAt)}` : ''}</small></div><em class="doc-badge ${escapeHtml(document.statusClass || 'pending')}">${escapeHtml(document.status || 'Enviado')}</em><button type="button" title="Documento anexado">${icon('file', 15)}</button></div>`).join('') : '<div class="document-empty">Nenhum documento adicionado ainda.</div>';
}

function documentManagerRowTemplate(document) {
  const metadata = [document.fileName, document.uploadedAt ? `adicionado em ${document.uploadedAt}` : '', document.expiresAt ? `validade ${document.expiresAt}` : ''].filter(Boolean).join(' · ');
  return `<article class="document-manager-row"><span class="doc-type">${escapeHtml(document.type)}</span><div class="document-manager-main"><strong>${escapeHtml(document.name)}</strong><span>${escapeHtml(document.trip)}</span><small>${escapeHtml(metadata || 'Arquivo vinculado à operação')}</small>${document.notes ? `<p>${escapeHtml(document.notes)}</p>` : ''}</div><em class="doc-badge ${escapeHtml(document.statusClass || 'pending')}">${escapeHtml(document.status || 'Pendente')}</em></article>`;
}

function freightDocumentsFullTemplate() {
  const documents = state.freightDocuments;
  const issued = documents.filter((document) => document.statusClass === 'issued');
  const pending = documents.filter((document) => document.statusClass !== 'issued');
  const filtered = state.freightDocumentsView === 'all' ? documents : documents.filter((document) => (document.statusClass || 'pending') === state.freightDocumentsView);
  const tabs = [['all', 'Todos', documents.length], ['issued', 'Emitidos', issued.length], ['pending', 'Pendentes', pending.length]];
  return `<div class="document-manager-backdrop"><section class="document-manager" role="dialog" aria-modal="true" aria-label="Todos os documentos de frete"><div class="document-manager-head"><div><p class="eyebrow">GESTÃO DE DOCUMENTOS</p><h2>Todos os documentos</h2><p>Consulte o histórico emitido e acompanhe o que ainda precisa de atenção.</p></div><button type="button" class="modal-close" data-freight-action="close-all-documents">${icon('close', 19)}</button></div><div class="document-manager-summary"><div class="document-manager-stat"><span class="blue-bg">${icon('file', 16)}</span><div><strong>${documents.length}</strong><small>Total registrado</small></div></div><div class="document-manager-stat issued"><span>${icon('shield', 16)}</span><div><strong>${issued.length}</strong><small>Emitidos</small></div></div><div class="document-manager-stat pending"><span>${icon('bell', 16)}</span><div><strong>${pending.length}</strong><small>Pendentes</small></div></div></div><div class="document-manager-toolbar"><div class="document-status-tabs">${tabs.map(([value, label, count]) => `<button type="button" class="document-status-tab ${state.freightDocumentsView === value ? 'active' : ''}" data-document-view="${value}" aria-pressed="${state.freightDocumentsView === value}">${label}<b>${count}</b></button>`).join('')}</div><button type="button" class="primary-button" data-freight-action="documents">${icon('plus', 15)} Adicionar documento</button></div><div class="document-manager-list">${filtered.length ? filtered.map(documentManagerRowTemplate).join('') : '<div class="document-manager-empty">Nenhum documento nesta categoria.</div>'}</div></section></div>`;
}

function freightRoutesFullTemplate() {
  const routes = state.freightRoutes;
  const totalDistance = routes.reduce((sum, route) => sum + Number(route.distanceKm || 0), 0);
  const totalPrice = routes.reduce((sum, route) => sum + Number(route.price || 0), 0);
  const formatPrice = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  return `<div class="route-table-backdrop"><section class="route-table-modal" role="dialog" aria-modal="true" aria-label="Tabela completa de rotas contratadas"><div class="route-table-modal-head"><div><p class="eyebrow">TABELA DE DISTÂNCIA</p><h2>Rotas contratadas</h2><p>Consulte todas as operações registradas, com origem, destino, distância e preço contratado.</p></div><button type="button" class="modal-close" data-freight-action="close-routes">${icon('close', 19)}</button></div><div class="route-table-summary"><div><span>${icon('route', 16)}</span><strong>${routes.length}</strong><small>Rotas contratadas</small></div><div><span>${icon('pin', 16)}</span><strong>${totalDistance.toLocaleString('pt-BR')} km</strong><small>Distância total</small></div><div><span>${icon('file', 16)}</span><strong>${formatPrice(totalPrice)}</strong><small>Valor contratado</small></div></div><div class="route-table-scroll"><table class="full-route-table"><thead><tr><th>Origem</th><th>Destino</th><th>Distância</th><th>Preço contratado</th><th>Transportadora</th><th>Status</th></tr></thead><tbody>${routes.length ? routes.map((route) => { const statusClass = route.status === 'Em andamento' ? 'underway' : route.status === 'Contratada' ? 'contracted' : 'scheduled'; return `<tr><td>${icon('pin', 13)}<strong>${escapeHtml(route.origin)}</strong></td><td>${icon('pin', 13)}<strong>${escapeHtml(route.destination)}</strong></td><td>${Number(route.distanceKm || 0).toLocaleString('pt-BR')} km</td><td class="route-price">${formatPrice(Number(route.price || 0))}</td><td>${escapeHtml(route.carrier || 'Transportadora a selecionar')}<small>Contratada em ${escapeHtml(route.contractedAt || 'data não informada')}</small></td><td><em class="route-status-badge ${statusClass}">${escapeHtml(route.status || 'Contratada')}</em></td></tr>`; }).join('') : '<tr><td colspan="6" class="route-table-empty">Nenhuma rota contratada registrada.</td></tr>'}</tbody></table></div><div class="route-table-note">Os valores exibidos correspondem às contratações registradas no sistema e devem ser conferidos no contrato do frete.</div></section></div>`;
}

function csvRow(values) {
  return values.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(';');
}

function downloadFreightReport() {
  const generatedAt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
  const totalDistance = state.freightRoutes.reduce((sum, route) => sum + Number(route.distanceKm || 0), 0);
  const totalPrice = state.freightRoutes.reduce((sum, route) => sum + Number(route.price || 0), 0);
  const rows = [
    ['RELATÓRIO CONSOLIDADO DE FRETES'],
    ['Gerado em', generatedAt],
    [],
    ['RESUMO OPERACIONAL'],
    ['Indicador', 'Valor'],
    ['Rotas contratadas', state.freightRoutes.length],
    ['Distância total', `${totalDistance.toLocaleString('pt-BR')} km`],
    ['Valor contratado', new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)],
    ['Viagens registradas', state.freightTrips.length],
    ['Documentos registrados', state.freightDocuments.length],
    ['Documentos pendentes', state.freightDocuments.filter((document) => document.statusClass !== 'issued').length],
    [],
    ['ROTAS CONTRATADAS'],
    ['Origem', 'Destino', 'Distância', 'Preço contratado', 'Transportadora', 'Status', 'Data da contratação'],
    ...state.freightRoutes.map((route) => [route.origin, route.destination, `${route.distanceKm} km`, new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(route.price || 0)), route.carrier, route.status, route.contractedAt]),
    [],
    ['VIAGENS REGISTRADAS'],
    ['Data', 'Horário', 'Origem', 'Destino', 'Animais', 'Transportadora', 'Status'],
    ...state.freightTrips.map((trip) => [trip.date, trip.time, trip.origin, trip.destination, trip.animals, trip.carrier, trip.status]),
    [],
    ['DOCUMENTOS DE FRETE'],
    ['Tipo', 'Identificação', 'Viagem', 'Status', 'Arquivo', 'Adicionado em', 'Validade', 'Observações'],
    ...state.freightDocuments.map((document) => [document.type, document.name, document.trip, document.status || 'Pendente', document.fileName, document.uploadedAt, document.expiresAt, document.notes]),
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
  const navItems = ['Início', 'Buscar gado', 'Leilão ao vivo', 'Loja rural', 'Radar de fretes', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'];
  const navIcons = ['home', 'search', 'gavel', 'store', 'route', 'cow', 'message', 'truck', 'repeat'];
  const unread = state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
  return `<div class="app-shell freight-shell"><aside class="sidebar"><div class="brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></div><div class="profile-mini"><div class="avatar">JP</div><div><strong>João Pecuarista</strong><span>Comprador verificado</span></div><button class="icon-button">${icon('chevron', 15)}</button></div><nav class="main-nav"><p class="nav-label">MENU PRINCIPAL</p>${navItems.map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(navIcons[i])}<span>${item}</span>${item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}</button>`).join('')}<p class="nav-label nav-spacer">CONTA</p><button class="nav-item">${icon('heart')}<span>Favoritos</span></button><button class="nav-item">${icon('user')}<span>Meu perfil</span></button></nav><div class="sidebar-bottom"><div class="help-card"><div class="help-icon">?</div><div><strong>Precisa de ajuda?</strong><span>Fale com nosso suporte</span></div>${icon('chevron', 15)}</div><div class="sidebar-foot">GadOn <span>•</span> versão 1.0 MVP</div></div></aside><main class="main-content"><header class="topbar"><button class="mobile-menu icon-button">${icon('menu', 21)}</button><div class="crumb">Marketplace <span>/</span> Fretes</div><div class="top-actions"><button class="announce-button" data-action="register">${icon('plus', 15)} Habilitar lote</button><div class="notification-wrap"><button class="circle-action" data-action="notifications" aria-label="Abrir notificações">${icon('bell', 18)}${getNotificationCount() ? '<i></i>' : ''}</button>${notificationPopover()}</div><div class="top-avatar">JP</div><button class="top-user">João Pecuarista <span>⌄</span></button></div></header><div class="freight-page"><div class="freight-heading"><div><p class="eyebrow">OPERAÇÃO DE FRETE</p><h1>Frete parceiro</h1><p>Organize cotações, viagens e documentos em um único lugar.</p></div><button class="primary-button" data-freight-action="new-quote">${icon('plus', 16)} Nova cotação</button></div><section class="freight-stats"><div><span class="freight-stat-icon blue-bg">${icon('truck', 18)}</span><span><b>12</b><small>Viagens em andamento</small></span></div><div><span class="freight-stat-icon orange-bg">${icon('file', 18)}</span><span><b>6</b><small>Cotações pendentes</small></span></div><div><span class="freight-stat-icon green-bg">${icon('repeat', 18)}</span><span><b>8</b><small>Retornos disponíveis</small></span></div><div><span class="freight-stat-icon purple-bg">${icon('chart', 18)}</span><span><b>72%</b><small>Taxa de ocupação</small></span></div></section><section class="freight-modules">${[['quote','file','Painel da Cotação','Crie e compare solicitações'],['distance','route','Tabela de Distância','Rotas, km e estimativas'],['schedule','calendar','Agenda de Viagens','Coletas e entregas'],['documents','file','Gestão de Documentos','GTA, CT-e e comprovantes'],['status','pin','Status da Viagem','Acompanhe cada etapa'],['reports','chart','Relatórios','Indicadores da operação']].map(([id, ico, title, desc]) => `<button class="freight-module-card" data-freight-scroll="${id}"><span class="module-icon blue-bg">${icon(ico, 21)}</span><span><b>${title}</b><small>${desc}</small></span>${icon('chevron', 15)}</button>`).join('')}</section><div class="freight-grid"><section class="freight-panel quote-panel" id="freight-quote"><div class="freight-panel-heading"><div><p class="eyebrow">PAINEL DA COTAÇÃO</p><h2>Solicite um frete</h2></div><span class="panel-status">Nova solicitação</span></div><form id="freight-quote-form" class="quote-form"><label><span>Origem</span><input name="origin" value="Campo Verde - MT" required /></label><label><span>Destino</span><input name="destination" placeholder="Goiânia - GO" required /></label><label><span>Quantidade</span><div class="freight-unit"><input name="animals" type="number" min="1" placeholder="80" required /><em>cabeças</em></div></label><label><span>Data da coleta</span><input name="pickup" type="date" required /></label><label class="quote-full"><span>Finalidade</span><select name="purpose"><option>Engorda</option><option>Abate</option><option>Reprodução</option><option>Recria</option></select></label><button type="submit" class="primary-button quote-full">Solicitar cotações ${icon('arrow', 15)}</button></form><div class="quote-note">${icon('shield', 14)} A solicitação será encaminhada para transportadoras parceiras habilitadas.</div></section><section class="freight-panel" id="freight-distance"><div class="freight-panel-heading"><div><p class="eyebrow">TABELA DE DISTÂNCIA</p><h2>Rotas recentes</h2></div><button class="panel-link" data-freight-action="all-routes">Ver tabela completa ${icon('arrow', 14)}</button></div><div class="route-table"><div class="route-row route-head"><span>Origem → destino</span><span>Distância</span><span>Estimativa</span></div><div class="route-row"><span>${icon('route', 14)} Campo Verde - MT → Goiânia - GO</span><b>1.065 km</b><strong>R$ 6.480</strong></div><div class="route-row"><span>${icon('route', 14)} Dourados - MS → São Paulo - SP</span><b>1.020 km</b><strong>R$ 6.120</strong></div><div class="route-row"><span>${icon('route', 14)} Rondonópolis - MT → Cuiabá - MT</span><b>215 km</b><strong>R$ 2.150</strong></div></div></section><section class="freight-panel" id="freight-schedule"><div class="freight-panel-heading"><div><p class="eyebrow">AGENDA DE VIAGENS</p><h2>Próximas operações</h2></div><button class="panel-link" data-freight-action="calendar">Ver calendário ${icon('arrow', 14)}</button></div><div class="trip-list"><div class="trip-item"><div class="date-box"><b>28</b><small>JUL</small></div><div><strong>Campo Verde - MT → Goiânia - GO</strong><span>80 cabeças · Transportadora Boiadeiro</span></div><em class="trip-badge underway">Em andamento</em></div><div class="trip-item"><div class="date-box"><b>30</b><small>JUL</small></div><div><strong>Dourados - MS → São Paulo - SP</strong><span>50 cabeças · AgroFrete Logística</span></div><em class="trip-badge scheduled">Programada</em></div><div class="trip-item"><div class="date-box"><b>02</b><small>AGO</small></div><div><strong>Rondonópolis - MT → Campo Grande - MS</strong><span>40 cabeças · Boiadeiro Express</span></div><em class="trip-badge scheduled">Programada</em></div></div></section><section class="freight-panel" id="freight-documents"><div class="freight-panel-heading"><div><p class="eyebrow">GESTÃO DE DOCUMENTOS</p><h2>Documentos recentes</h2></div><div class="document-panel-actions"><button class="panel-link" data-freight-action="all-documents">Ver todos ${icon('arrow', 14)}</button><button class="panel-link" data-freight-action="documents">${icon('plus', 14)} Adicionar documento</button></div></div><div class="document-list">${freightDocumentListTemplate()}</div></section><section class="freight-panel status-panel" id="freight-status"><div class="freight-panel-heading"><div><p class="eyebrow">STATUS DA VIAGEM</p><h2>VIA-1024 em andamento</h2></div><span class="panel-status green-status"><span class="online-dot"></span> Em rota</span></div><div class="status-route"><div class="status-point done"><i>${icon('pin', 14)}</i><span><b>Campo Verde - MT</b><small>Saída registrada · 28 jul, 06:20</small></span></div><div class="status-line"><i></i></div><div class="status-point current"><i>${icon('truck', 14)}</i><span><b>Rondonópolis - MT</b><small>Última atualização · há 18 min</small></span></div><div class="status-line muted-line"><i></i></div><div class="status-point pending"><i>${icon('pin', 14)}</i><span><b>Goiânia - GO</b><small>Previsão de chegada · 29 jul, 16:00</small></span></div></div></section><section class="freight-panel reports-panel" id="freight-reports"><div class="freight-panel-heading"><div><p class="eyebrow">RELATÓRIOS</p><h2>Indicadores da operação</h2></div><button class="panel-link" data-freight-action="report">${icon('download', 14)} Exportar</button></div><div class="report-grid"><div><span>Fretes realizados</span><b>843</b><small class="positive">+10,1% este mês</small></div><div><span>Custo médio / cabeça</span><b>R$ 82,40</b><small class="positive">-8,4% com retorno</small></div><div><span>Prazo médio</span><b>1,8 dias</b><small>12 rotas avaliadas</small></div><div><span>Documentos pendentes</span><b>06</b><small class="warning">Requer atenção</small></div></div></section></div></div></main></div>${state.freightCalendarOpen ? calendarModalTemplate() : ''}${state.freightDocumentsOpen ? freightDocumentModalTemplate() : ''}${state.freightDocumentsFullOpen ? freightDocumentsFullTemplate() : ''}${state.freightRoutesOpen ? freightRoutesFullTemplate() : ''}${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}`;
}

function bindFreightEvents() {
  document.querySelectorAll('[data-nav]').forEach((el) => el.addEventListener('click', () => { state.activeNav = el.dataset.nav; state.page = el.dataset.nav === 'Mensagens' ? 'messages' : el.dataset.nav === 'Fretes' ? 'freight' : el.dataset.nav === 'Fretes de retorno' ? 'returnFreight' : 'home'; render(); }));
  document.querySelectorAll('[data-freight-scroll]').forEach((el) => el.addEventListener('click', () => document.querySelector(`#freight-${el.dataset.freightScroll}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })));
  document.querySelector('[data-action="register"]')?.addEventListener('click', () => { state.page = 'register'; state.toast = ''; render(); });
  document.querySelector('[data-freight-action="new-quote"]')?.addEventListener('click', () => document.querySelector('#freight-quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  document.querySelector('[data-freight-action="all-routes"]')?.addEventListener('click', () => { state.freightRoutesOpen = true; state.freightCalendarOpen = false; state.freightDocumentsOpen = false; render(); });
  document.querySelectorAll('[data-freight-action="close-routes"]').forEach((el) => el.addEventListener('click', () => { state.freightRoutesOpen = false; render(); }));
  document.querySelector('[data-freight-action="calendar"]')?.addEventListener('click', () => { state.freightCalendarOpen = true; render(); });
  document.querySelector('[data-freight-action="close-calendar"]')?.addEventListener('click', () => { state.freightCalendarOpen = false; render(); });
  document.querySelectorAll('[data-calendar-nav]').forEach((el) => el.addEventListener('click', () => { const direction = el.dataset.calendarNav === 'next' ? 1 : -1; const next = new Date(state.calendarYear, state.calendarMonth + direction, 1); state.calendarYear = next.getFullYear(); state.calendarMonth = next.getMonth(); render(); }));
  document.querySelector('#calendar-form')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); state.freightTrips.push({ id: Date.now(), date: data.date, time: data.time || '08:00', origin: data.origin, destination: data.destination, animals: data.animals, carrier: data.carrier, status: 'Programada' }); state.freightTrips.sort((a, b) => a.date.localeCompare(b.date)); saveFreightTrips(); state.freightCalendarOpen = false; showToast('Frete programado na agenda de viagens.'); });
  document.querySelector('#freight-quote-form')?.addEventListener('submit', (event) => { event.preventDefault(); showToast('Cotação enviada para transportadoras parceiras.'); });
  document.querySelectorAll('[data-freight-action="documents"]').forEach((el) => el.addEventListener('click', () => { state.freightDocumentsOpen = true; state.freightDocumentsFullOpen = false; state.freightCalendarOpen = false; render(); }));
  document.querySelector('[data-freight-action="all-documents"]')?.addEventListener('click', () => { state.freightDocumentsFullOpen = true; state.freightDocumentsView = 'all'; state.freightDocumentsOpen = false; state.freightCalendarOpen = false; render(); });
  document.querySelectorAll('[data-freight-action="close-all-documents"]').forEach((el) => el.addEventListener('click', () => { state.freightDocumentsFullOpen = false; render(); }));
  document.querySelectorAll('[data-document-view]').forEach((el) => el.addEventListener('click', () => { state.freightDocumentsView = el.dataset.documentView; render(); }));
  document.querySelectorAll('[data-freight-action="close-document"]').forEach((el) => el.addEventListener('click', () => { state.freightDocumentsOpen = false; render(); }));
  document.querySelector('#freight-document-file')?.addEventListener('change', (event) => { const file = event.target.files?.[0]; const label = document.querySelector('#freight-document-file-name'); if (file && label) label.textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB`; });
  document.querySelector('#freight-document-form')?.addEventListener('submit', (event) => { event.preventDefault(); const file = document.querySelector('#freight-document-file')?.files?.[0]; if (!file) return; if (file.size > 10 * 1024 * 1024) { showToast('O documento deve ter no máximo 10 MB.'); return; } const data = Object.fromEntries(new FormData(event.currentTarget).entries()); const reference = data.reference || file.name.replace(/\.[^.]+$/, ''); state.freightDocuments.unshift({ id: Date.now(), type: data.type, name: reference, trip: data.trip, status: 'Pendente', statusClass: 'pending', fileName: file.name, fileType: file.type || 'application/octet-stream', size: file.size, expiresAt: data.expiresAt || '', notes: data.notes || '', uploadedAt: new Intl.DateTimeFormat('pt-BR').format(new Date()) }); saveFreightDocuments(); state.freightDocumentsOpen = false; showToast('Documento adicionado e marcado como pendente de conferência.'); });
  document.querySelector('[data-freight-action="report"]')?.addEventListener('click', downloadFreightReport);
  bindNotificationEvents();
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
      const conversation = state.messages.find((item) => item.id === state.activeConversationId);
      if (conversation && blob.size <= 2 * 1024 * 1024) { const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date()); conversation.messages.push({ from: 'me', type: 'audio', text: 'Áudio gravado', url: await readAsDataUrl(blob), time }); conversation.lastMessage = '🎙️ Áudio'; conversation.updatedAt = 'agora'; saveMessages(); }
      state.recording = false; audioRecorder = null; audioStream = null; render();
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
    <header class="register-topbar"><div class="brand register-brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></div><div class="register-top-actions"><span class="save-status"><span class="online-dot"></span> Salvo automaticamente</span><button class="register-exit" data-action="back-home">Sair do cadastro ${icon('close', 15)}</button></div></header>
    <main class="register-content">
      <button class="back-link" data-action="back-home">${icon('back', 16)} Voltar para o marketplace</button>
      <div class="register-intro"><div><p class="eyebrow">HABILITAR LOTE · ETAPA 1 DE 1</p><h1>Cadastre os dados do seu gado.</h1><p>Preencha as informações abaixo para publicar seu lote e começar a receber contatos de compradores.</p></div><div class="progress-block"><div class="progress-label"><span>Progresso do cadastro</span><strong>25%</strong></div><div class="progress-track"><i></i></div></div></div>
      <section class="voice-panel ${state.voiceActive ? 'is-active' : ''}" id="voice-panel"><div class="voice-head"><span class="voice-mic-badge">${icon('mic', 20)}</span><div class="voice-copy"><strong>Preenchimento por voz <em>NOVO</em></strong><span>Fale os dados do lote e o formulário se preenche sozinho, em tempo real.</span></div><button type="button" id="voice-toggle" class="voice-toggle">${state.voiceActive ? `${icon('stop', 16)} Parar gravação` : `${icon('mic', 16)} Falar agora`}</button></div><div class="voice-live"><div class="voice-wave"><i></i><i></i><i></i><i></i><i></i></div><p id="voice-transcript">Ouvindo… pode falar naturalmente.</p></div><div class="voice-chips" id="voice-chips">${voiceChipsMarkup()}</div><p class="voice-example">Exemplo: “Lote de 80 machos nelore, 18 meses, 12 arrobas, 95 mil reais, para engorda, na Fazenda Santa Rita em Campo Verde, Mato Grosso”.</p></section>
      <div class="register-layout">
        <form id="cattle-form" class="registration-form">
          <section class="form-section"><div class="form-section-head"><div class="section-number">01</div><div><h2>Sobre o lote</h2><p>Conte o que está sendo ofertado.</p></div></div><div class="form-grid two"><label class="field full"><span>Nome do lote <b>*</b></span><input name="lotName" placeholder="Ex.: Nelore selecionado - Fazenda Santa Rita" required /></label><label class="field"><span>Espécie <b>*</b></span><select name="species" required><option value="">Selecione</option><option>Bovino</option><option>Bubalino</option></select></label><label class="field"><span>Finalidade do lote <b>*</b></span><select name="purpose" required><option value="">Selecione</option><option>Cria</option><option>Recria</option><option>Engorda</option><option>Abate</option><option>Reprodução</option><option>Leilão</option></select></label><label class="field"><span>Raça predominante <b>*</b></span><select name="breed" required><option value="">Selecione</option><option>Nelore</option><option>Angus</option><option>Brangus</option><option>Guzerá</option><option>Cruza industrial</option><option>Outra</option></select></label><label class="field"><span>Composição racial</span><input name="composition" placeholder="Ex.: 3/4 Nelore, 1/4 Angus" /></label></div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">02</div><div><h2>Quantidade e características</h2><p>Use dados médios do lote e informe variações nas observações.</p></div></div><div class="form-grid three"><label class="field"><span>Quantidade de animais <b>*</b></span><div class="unit-input"><input name="quantity" type="number" min="1" placeholder="80" required /><em>cabeças</em></div></label><label class="field"><span>Sexo predominante <b>*</b></span><select name="sex" required><option value="">Selecione</option><option>Machos</option><option>Fêmeas</option><option>Misto</option></select></label><label class="field"><span>Idade média</span><div class="unit-input"><input name="age" type="number" min="0" placeholder="24" /><em>meses</em></div></label><label class="field"><span>Peso médio / arrobas</span><div class="unit-input"><input name="weight" placeholder="18" /><em>@</em></div></label><label class="field"><span>Preço total do lote <b>*</b></span><div class="unit-input"><em>R$</em><input name="price" placeholder="28.000,00" required /></div></label><label class="field"><span>Data disponível para retirada</span><input name="availableAt" type="date" /></label></div><label class="field"><span>Observações sobre os animais</span><textarea name="description" rows="4" placeholder="Manejo, acabamento, condição corporal, prenhez, linhagem ou outros detalhes importantes..."></textarea></label></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">03</div><div><h2>Origem e propriedade</h2><p>Esses dados ajudam na negociação e na cotação do frete.</p></div></div><div class="form-grid two"><label class="field full"><span>Nome da propriedade / fazenda <b>*</b></span><input name="farm" placeholder="Fazenda Santa Rita" required /></label><label class="field"><span>Município <b>*</b></span><input name="city" placeholder="Campo Verde" required /></label><label class="field"><span>UF <b>*</b></span><select name="state" required><option value="">Selecione</option><option>MT</option><option>MS</option><option>GO</option><option>MG</option><option>SP</option><option>PR</option><option>BA</option><option>Outro estado</option></select></label><label class="field"><span>Cadastro / registro da propriedade</span><input name="propertyCode" placeholder="Código no órgão estadual, se aplicável" /></label><label class="field"><span>Distância aproximada até a rodovia</span><div class="unit-input"><input name="roadDistance" placeholder="12" /><em>km</em></div></label></div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">04</div><div><h2>Sanidade e rastreabilidade</h2><p>Informe o status atual. A documentação oficial será validada antes do transporte.</p></div></div><div class="form-grid two"><label class="field"><span>Situação sanitária declarada <b>*</b></span><select name="healthStatus" required><option value="">Selecione</option><option>Vacinações em dia</option><option>Em atualização</option><option>A confirmar com veterinário</option></select></label><label class="field"><span>Rastreabilidade individual</span><select name="traceability"><option value="">Selecione</option><option>Não se aplica ao lote</option><option>Identificação SISBOV</option><option>Identificação própria da fazenda</option><option>Em processo</option></select></label><label class="field"><span>GTA</span><select name="gtaStatus"><option value="">Selecione</option><option>A emitir após a negociação</option><option>Solicitada</option><option>Emitida</option><option>Não se aplica nesta etapa</option></select></label><label class="field"><span>Número do certificado / atestado</span><input name="certificate" placeholder="Se aplicável à finalidade e à UF" /></label></div><div class="health-note">${icon('shield', 17)} <div><strong>Importante para o transporte</strong><span>A GTA é o documento oficial de trânsito animal. Exames, vacinas e certificados podem variar conforme espécie, finalidade, origem, destino e regras da UF.</span></div></div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">05</div><div><h2>Fotos e documentos <i class="optional-tag">Opcional</i></h2><p>Você pode adicionar agora ou depois — nada aqui é obrigatório nesta etapa.</p></div></div><div class="upload-grid"><button type="button" class="upload-box camera-box" data-camera-action="open"><div class="upload-icon camera-upload">${icon('camera', 22)}</div><strong>Tirar fotos agora</strong><span>Use a câmera do dispositivo</span><em>Abrir câmera</em></button><label class="upload-box"><input type="file" name="photos" accept="image/*,video/*" multiple /><div class="upload-icon">${icon('upload', 22)}</div><strong>Fotos e vídeos do lote</strong><span>JPG, PNG ou MP4 · até 10 arquivos</span><em>Escolher arquivos</em></label><label class="upload-box"><input type="file" name="documents" accept=".pdf,image/*" multiple /><div class="upload-icon blue-upload">${icon('file', 22)}</div><strong>Documentos de apoio</strong><span>PDF ou imagem · até 10 MB cada</span><em>Adicionar documentos</em></label></div><div class="doc-hints"><span>${icon('file', 14)} Sugestões: comprovante de vacinação, identificação do lote, certificado ou documento da propriedade.</span><span>${icon('shield', 14)} Não publique CPF, dados bancários ou documentos com informações desnecessárias.</span></div><div class="photo-strip" data-photo-strip>${photoStripMarkup()}</div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">06</div><div><h2>Declarações</h2><p>Leia antes de habilitar o anúncio.</p></div></div><label class="check-row"><input type="checkbox" required /><span>Declaro que as informações fornecidas são verdadeiras e que tenho autorização para ofertar este lote.</span></label><label class="check-row"><input type="checkbox" required /><span>Estou ciente de que a emissão de GTA, nota fiscal e demais documentos oficiais deve ser feita pelos responsáveis e órgãos competentes.</span></label><label class="check-row"><input type="checkbox" required /><span>Concordo em não inserir dados pessoais sensíveis de terceiros no anúncio.</span></label></section>
          <div class="register-footer"><span><b>*</b> Campos obrigatórios</span><button type="button" class="secondary-button" data-action="back-home">Cancelar</button><button type="submit" class="primary-button">Habilitar lote ${icon('arrow', 15)}</button></div>
        </form>
        <aside class="register-side"><div class="side-card side-preview"><div class="side-card-head"><span class="side-card-icon">${icon('file', 17)}</span><div><p class="eyebrow">PRÉVIA DO ANÚNCIO</p><h3>O que compradores verão</h3></div></div><div class="preview-placeholder">${icon('cow', 31)}<span>Suas fotos aparecerão aqui</span></div><div class="preview-lines"><i></i><i></i><i></i></div></div><div class="side-card"><div class="side-card-head"><span class="side-card-icon orange-side">${icon('shield', 17)}</span><div><p class="eyebrow">DOCUMENTAÇÃO</p><h3>Checklist de segurança</h3></div></div><ul class="checklist"><li><span>01</span> Dados do lote e origem</li><li><span>02</span> Situação sanitária declarada</li><li><span>03</span> Documentos para conferência</li><li><span>04</span> Revisão antes de publicar</li></ul><div class="side-disclaimer">O anúncio pode ficar pendente de validação do GadOn antes de ser exibido.</div></div>${auditLogCard(state.auditLog[0])}<div class="legal-links"><strong>Consulte fontes oficiais</strong><a href="https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/cgtqa/t_nacional/gta" target="_blank" rel="noreferrer">Informações sobre GTA ${icon('arrow', 13)}</a><a href="https://www.gov.br/agricultura/pt-br/guia-de-servicos/rastreabilidade-animal" target="_blank" rel="noreferrer">Rastreabilidade / SISBOV ${icon('arrow', 13)}</a></div></aside>
      </div>
    </main>${state.cameraOpen ? cameraModalTemplate() : ''}${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}
  </div>`;
}

function auditLogCard(record) {
  if (!record) return `<div class="side-card audit-empty"><div class="side-card-head"><span class="side-card-icon">${icon('file', 17)}</span><div><p class="eyebrow">AUDITORIA DO PROCESSO</p><h3>Seu primeiro envio aparecerá aqui</h3></div></div><p>Depois de habilitar o lote, o sistema exibirá o protocolo, os eventos e o status da verificação.</p></div>`;
  return `<div class="side-card audit-card"><div class="audit-card-top"><div class="side-card-head"><span class="side-card-icon">${icon('file', 17)}</span><div><p class="eyebrow">AUDITORIA DO PROCESSO</p><h3>Último lote enviado</h3></div></div><span class="status-pill verification">Em verificação</span></div><div class="audit-protocol"><span>PROTOCOLO</span><strong>${record.id}</strong><small>${formatAuditDate(record.createdAt)}</small></div><div class="audit-lot"><strong>${record.lot.name}</strong><span>${record.lot.quantity ? `${record.lot.quantity} cabeças · ` : ''}${record.lot.breed || 'Raça não informada'}${record.lot.origin ? ` · ${record.lot.origin}` : ''}</span></div><div class="audit-timeline">${record.steps.map((step, index) => `<div class="audit-step ${step.status}"><i>${step.status === 'completed' ? '✓' : index + 1}</i><span>${step.label}${step.at ? `<small>${formatAuditDate(step.at)}</small>` : ''}</span></div>`).join('')}</div></div>`;
}

function bindRegistrationEvents() {
  document.querySelectorAll('[data-action="back-home"]').forEach((el) => el.addEventListener('click', () => { stopVoiceFill(); if (state.cameraOpen) { cameraStream?.getTracks().forEach((track) => track.stop()); cameraStream = null; state.cameraOpen = false; } state.page = state.mode === 'seller' ? 'sellerMarketplace' : 'home'; state.toast = ''; render(); }));
  document.querySelector('#cattle-form')?.addEventListener('submit', (event) => { event.preventDefault(); stopVoiceFill(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); delete data.photos; delete data.documents; sendLead('cadastro-gado', { name: state.profile.name, email: state.profile.email, phone: state.profile.phone, details: { ...data, fotosCapturadas: state.cattlePhotos.length, preenchidoPorVoz: Object.keys(state.voiceFields).length > 0 } }); saveAuditLog(createRegistrationLog(data)); state.voiceFields = {}; state.cattlePhotos = []; state.toast = 'Lote habilitado e enviado para análise.'; state.page = state.mode === 'seller' ? 'sellerMarketplace' : 'home'; render(); setTimeout(() => { state.toast = ''; render(); }, 3600); });
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

function checkoutStepperMarkup() {
  const steps = ['Entrega', 'Pagamento', 'Revisão'];
  return `<div class="checkout-stepper">${steps.map((label, index) => { const number = index + 1; const stateClass = number < state.checkoutStep ? 'done' : number === state.checkoutStep ? 'active' : ''; return `<span class="checkout-step ${stateClass}"><i>${number < state.checkoutStep ? '✓' : number}</i><b>${label}</b></span>${number < steps.length ? '<em class="step-line"></em>' : ''}`; }).join('')}</div>`;
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
    <header class="shop-topbar"><button class="back-link" data-action="shop-back">${icon('back', 16)} Voltar</button><div class="brand register-brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>Loja rural</small></div></div><div class="shop-top-actions"><button type="button" class="shop-sell-button" data-action="open-mystore">${icon('chart', 16)} Minha loja${state.userProducts.length ? ` <b class="mystore-count">${state.userProducts.length}</b>` : ''}</button><button type="button" class="shop-sell-button" data-action="open-sell">${icon('store', 16)} Vender</button><button type="button" class="shop-cart-button" data-action="open-cart">${icon('cart', 18)} Carrinho ${cartCount() ? `<b>${cartCount()}</b>` : ''}</button></div></header>
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
    sendLead('loja-produto-cadastrado', { name: state.profile.name, email: state.profile.email, phone: state.profile.phone, details: { produto: product.name, categoria: product.category, preco: product.price, unidade: product.unit } });
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
    <header class="shop-topbar"><button class="back-link" data-action="mystore-back">${icon('back', 16)} Voltar para a loja</button><div class="brand register-brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>Minha loja</small></div></div><button type="button" class="primary-button" data-action="open-sell">${icon('plus', 15)} Cadastrar produto</button></header>
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
  document.querySelectorAll('[data-land-interest]').forEach((el) => el.addEventListener('click', () => { const product = findProduct(Number(el.dataset.landInterest)); sendLead('loja-interesse-terra', { name: state.profile.name, email: state.profile.email, phone: state.profile.phone, details: { item: product?.name, valor: product?.price } }); showToast(`Interesse registrado! Um corretor parceiro entrará em contato sobre ${product?.name}.`); }));
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
    sendLead('loja-pedido', { name: data.name, email: data.email, phone: data.phone, details: { pedido: state.lastOrderId, itens: items, subtotal: cartTotal(), frete: shopDeliveryFee(), descontoPix: shopPixDiscount(), total: shopOrderTotal(), pagamento: data.payment || 'pix', entrega: data.delivery || 'entrega', endereco: `${data.address || ''}, ${data.city || ''}/${data.uf || ''}` } });
    state.profile = { ...state.profile, name: data.name || state.profile.name, email: data.email || state.profile.email, phone: data.phone || state.profile.phone };
    saveProfile();
    state.checkoutDone = true;
    render();
  });
}

let radarMapInstance = null;
let radarAnimationInterval = null;
let radarAutoAlertTimer = null;
let radarTruckMarkers = [];
let radarUserMarker = null;

function destroyRadarMap() {
  if (radarAnimationInterval) { clearInterval(radarAnimationInterval); radarAnimationInterval = null; }
  if (radarAutoAlertTimer) { clearTimeout(radarAutoAlertTimer); radarAutoAlertTimer = null; }
  radarTruckMarkers = [];
  radarUserMarker = null;
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
  radarMapInstance = new maplibregl.Map({ container, style: radarOsmStyle(), center: [-52.5, -19], zoom: 4.8 });
  radarMapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
  const map = radarMapInstance;
  map.on('load', async () => {
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
    const bounds = new maplibregl.LngLatBounds();
    radarRoutes.forEach((route) => { bounds.extend(route.from); bounds.extend(route.to); });
    map.fitBounds(bounds, { padding: window.innerWidth < 860 ? { top: 40, bottom: 40, left: 40, right: 40 } : { top: 60, bottom: 60, left: 380, right: 60 }, duration: 900 });
    await Promise.all(radarRoutes.map(resolveRoutePoints));
    if (radarMapInstance !== map) return;
    radarRoutes.forEach((route) => {
      map.addSource(`route-${route.id}`, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: route.points } } });
      map.addLayer({ id: `route-${route.id}-casing`, type: 'line', source: `route-${route.id}`, layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffffff', 'line-width': route.type === 'ida' ? 6.5 : 6, 'line-opacity': 0.75, 'line-offset': route.type === 'volta' ? 4 : 0 } });
      map.addLayer({ id: `route-${route.id}`, type: 'line', source: `route-${route.id}`, layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: route.type === 'ida' ? { 'line-color': '#f47a18', 'line-width': 3.5, 'line-opacity': 0.95 } : { 'line-color': '#1d6fb8', 'line-width': 3, 'line-opacity': 0.95, 'line-dasharray': [0.5, 1.6], 'line-offset': 4 } });
      const truckEl = document.createElement('div');
      truckEl.className = `radar-truck ${route.type}`;
      truckEl.innerHTML = icon('truck', 15);
      truckEl.addEventListener('click', () => selectRadarRoute(route.id));
      const position = route.type === 'ida' ? route.points[Math.floor((route.progress || 0) * (route.points.length - 1))] : route.from;
      const marker = new maplibregl.Marker({ element: truckEl }).setLngLat(position).addTo(map);
      radarTruckMarkers.push({ route, marker });
    });
    radarAnimationInterval = setInterval(() => {
      radarTruckMarkers.forEach((item) => {
        if (item.route.type !== 'ida' || !item.route.points) return;
        item.route.progress = (item.route.progress + 0.0009) % 1;
        item.marker.setLngLat(item.route.points[Math.floor(item.route.progress * (item.route.points.length - 1))]);
      });
    }, 120);
  });
  radarAutoAlertTimer = setTimeout(() => { if (state.page === 'radar' && !state.radarAlertShown) triggerRadarAlert(); }, 7000);
}

function selectRadarRoute(id) {
  state.radarSelected = id;
  const route = radarRoutes.find((item) => item.id === id);
  if (!route) return;
  document.querySelectorAll('[data-radar-route]').forEach((el) => el.classList.toggle('selected', Number(el.dataset.radarRoute) === id));
  if (radarMapInstance && route.points) {
    const mid = route.points[Math.floor(route.points.length / 2)];
    radarMapInstance.flyTo({ center: mid, zoom: 6, duration: 900 });
  }
  const detail = document.querySelector('#radar-detail');
  if (detail) detail.innerHTML = `<div class="radar-detail-card ${route.type}"><div class="radar-detail-head"><span class="radar-type-badge ${route.type}">${route.type === 'ida' ? 'FRETE DE IDA' : 'FRETE DE VOLTA'}</span><span class="radar-detail-status">${escapeHtml(route.status)}</span></div><strong>${escapeHtml(route.origin)} → ${escapeHtml(route.dest)}</strong><p>${escapeHtml(route.cargo)} · ${escapeHtml(route.carrier)}</p><div class="radar-detail-meta"><span>${icon('calendar', 13)} ${escapeHtml(route.departs)}</span><span>${icon('route', 13)} ${route.roadKm || haversineKm(route.from, route.to)} km pela estrada</span>${route.price ? `<span class="radar-price">${formatBRL(route.price)}</span>` : ''}</div>${route.type === 'volta' ? `<button type="button" class="primary-button radar-request-cta" data-radar-request="${route.id}">Enviar carga nesta volta ${icon('arrow', 14)}</button>` : `<div class="radar-progress"><span>Progresso da viagem</span><div class="progress-track"><i style="width:${Math.round((route.progress || 0) * 100)}%"></i></div><b>${Math.round((route.progress || 0) * 100)}%</b></div>`}</div>`;
  detail?.querySelector('[data-radar-request]')?.addEventListener('click', () => openRadarRequest(route.id));
}

function activateRadarLocation() {
  const button = document.querySelector('#radar-locate');
  if (button) { button.disabled = true; button.innerHTML = `${icon('pin', 15)} Localizando…`; }
  if (typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission();
  const finish = (coords, demo) => {
    state.userLocation = coords;
    state.userLocationDemo = demo;
    if (radarMapInstance) {
      if (radarUserMarker) radarUserMarker.remove();
      const el = document.createElement('div');
      el.className = 'radar-user-marker';
      el.innerHTML = '<i></i><span>Você</span>';
      radarUserMarker = new maplibregl.Marker({ element: el }).setLngLat(coords).addTo(radarMapInstance);
      radarMapInstance.flyTo({ center: coords, zoom: 6.4, duration: 1100 });
    }
    if (button) button.innerHTML = `${icon('check', 15)} Localização ativa${demo ? ' (demo)' : ''}`;
    setTimeout(() => { if (state.page === 'radar') triggerRadarAlert(); }, 2600);
  };
  if (!navigator.geolocation) { finish([-55.16, -15.55], true); return; }
  navigator.geolocation.getCurrentPosition(
    (position) => finish([position.coords.longitude, position.coords.latitude], false),
    () => finish([-55.16, -15.55], true),
    { enableHighAccuracy: true, timeout: 8000 },
  );
}

function triggerRadarAlert() {
  const reference = state.userLocation || [-55.16, -15.55];
  const route = [...radarRoutes].filter((item) => item.type === 'volta').sort((a, b) => haversineKm(reference, a.from) - haversineKm(reference, b.from))[0];
  if (!route) return;
  const distance = haversineKm(reference, route.from);
  const body = `Carreta de ${route.carrier} sai de ${route.origin}${state.userLocation ? ` (a ~${distance} km de você)` : ''} → ${route.dest}, ${route.departs.toLowerCase()}. ${route.cargo} na volta por ${formatBRL(route.price)}.`;
  state.radarAlertShown = true;
  state.notifications.unshift({ id: Date.now(), type: 'truck', title: 'Carga saindo da sua região', source: route.origin, body, time: 'agora', unread: true });
  saveNotifications();
  try { if (typeof Notification !== 'undefined' && Notification.permission === 'granted') new Notification('GadOn · Oportunidade de frete de volta', { body, icon: '/gadon.jpeg' }); } catch { /* notificações indisponíveis */ }
  const slot = document.querySelector('#radar-alert-slot');
  if (!slot) return;
  slot.innerHTML = `<div class="radar-alert"><span class="radar-alert-icon">${icon('truck', 20)}</span><div class="radar-alert-copy"><strong>Carga saindo da sua região! 🚨</strong><p>${escapeHtml(body)}</p></div><div class="radar-alert-actions"><button type="button" class="radar-alert-cta" data-alert-request="${route.id}">Enviar carga na volta</button><button type="button" class="radar-alert-skip" data-alert-dismiss>Agora não</button></div></div>`;
  slot.querySelector('[data-alert-request]')?.addEventListener('click', () => { slot.innerHTML = ''; openRadarRequest(route.id); });
  slot.querySelector('[data-alert-dismiss]')?.addEventListener('click', () => { slot.innerHTML = ''; });
}

function openRadarRequest(routeId) {
  const route = radarRoutes.find((item) => item.id === routeId);
  const slot = document.querySelector('#radar-modal-slot');
  if (!route || !slot) return;
  slot.innerHTML = `<div class="checkout-overlay"><div class="checkout-card"><div class="checkout-head"><strong>${icon('repeat', 17)} Solicitar frete de volta</strong><button type="button" data-radar-modal-close aria-label="Fechar">${icon('close', 17)}</button></div><div class="radar-request-route"><span class="radar-type-badge volta">VOLTA</span><b>${escapeHtml(route.origin)} → ${escapeHtml(route.dest)}</b><small>${escapeHtml(route.carrier)} · ${escapeHtml(route.departs)} · ${formatBRL(route.price)}</small></div><form id="radar-request-form" class="checkout-form"><label><span>Tipo de carga</span><select name="cargoType"><option>Gado de corte</option><option>Gado leiteiro</option><option>Bezerros</option><option>Insumos agropecuários</option><option>Grãos / ração</option></select></label><label><span>Quantidade / peso</span><input name="quantity" placeholder="Ex.: 40 cabeças ou 8 toneladas" required /></label><label><span>Celular / WhatsApp</span><input name="phone" type="tel" value="${escapeHtml(state.profile.phone)}" placeholder="(00) 00000-0000" /></label><button type="submit" class="primary-button">Solicitar espaço ${icon('check', 16)}</button></form></div></div>`;
  const close = () => { slot.innerHTML = ''; };
  slot.querySelector('[data-radar-modal-close]')?.addEventListener('click', close);
  slot.querySelector('#radar-request-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    sendLead('frete-retorno-solicitacao', { name: state.profile.name, email: state.profile.email, phone: data.phone, details: { rota: `${route.origin} → ${route.dest}`, transportadora: route.carrier, saida: route.departs, carga: data.cargoType, quantidade: data.quantity, valor: route.price } });
    slot.innerHTML = `<div class="checkout-overlay"><div class="checkout-card checkout-success"><div class="checkout-check">${icon('check', 34)}</div><h2>Solicitação enviada!</h2><p>A <b>${escapeHtml(route.carrier)}</b> foi avisada do seu interesse na volta <b>${escapeHtml(route.origin)} → ${escapeHtml(route.dest)}</b>. Você receberá o contato para fechar o frete.</p><button type="button" class="primary-button" data-radar-modal-close>Fechar</button></div></div>`;
    slot.querySelector('[data-radar-modal-close]')?.addEventListener('click', close);
  });
}

function radarRouteCard(route) {
  return `<button type="button" class="radar-card ${route.type} ${state.radarSelected === route.id ? 'selected' : ''}" data-radar-route="${route.id}"><div class="radar-card-top"><span class="radar-type-badge ${route.type}">${route.type === 'ida' ? 'IDA' : 'VOLTA'}</span><span class="radar-card-status">${route.type === 'ida' ? `${icon('truck', 12)} ${escapeHtml(route.status)}` : `${icon('repeat', 12)} ${escapeHtml(route.status)}`}</span></div><strong>${escapeHtml(route.origin)} <em>→</em> ${escapeHtml(route.dest)}</strong><span class="radar-card-meta">${escapeHtml(route.cargo)}</span><div class="radar-card-foot"><small>${icon('calendar', 12)} ${escapeHtml(route.departs)}</small>${route.price ? `<b>${formatBRL(route.price)}</b>` : `<small>${Math.round((route.progress || 0) * 100)}% da rota</small>`}</div></button>`;
}

function radarTemplate() {
  return `<div class="radar-shell">
    <header class="radar-topbar"><button class="back-link" data-action="radar-back">${icon('back', 16)} Voltar</button><div class="radar-title"><strong>${icon('route', 19)} Radar de Fretes</strong><span class="live-pill"><i></i> TEMPO REAL</span></div><div class="radar-actions"><button type="button" id="radar-locate" class="radar-action-button">${icon('pin', 15)} Ativar minha localização</button><button type="button" id="radar-simulate" class="radar-action-button ghost">${icon('bell', 15)} Simular alerta</button></div></header>
    <div class="radar-body">
      <aside class="radar-panel">
        <div class="radar-panel-head"><p class="eyebrow">ROTAS ATIVAS AGORA</p><div class="radar-legend"><span><i class="legend-ida"></i> Ida em trânsito</span><span><i class="legend-volta"></i> Volta disponível</span></div></div>
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
  document.querySelector('[data-action="radar-back"]')?.addEventListener('click', () => { state.page = 'home'; state.activeNav = 'Início'; render(); });
  document.querySelector('#radar-locate')?.addEventListener('click', activateRadarLocation);
  document.querySelector('#radar-simulate')?.addEventListener('click', () => { if (typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission(); triggerRadarAlert(); });
  document.querySelectorAll('[data-radar-route]').forEach((el) => el.addEventListener('click', () => selectRadarRoute(Number(el.dataset.radarRoute))));
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
  if (state.auctionUserBids === 1) sendLead('leilao-lance', { name: state.profile.name, email: state.profile.email, phone: state.profile.phone, details: { lote: currentAuctionLot().name, lance: state.auctionBid } });
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
  sendLead('leilao-transmissao', { name: state.profile.name, email: state.profile.email, phone: state.profile.phone, details: { lote: state.userAuctionLot.name, lanceInicial: startBid } });
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
    <header class="auction-topbar"><button class="back-link auction-back" data-action="auction-back">${icon('back', 16)} Voltar</button><div class="auction-brand"><img src="/gadon-logo-transparent.png" alt="GadOn" /><span>LEILÃO OFICIAL</span></div><div class="auction-live-meta">${state.userAuctionLot ? `<button type="button" class="broadcast-button is-live" data-action="stop-broadcast">${icon('stop', 14)} Encerrar transmissão</button>` : `<button type="button" class="broadcast-button" data-action="open-broadcast">${icon('camera', 14)} Leiloar meu lote</button>`}<span class="auction-viewers">${icon('eye', 15)} <b id="auction-viewers">${state.auctionViewers}</b> assistindo</span><span class="live-pill"><i></i> AO VIVO</span></div></header>
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

function bindLotEvents() {
  document.querySelectorAll('[data-favorite]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); const id = Number(el.dataset.favorite); state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id); saveFavorites(); render(); }));
  document.querySelectorAll('[data-select-lot]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); const id = Number(el.dataset.selectLot); state.selectedLots.has(id) ? state.selectedLots.delete(id) : state.selectedLots.add(id); render(); }));
  document.querySelectorAll('[data-lot]').forEach((el) => el.addEventListener('click', () => { const lot = lots.find((item) => item.id === Number(el.dataset.lot)); if (!lot) return; state.modalLot = lot; state.modalTab = 'description'; state.modalMediaIndex = 0; state.lotHistory = [lot.id, ...state.lotHistory.filter((id) => id !== lot.id)].slice(0, 10); saveLotHistory(); render(); }));
}

function showToast(message) { state.toast = message; render(); setTimeout(() => { state.toast = ''; render(); }, 3200); }

document.addEventListener('click', (event) => {
  const profileShortcut = event.target.closest('.profile-mini:not(.profile-mini-button)');
  if (profileShortcut) { state.activeNav = 'Meu perfil'; state.collectionView = 'all'; state.modalLot = null; state.page = 'profile'; render(); return; }
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.nav) {
    state.activeNav = button.dataset.nav;
    if (button.dataset.nav === 'Mensagens') state.page = 'messages';
    else if (button.dataset.nav === 'Fretes') state.page = 'freight';
    else if (button.dataset.nav === 'Fretes de retorno') state.page = 'returnFreight';
    else if (button.dataset.nav === 'Buscar gado') { state.page = 'search'; state.collectionView = 'all'; state.query = ''; state.category = 'Todos'; state.advancedFilters = defaultAdvancedFilters(); }
    else if (button.dataset.nav === 'Leilão ao vivo') state.page = 'auction';
    else if (button.dataset.nav === 'Loja rural') state.page = 'shop';
    else if (button.dataset.nav === 'Radar de fretes') state.page = 'radar';
    else if (button.dataset.nav === 'Meus anúncios' || button.dataset.nav === 'Meus produtos') state.page = state.mode === 'seller' ? 'sellerMarketplace' : 'announcements';
    else if (button.dataset.nav === 'Anunciar gado') state.page = 'register';
    else if (button.dataset.nav === 'Painel vendedor' || button.dataset.nav === 'Promoções') state.page = 'sellerMarketplace';
    else state.page = 'home';
    render();
    return;
  }
  if (button.dataset.accountPage) return;
  const accountPage = button.dataset.accountPage || (button.textContent || '').trim();
  if (!accountPage || (!accountPage.startsWith('Favoritos') && !accountPage.startsWith('Meu perfil'))) return;
  state.activeNav = accountPage.startsWith('Favoritos') ? 'Favoritos' : 'Meu perfil';
  state.collectionView = 'all';
  state.modalLot = null;
  state.page = accountPage.startsWith('Favoritos') ? 'favorites' : 'profile';
  render();
});

applyTheme();
render();

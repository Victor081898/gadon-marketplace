import './styles.css';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const lots = [
  { id: 1, name: 'Nelore selecionado', meta: '80 machos · 12@', weight: 12, price: 'R$ 28.000', unit: 'R$ 2.333,33 / cabeça', place: 'Campo Verde - MT', category: 'Nelore', sex: 'Machos', age: '18 a 24 meses', ageMonths: 21, purpose: 'Engorda', seller: 'Fazenda Santa Rita', image: 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=900&q=85', accent: 'blue' },
  { id: 2, name: 'Angus premium', meta: '50 fêmeas · 10@', weight: 10, price: 'R$ 23.500', unit: 'R$ 2.350,00 / cabeça', place: 'Dourados - MS', category: 'Angus', sex: 'Fêmeas', age: '20 a 28 meses', ageMonths: 24, purpose: 'Reprodução', seller: 'Agro Boa Vista', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=85', accent: 'orange' },
  { id: 3, name: 'Nelore matriz', meta: '120 matrizes · 15@', weight: 15, price: 'R$ 45.600', unit: 'R$ 2.280,00 / cabeça', place: 'Aparecida do Taboado - MS', category: 'Nelore', sex: 'Fêmeas', age: '24 a 36 meses', ageMonths: 30, purpose: 'Reprodução', seller: 'Fazenda JP', image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=900&q=85', accent: 'green' },
  { id: 4, name: 'Cruza industrial', meta: '60 machos · 10@', weight: 10, price: 'R$ 19.800', unit: 'R$ 1.980,00 / cabeça', place: 'Goiânia - GO', category: 'Cruza', sex: 'Machos', age: '16 a 22 meses', ageMonths: 19, purpose: 'Engorda', seller: 'Fazenda São Miguel', image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=900&q=85', accent: 'purple' },
  { id: 5, name: 'Bezerros Nelore', meta: '40 machos · 8@', weight: 8, price: 'R$ 11.000', unit: 'R$ 2.750,00 / cabeça', place: 'Rondonópolis - MT', category: 'Bezerros', sex: 'Machos', age: '8 a 12 meses', ageMonths: 10, purpose: 'Recria', seller: 'Fazenda Horizonte', image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=900&q=85', accent: 'blue' },
  { id: 6, name: 'Lote de reposição', meta: '30 fêmeas · 8@', weight: 8, price: 'R$ 6.900', unit: 'R$ 2.300,00 / cabeça', place: 'Campo Grande - MS', category: 'Outros', sex: 'Fêmeas', age: '12 a 18 meses', ageMonths: 15, purpose: 'Recria', seller: 'Estância Boa Água', image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=900&q=85', accent: 'orange' },
];

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
  return `<div class="app-shell search-shell"><aside class="sidebar"><div class="brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></div><div class="profile-mini"><div class="avatar">JP</div><div><strong>João Pecuarista</strong><span>Comprador verificado</span></div><button class="icon-button">${icon('chevron', 15)}</button></div><nav class="main-nav"><p class="nav-label">MENU PRINCIPAL</p>${['Início', 'Buscar gado', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'].map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(['home','search','cow','message','truck','repeat'][i])}<span>${item}</span>${item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}</button>`).join('')}<p class="nav-label nav-spacer">CONTA</p><button class="nav-item">${icon('heart')}<span>Favoritos</span>${state.favorites.size ? `<b>${state.favorites.size}</b>` : ''}</button><button class="nav-item">${icon('user')}<span>Meu perfil</span></button></nav><div class="sidebar-bottom"><div class="help-card"><div class="help-icon">?</div><div><strong>Precisa de ajuda?</strong><span>Fale com nosso suporte</span></div>${icon('chevron', 15)}</div><div class="sidebar-foot">GadOn <span>•</span> versão 1.0 MVP</div></div></aside><main class="main-content"><header class="topbar"><button class="mobile-menu icon-button">${icon('menu', 21)}</button><div class="crumb">Marketplace <span>/</span> Buscar gado</div><div class="top-actions"><button class="announce-button" data-action="register">${icon('plus', 15)} Habilitar lote</button><div class="notification-wrap"><button class="circle-action" data-action="notifications" aria-label="Abrir notificações">${icon('bell', 18)}${getNotificationCount() ? '<i></i>' : ''}</button>${notificationPopover()}</div><div class="top-avatar">JP</div><button class="top-user">João Pecuarista <span>⌄</span></button></div></header><div class="search-page ${!state.query.trim() && state.category === 'Todos' && activeFilterCount() === 0 ? 'search-page-empty' : ''}"><div class="search-page-heading"><div><p class="eyebrow">PESQUISA DE GADO</p><h1>Encontre a raça ideal para sua compra.</h1><p>Pesquise pelo nome da raça, veja os lotes disponíveis e selecione os animais para iniciar uma negociação.</p></div><span class="search-result-pill">${results.length} ${results.length === 1 ? 'lote encontrado' : 'lotes encontrados'}</span></div><section class="breed-search-panel"><div class="search-empty-hero">${icon('search', 48)}<p class="eyebrow">BUSCAR GADO</p><h2>Qual raça você procura?</h2><p>Digite o nome de uma raça para começar a pesquisa.</p></div><form id="breed-search-form" class="breed-search-form"><div class="breed-search-input">${icon('search', 19)}<input id="breed-search" value="${escapeHtml(state.query)}" placeholder="Digite o nome da raça: Nelore, Angus..." autocomplete="off" /><button type="button" data-action="search-clear" aria-label="Limpar pesquisa">${icon('close', 15)}</button></div><button type="submit" class="primary-button">Buscar gado ${icon('arrow', 15)}</button></form><div class="search-suggestions"><span>Raças populares</span>${breeds.map((breed) => `<button type="button" class="breed-chip ${state.category === breed && !state.query ? 'selected' : ''}" data-search-category="${escapeHtml(breed)}">${escapeHtml(breed)} <small>${lots.filter((lot) => lot.category === breed).length}</small></button>`).join('')}</div></section><div class="search-results-heading"><div><p class="eyebrow">CATÁLOGO DISPONÍVEL</p><h2>${state.query ? `Resultados para “${escapeHtml(state.query)}”` : 'Todos os lotes'}</h2></div><div class="search-results-actions"><button class="filter-button" data-action="filters">${icon('filter', 16)} Filtros <span>${activeFilterCount()}</span></button><select class="sort-select" id="lot-sort" aria-label="Ordenar resultados"><option value="relevance" ${state.sort === 'relevance' ? 'selected' : ''}>Mais relevantes</option><option value="recent" ${state.sort === 'recent' ? 'selected' : ''}>Mais recentes</option><option value="price-low" ${state.sort === 'price-low' ? 'selected' : ''}>Menor preço</option><option value="weight-high" ${state.sort === 'weight-high' ? 'selected' : ''}>Maior peso</option></select></div></div><div class="lots-grid search-results-grid">${results.length ? results.map(lotCard).join('') : `<div class="empty-state search-empty-state">Nenhum lote encontrado para essa pesquisa.<br><button type="button" class="secondary-button" data-action="search-clear">Limpar pesquisa</button></div>`}</div></div></main></div>${selectionBarTemplate()}${state.modalLot ? marketplaceModalTemplate(state.modalLot) : ''}${state.filterOpen ? filterDrawerTemplate() : ''}${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}`;
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
  return `<div class="register-reference-shell"><main class="register-reference-card"><section class="register-reference-form-panel"><header class="register-reference-header"><div class="register-reference-brand"><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div><nav><button type="button" class="register-reference-nav active">Início</button><button type="button" class="register-reference-nav" data-auth-action="back-login">Entrar</button></nav></header><div class="register-reference-copy"><p>COMECE AGORA</p><h1>Criar nova conta<span>.</span></h1><span>Já tem uma conta? <button type="button" data-auth-action="back-login">Entrar</button></span></div>${state.authError ? `<div class="auth-error register-reference-error" role="alert">${icon('bell', 15)} ${escapeHtml(state.authError)}</div>` : ''}<form id="account-registration-reference-form" class="register-reference-form"><div class="register-reference-fields"><label><span>Nome</span><div>${icon('user', 17)}<input name="name" autocomplete="given-name" placeholder="Seu nome" required maxlength="60" /></div></label><label><span>Sobrenome</span><div>${icon('user', 17)}<input name="surname" autocomplete="family-name" placeholder="Seu sobrenome" required maxlength="80" /></div></label><label class="register-reference-full"><span>E-mail</span><div>${icon('mail', 17)}<input name="email" type="email" autocomplete="email" placeholder="seu@email.com" required /></div></label><label class="register-reference-full"><span>Senha</span><div class="register-reference-password">${icon('lock', 17)}<input id="reference-password" name="password" type="password" autocomplete="new-password" placeholder="••••••••" minlength="6" required /><button type="button" data-auth-action="toggle-password" aria-label="Mostrar senha">${icon('eye', 17)}</button></div></label></div><label class="register-reference-terms"><input name="terms" type="checkbox" required /><span>Eu concordo com os <a href="#" data-auth-action="terms">Termos de Uso</a> e a <a href="#" data-auth-action="privacy">Política de Privacidade</a>.</span></label><div class="register-reference-actions"><button type="button" class="google-button" data-auth-action="google"><span>G</span> Criar com Google</button><button type="submit" class="register-reference-submit">Criar conta ${icon('arrow', 17)}</button></div><div class="register-reference-security">${icon('shield', 19)} <span>Seus dados estão protegidos com segurança de ponta.</span></div></form></section><section class="register-reference-visual" style="--reference-cattle-image:url('${heroImage}')"><div class="register-reference-curve"></div><div class="register-reference-cow-badge">${icon('cow', 30)}</div><div class="register-reference-visual-logo"><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></section></main></div>`;
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
}

function bindAccountRegistrationEvents() {
  document.querySelectorAll('[data-auth-action="back-login"]').forEach((el) => el.addEventListener('click', () => { state.authError = ''; state.page = 'login'; render(); }));
  document.querySelector('#account-registration-reference-form')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); if (data.password.length < 6) { state.authError = 'A senha precisa ter pelo menos 6 caracteres.'; render(); return; } state.profile = { ...state.profile, name: `${data.name.trim()} ${data.surname.trim()}`.trim(), email: data.email.trim(), phone: '', avatar: '', passwordChangedAt: null }; saveProfile(); state.authenticated = true; state.authError = ''; state.page = 'home'; saveAuth(true); render(); });
  document.querySelector('[data-auth-action="toggle-password"]')?.addEventListener('click', (event) => { const input = document.querySelector('#reference-password'); if (!input) return; input.type = input.type === 'password' ? 'text' : 'password'; event.currentTarget.setAttribute('aria-label', input.type === 'password' ? 'Mostrar senha' : 'Ocultar senha'); });
  document.querySelector('[data-auth-action="google"]')?.addEventListener('click', () => { state.authError = 'A criação com Google será conectada ao serviço de autenticação.'; render(); });
  document.querySelectorAll('[data-auth-action="terms"],[data-auth-action="privacy"]').forEach((el) => el.addEventListener('click', (event) => event.preventDefault()));
}

function accountSidebarTemplate(activePage) {
  const unread = state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
  const isSeller = state.mode === 'seller';
  const navItems = isSeller ? ['Painel vendedor', 'Meus produtos', 'Anunciar gado', 'Promoções'] : ['Início', 'Buscar gado', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'];
  const navIcons = isSeller ? ['home', 'bag', 'cow', 'chart'] : ['home', 'search', 'cow', 'message', 'truck', 'repeat'];
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
  const navItems = isSeller ? ['Painel vendedor', 'Meus produtos', 'Anunciar gado', 'Promoções'] : ['Início', 'Buscar gado', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'];
  const navIcons = isSeller ? ['home', 'bag', 'cow', 'chart'] : ['home', 'search', 'cow', 'message', 'truck', 'repeat'];
  const unread = state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
  return `<div class="mobile-drawer-backdrop ${state.mobileMenuOpen ? 'is-open' : ''}" data-mobile-menu-close></div><aside class="mobile-drawer ${state.mobileMenuOpen ? 'is-open' : ''}" aria-label="Menu principal" aria-hidden="${state.mobileMenuOpen ? 'false' : 'true'}"><div class="mobile-drawer-head"><div><p class="eyebrow">NAVEGAÇÃO</p><h2>Menu GadOn</h2></div><button type="button" class="mobile-drawer-close" data-mobile-menu-close aria-label="Fechar menu">${icon('close', 19)}</button></div><button type="button" class="mobile-drawer-profile" data-account-page="${isSeller ? 'sellerProfile' : 'profile'}"><span class="mobile-drawer-avatar">${escapeHtml(initials || 'JP')}</span><span><strong>${escapeHtml(state.profile.name)}</strong><small>${isSeller ? 'Vendedor em preparação' : 'Comprador verificado'}</small></span>${icon('chevron', 16)}</button><nav class="mobile-drawer-nav"><p class="mobile-drawer-label">${isSeller ? 'CENTRAL DE VENDAS' : 'MENU PRINCIPAL'}</p>${navItems.map((item, i) => `<button type="button" class="mobile-drawer-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(navIcons[i], 18)}<span>${item}</span>${!isSeller && item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}</button>`).join('')}<p class="mobile-drawer-label">CONTA</p>${isSeller ? `<button type="button" class="mobile-drawer-item ${state.page === 'sellerProfile' ? 'active' : ''}" data-account-page="sellerProfile">${icon('user', 18)}<span>Perfil vendedor</span></button>` : `<button type="button" class="mobile-drawer-item ${state.page === 'favorites' ? 'active' : ''}" data-account-page="favorites">${icon('heart', 18)}<span>Favoritos</span>${state.favorites.size ? `<b>${state.favorites.size}</b>` : ''}</button><button type="button" class="mobile-drawer-item ${state.page === 'profile' ? 'active' : ''}" data-account-page="profile">${icon('user', 18)}<span>Meu perfil</span></button>`}<button type="button" class="mobile-drawer-item mode-switch-drawer" data-profile-mode="${isSeller ? 'buyer' : 'seller'}">${icon('repeat', 18)}<span>${isSeller ? 'Trocar para comprador' : 'Ativar perfil vendedor'}</span></button><p class="mobile-drawer-label">PREFERÊNCIAS</p><button type="button" class="mobile-drawer-item mobile-theme-action" data-action="mobile-theme">${icon(state.darkMode ? 'sun' : 'moon', 18)}<span>${state.darkMode ? 'Modo claro' : 'Modo escuro'}</span><i>${state.darkMode ? 'Ativo' : 'Inativo'}</i></button><button type="button" class="mobile-drawer-item mobile-logout-action" data-action="logout">${icon('logout', 18)}<span>Sair da conta</span></button></nav><p class="mobile-drawer-foot">GadOn <span>•</span> O mercado do Gado</p></aside>`;
}

function mountMobileMenu() {
  if (!state.authenticated) return;
  if (state.freightSimulationOpen) {
    document.querySelector('#app')?.insertAdjacentHTML('beforeend', freightSimulationModalTemplate());
    bindFreightSimulationEvents();
  }
  document.querySelector('#app')?.insertAdjacentHTML('beforeend', `<button type="button" class="global-profile-mode" data-profile-mode="${state.mode === 'seller' ? 'buyer' : 'seller'}">${icon('repeat', 14)} ${state.mode === 'seller' ? 'Perfil comprador' : 'Perfil vendedor'}</button>`);
  document.querySelector('.global-profile-mode')?.addEventListener('click', (event) => { event.stopPropagation(); switchProfileMode(event.currentTarget.dataset.profileMode); });
  if (!document.querySelector('.mobile-menu')) return;
  document.querySelector('#app')?.insertAdjacentHTML('beforeend', mobileMenuTemplate());
  document.querySelectorAll('.mobile-menu').forEach((el) => el.addEventListener('click', () => { state.mobileMenuOpen = true; render(); }));
  document.querySelectorAll('[data-mobile-menu-close]').forEach((el) => el.addEventListener('click', () => { state.mobileMenuOpen = false; render(); }));
  document.querySelectorAll('.mobile-drawer [data-nav]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); const item = el.dataset.nav; state.activeNav = item; state.page = item === 'Mensagens' ? 'messages' : item === 'Fretes' ? 'freight' : item === 'Fretes de retorno' ? 'returnFreight' : item === 'Buscar gado' ? 'search' : item === 'Meus anúncios' ? 'announcements' : item === 'Meus produtos' || item === 'Painel vendedor' || item === 'Promoções' ? 'sellerMarketplace' : item === 'Anunciar gado' ? 'register' : 'home'; if (item === 'Buscar gado') { state.collectionView = 'all'; state.query = ''; state.category = 'Todos'; state.advancedFilters = defaultAdvancedFilters(); } state.mobileMenuOpen = false; render(); }));
  document.querySelectorAll('.mobile-drawer [data-account-page]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); const page = el.dataset.accountPage; if (page === 'sellerProfile') { state.mode = 'seller'; saveMode(); syncSellerIdentity(); saveSellerProfile(); state.activeNav = 'Perfil vendedor'; } else { state.activeNav = page === 'favorites' ? 'Favoritos' : 'Meu perfil'; state.collectionView = 'all'; } state.collectionView = 'all'; state.modalLot = null; state.mobileMenuOpen = false; state.page = page; render(); }));
  document.querySelectorAll('.mobile-drawer [data-profile-mode]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); switchProfileMode(el.dataset.profileMode); }));
  document.querySelectorAll('[data-action="mobile-theme"]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); state.darkMode = !state.darkMode; saveDarkMode(state.darkMode); state.mobileMenuOpen = true; applyTheme(); render(); }));
  document.querySelectorAll('.mobile-drawer [data-action="logout"]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); logout(); }));
}

function accountShellTemplate(activePage, crumb, content) {
  return `<div class="app-shell account-shell">${accountSidebarTemplate(activePage)}<main class="main-content">${accountTopbarTemplate(crumb)}${content}</main></div><button type="button" class="account-logout-button" data-action="logout">${icon('logout', 15)} Sair da conta</button>${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}`;
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
  document.querySelector('[data-account-page="profile"]')?.addEventListener('click', (event) => { event.preventDefault(); event.stopImmediatePropagation(); switchProfileMode('buyer'); });
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
  const toggle = document.querySelector('#theme-toggle');
  if (!toggle) return;
  toggle.innerHTML = `${icon(state.darkMode ? 'sun' : 'moon', 16)}<span>${state.darkMode ? 'Modo claro' : 'Modo escuro'}</span>`;
  toggle.setAttribute('aria-label', state.darkMode ? 'Ativar modo claro' : 'Ativar modo escuro');
  toggle.setAttribute('aria-pressed', String(state.darkMode));
}

function render() {
  destroyReturnMap();
  if (!state.authenticated) {
    document.querySelector('#app').innerHTML = state.page === 'accountRegister' ? accountRegistrationReferenceTemplate() : loginReferenceTemplate();
    document.querySelector('.register-reference-card')?.insertAdjacentHTML('beforeend', registerReferenceDividerTemplate());
    if (state.page === 'accountRegister') bindAccountRegistrationEvents();
    else bindLoginEvents();
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
    enhanceReturnMap();
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
          ${['Início', 'Buscar gado', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'].map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(['home','search','cow','message','truck','repeat'][i])}<span>${item}</span>${item === 'Mensagens' && state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0) ? `<b>${state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0)}</b>` : ''}</button>`).join('')}
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
    <aside class="sidebar"><div class="brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></div><div class="profile-mini"><div class="avatar">JP</div><div><strong>João Pecuarista</strong><span>Comprador verificado</span></div><button class="icon-button">${icon('chevron', 15)}</button></div><nav class="main-nav"><p class="nav-label">MENU PRINCIPAL</p>${['Início', 'Buscar gado', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'].map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(['home','search','cow','message','truck','repeat'][i])}<span>${item}</span>${item === 'Mensagens' && unreadCount ? `<b>${unreadCount}</b>` : ''}</button>`).join('')}<p class="nav-label nav-spacer">CONTA</p><button class="nav-item">${icon('heart')}<span>Favoritos</span></button><button class="nav-item">${icon('user')}<span>Meu perfil</span></button></nav><div class="sidebar-bottom"><div class="help-card"><div class="help-icon">?</div><div><strong>Precisa de ajuda?</strong><span>Fale com nosso suporte</span></div>${icon('chevron', 15)}</div><div class="sidebar-foot">GadOn <span>•</span> versão 1.0 MVP</div></div></aside>
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

function returnLoadCardTemplate(load) {
  const selected = state.returnSelectedLoad === load.id;
  const demandClass = load.demand === 'Alta' ? 'high' : load.demand === 'Média' ? 'medium' : 'low';
  return `<article class="return-load-card ${selected ? 'selected' : ''}" data-return-load-card="${load.id}"><div class="return-load-card-top"><span class="return-load-type">${icon('repeat', 13)} ${escapeHtml(load.cargoType)}</span><em class="demand-badge ${demandClass}">${escapeHtml(load.demand)} demanda</em></div><button type="button" class="return-load-route" data-return-load-card="${load.id}"><span>${icon('pin', 15)}<strong>${escapeHtml(load.origin)}</strong></span><i>${icon('arrow', 14)}</i><span>${icon('pin', 15)}<strong>${escapeHtml(load.destination)}</strong></span></button><div class="return-load-facts"><div><small>Capacidade</small><b>${escapeHtml(load.capacity)}</b></div><div><small>Disponível</small><b>${escapeHtml(load.availableAt)}</b></div><div><small>Transportadora</small><b>${escapeHtml(load.carrier)}</b></div></div><div class="return-load-card-foot"><div><small>Frete estimado</small><strong>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(load.price)}</strong><span>${escapeHtml(load.eta)}</span></div><button type="button" class="primary-button" data-return-action="request" data-return-request="${load.id}">Solicitar retorno ${icon('arrow', 14)}</button></div></article>`;
}

function returnMapPopupTemplate(load) {
  return `<div class="return-map-popup" role="dialog" aria-label="Detalhes da carga selecionada"><button type="button" class="return-map-popup-close" data-return-map-popup-close aria-label="Fechar detalhes">${icon('close', 14)}</button><p class="eyebrow">CARGA PRÓXIMA DE FINALIZAR</p><strong>${escapeHtml(load.origin)} → ${escapeHtml(load.destination)}</strong><span>${escapeHtml(load.cargoType)} · ${escapeHtml(load.capacity)}</span><small>${escapeHtml(load.carrier)} · ${escapeHtml(load.eta)}</small><button type="button" class="primary-button" data-return-action="request" data-return-request="${load.id}">Solicitar retorno ${icon('arrow', 13)}</button></div>`;
}

function returnFreightTemplate() {
  const loads = getReturnLoads();
  const unread = state.messages.reduce((sum, conversation) => sum + (conversation.unread || 0), 0);
  const selectedLoad = loads.find((load) => load.id === state.returnSelectedLoad) || loads[0];
  const popupLoad = loads.find((load) => load.id === state.returnPopupLoad);
  const markerTemplate = (load) => `<g class="map-marker ${state.returnSelectedLoad === load.id ? 'selected' : ''}" data-return-marker="${load.id}" role="button" tabindex="0" aria-label="${escapeHtml(`${load.origin} para ${load.destination}`)}" transform="translate(${load.x} ${load.y})"><circle class="marker-shadow" cx="0" cy="8" r="14"/><path class="marker-pin" d="M0-17c-8 0-14 6-14 14 0 10 14 23 14 23S14 7 14-3C14-11 8-17 0-17Z"/><circle class="marker-core" cx="0" cy="-3" r="5"/><text x="18" y="1">${escapeHtml(load.origin.split(' - ')[0])}</text></g>`;
  return `<div class="app-shell return-freight-shell"><aside class="sidebar"><div class="brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></div><div class="profile-mini"><div class="avatar">JP</div><div><strong>João Pecuarista</strong><span>Comprador verificado</span></div><button class="icon-button">${icon('chevron', 15)}</button></div><nav class="main-nav"><p class="nav-label">MENU PRINCIPAL</p>${['Início', 'Buscar gado', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'].map((item, i) => `<button class="nav-item ${state.activeNav === item ? 'active' : ''}" data-nav="${item}">${icon(['home','search','cow','message','truck','repeat'][i])}<span>${item}</span>${item === 'Mensagens' && unread ? `<b>${unread}</b>` : ''}</button>`).join('')}<p class="nav-label nav-spacer">CONTA</p><button class="nav-item">${icon('heart')}<span>Favoritos</span></button><button class="nav-item">${icon('user')}<span>Meu perfil</span></button></nav><div class="sidebar-bottom"><div class="help-card"><div class="help-icon">?</div><div><strong>Precisa de ajuda?</strong><span>Fale com nosso suporte</span></div>${icon('chevron', 15)}</div><div class="sidebar-foot">GadOn <span>•</span> versão 1.0 MVP</div></div></aside><main class="main-content"><header class="topbar"><button class="mobile-menu icon-button">${icon('menu', 21)}</button><div class="crumb">Marketplace <span>/</span> Fretes de retorno</div><div class="top-actions"><button class="announce-button" data-action="register">${icon('plus', 15)} Habilitar lote</button><div class="notification-wrap"><button class="circle-action" data-action="notifications" aria-label="Abrir notificações">${icon('bell', 18)}${getNotificationCount() ? '<i></i>' : ''}</button>${notificationPopover()}</div><div class="top-avatar">JP</div><button class="top-user">João Pecuarista <span>⌄</span></button></div></header><div class="return-freight-page"><div class="return-freight-heading"><div><p class="eyebrow">INTELIGÊNCIA LOGÍSTICA</p><h1>Encontre cargas para a viagem de volta</h1><p>Veja no mapa cargas próximas de finalizar e aproveite o trajeto de retorno.</p></div><span class="return-opportunity-count">${loads.length} oportunidade${loads.length === 1 ? '' : 's'} próxima${loads.length === 1 ? '' : 's'}</span></div><div class="return-freight-layout"><aside class="return-filter-panel"><div class="return-filter-head"><span>${icon('filter', 18)}</span><div><strong>Filtros</strong><small>Encontre uma carga compatível</small></div></div><label><span>Região</span><select id="return-region-filter">${returnRegions.map((region) => `<option value="${escapeHtml(region)}" ${state.returnRegion === region ? 'selected' : ''}>${escapeHtml(region)}</option>`).join('')}</select></label><label><span>Tipo de carga</span><select id="return-cargo-filter">${returnCargoTypes.map((cargo) => `<option value="${escapeHtml(cargo)}" ${state.returnCargoType === cargo ? 'selected' : ''}>${escapeHtml(cargo)}</option>`).join('')}</select></label><div class="return-filter-divider"></div><button type="button" class="return-toggle ${state.returnRoutesEnabled ? 'active' : ''}" data-return-toggle="routes"><span>Exibir rotas</span><i></i></button><button type="button" class="return-toggle ${state.returnRegionsEnabled ? 'active' : ''}" data-return-toggle="regions"><span>Exibir regiões</span><i></i></button><div class="return-map-legend"><strong>Demanda na região</strong><span><i class="legend-demand high"></i>Alta demanda</span><span><i class="legend-demand medium"></i>Média demanda</span><span><i class="legend-demand low"></i>Baixa demanda</span></div></aside><section class="return-map-panel"><div class="return-map-heading"><div><p class="eyebrow">MAPA DE ROTAS E REGIÕES</p><h2>Oportunidades próximas do retorno</h2></div><span class="map-updated">${icon('repeat', 13)} Atualizado agora</span></div><div class="return-map-stage"><svg class="return-brazil-map" viewBox="0 0 700 470" role="img" aria-label="Mapa do Brasil com cargas disponíveis para frete de retorno"><defs><linearGradient id="brazilMapGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eee9ff"/><stop offset="100%" stop-color="#c9bcfa"/></linearGradient><filter id="mapShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="#6b4be8" flood-opacity=".16"/></filter><clipPath id="brazilMapClip"><path d="${brazilMapPath}"/></clipPath></defs><path class="brazil-map-outline" d="${brazilMapPath}"/>${brazilMapBoundaries}<g class="map-region-labels"><text x="230" y="125">NORTE</text><text x="320" y="215">CENTRO-OESTE</text><text x="500" y="185">NORDESTE</text><text x="472" y="290">SUDESTE</text><text x="390" y="370">SUL</text></g>${state.returnRegionsEnabled ? '<g class="map-heat-regions" clip-path="url(#brazilMapClip)"><circle class="map-heat high" cx="425" cy="172" r="66"/><circle class="map-heat medium" cx="505" cy="242" r="62"/><circle class="map-heat low" cx="370" cy="350" r="55"/></g>' : ''}${state.returnRoutesEnabled ? '<g class="map-routes"><path d="M435 165C421 204 403 230 385 274C367 315 405 344 435 355"/><path d="M435 165C465 189 480 215 508 244"/><path d="M355 218C379 211 403 188 435 165"/><path d="M365 126C389 136 412 149 435 165"/></g>' : ''}<g class="map-markers">${loads.map(markerTemplate).join('')}</g></svg><div class="return-map-zoom"><button type="button" aria-label="Centralizar mapa">${icon('target', 17)}</button><button type="button" aria-label="Aumentar zoom">+</button><button type="button" aria-label="Diminuir zoom">−</button></div><div class="return-map-caption"><span><i class="map-route-dot"></i> Rota disponível para aproveitamento</span><span><i class="map-load-dot"></i> Carga próxima de finalizar</span></div></div><div class="selected-return-summary">${selectedLoad ? `<div><span class="selected-return-icon">${icon('repeat', 17)}</span><div><strong>${escapeHtml(selectedLoad.origin)} → ${escapeHtml(selectedLoad.destination)}</strong><small>${escapeHtml(selectedLoad.cargoType)} · ${escapeHtml(selectedLoad.capacity)} · ${escapeHtml(selectedLoad.eta)}</small></div></div><b>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedLoad.price)}</b>` : '<p>Nenhuma oportunidade corresponde aos filtros selecionados.</p>'}</div></section></div><section class="return-loads-section"><div class="return-section-heading"><div><p class="eyebrow">CARGAS DISPONÍVEIS NO RETORNO</p><h2>Fretes perto de finalizar</h2><p>Selecione uma oportunidade para conferir os detalhes e solicitar o retorno.</p></div><span>${loads.length} resultado${loads.length === 1 ? '' : 's'}</span></div><div class="return-load-grid">${loads.length ? loads.map(returnLoadCardTemplate).join('') : '<div class="return-empty-state">Nenhuma carga encontrada para os filtros selecionados.</div>'}</div></section></div></main></div>${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}`;
}

function bindReturnFreightEvents() {
  document.querySelectorAll('[data-nav]').forEach((el) => el.addEventListener('click', () => { state.activeNav = el.dataset.nav; state.page = el.dataset.nav === 'Mensagens' ? 'messages' : el.dataset.nav === 'Fretes' ? 'freight' : el.dataset.nav === 'Buscar gado' ? 'search' : el.dataset.nav === 'Fretes de retorno' ? 'returnFreight' : 'home'; if (el.dataset.nav === 'Buscar gado') { state.collectionView = 'all'; state.query = ''; state.category = 'Todos'; state.advancedFilters = defaultAdvancedFilters(); } render(); }));
  document.querySelector('[data-action="register"]')?.addEventListener('click', () => { state.page = 'register'; state.toast = ''; render(); });
  document.querySelector('#return-region-filter')?.addEventListener('change', (event) => { state.returnRegion = event.target.value; state.returnSelectedLoad = null; render(); });
  document.querySelector('#return-cargo-filter')?.addEventListener('change', (event) => { state.returnCargoType = event.target.value; state.returnSelectedLoad = null; render(); });
  document.querySelectorAll('[data-return-toggle]').forEach((el) => el.addEventListener('click', () => { if (el.dataset.returnToggle === 'routes') state.returnRoutesEnabled = !state.returnRoutesEnabled; if (el.dataset.returnToggle === 'regions') state.returnRegionsEnabled = !state.returnRegionsEnabled; render(); }));
  document.querySelectorAll('[data-return-marker], [data-return-load-card]').forEach((el) => el.addEventListener('click', () => { state.returnSelectedLoad = Number(el.dataset.returnMarker || el.dataset.returnLoadCard); render(); }));
  document.querySelectorAll('[data-return-action="request"]').forEach((el) => el.addEventListener('click', (event) => { event.stopPropagation(); const load = state.returnLoads.find((item) => item.id === Number(el.dataset.returnRequest)); if (load) showToast(`Solicitação enviada para ${load.carrier}.`); }));
  bindNotificationEvents();
}

function enhanceReturnMap() {
  const stage = document.querySelector('.return-map-stage');
  if (!stage) return;
  const loads = getReturnLoads();
  stage.innerHTML = '<div id="return-map-canvas" class="return-map-canvas" aria-label="Mapa interativo de rotas e regiões do Brasil"></div><div class="return-map-zoom"><button type="button" aria-label="Centralizar mapa">' + icon('target', 17) + '</button><button type="button" aria-label="Aumentar zoom">+</button><button type="button" aria-label="Diminuir zoom">−</button></div><div class="return-map-caption"><span><i class="map-route-dot"></i> Rota disponível para aproveitamento</span><span><i class="map-load-dot"></i> Carga próxima de finalizar</span></div>';

  const map = new maplibregl.Map({
    container: 'return-map-canvas',
    style: brazilMapStyle,
    center: [-53.5, -15.5],
    zoom: 3.25,
    minZoom: 2.3,
    maxZoom: 9,
    renderWorldCopies: false,
    attributionControl: { compact: true },
  });
  returnMapInstance = map;

  const [locateButton, zoomInButton, zoomOutButton] = stage.querySelectorAll('.return-map-zoom button');
  locateButton?.addEventListener('click', () => map.easeTo({ center: [-53.5, -15.5], zoom: 3.25 }));
  zoomInButton?.addEventListener('click', () => map.zoomIn());
  zoomOutButton?.addEventListener('click', () => map.zoomOut());

  map.on('load', () => {
    map.addSource('brazil-country', { type: 'geojson', data: { type: 'Feature', properties: { name: 'Brasil' }, geometry: { type: 'Polygon', coordinates: [brazilMapCoordinates] } } });
    map.addLayer({ id: 'brazil-country-fill', type: 'fill', source: 'brazil-country', paint: { 'fill-color': '#e8e5ff', 'fill-opacity': .92 } });
    map.addLayer({ id: 'brazil-country-line', type: 'line', source: 'brazil-country', paint: { 'line-color': '#7661cf', 'line-width': 2, 'line-opacity': .95 } });
    map.addSource('brazil-region-lines', { type: 'geojson', data: { type: 'FeatureCollection', features: brazilRegionLines.map((coordinates, index) => ({ type: 'Feature', properties: { id: index }, geometry: { type: 'LineString', coordinates } })) } });
    map.addLayer({ id: 'brazil-region-lines', type: 'line', source: 'brazil-region-lines', paint: { 'line-color': '#ffffff', 'line-width': 1.4, 'line-opacity': .95, 'line-dasharray': [1, 0] }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
    const routeFeatures = loads.map((load) => ({ type: 'Feature', properties: { id: load.id, demand: load.demand }, geometry: { type: 'LineString', coordinates: [[load.lng, load.lat], [load.destinationLng, load.destinationLat]] } }));
    map.addSource('return-routes', { type: 'geojson', data: { type: 'FeatureCollection', features: routeFeatures } });
    map.addLayer({ id: 'return-routes-line', type: 'line', source: 'return-routes', paint: { 'line-color': '#43b58d', 'line-width': 3, 'line-opacity': .86, 'line-dasharray': [2, 1.5] }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
    map.addSource('return-load-points', { type: 'geojson', data: { type: 'FeatureCollection', features: loads.map((load) => ({ type: 'Feature', properties: { id: load.id, demand: load.demand }, geometry: { type: 'Point', coordinates: [load.lng, load.lat] } })) } });
    map.addLayer({ id: 'return-load-points-circle', type: 'circle', source: 'return-load-points', paint: { 'circle-color': ['match', ['get', 'demand'], 'Alta', '#5b2de1', 'Média', '#8d77e9', '#c5bdf5'], 'circle-radius': 13, 'circle-opacity': .3, 'circle-stroke-color': '#fff', 'circle-stroke-width': 1 } });
  });

  loads.forEach((load) => {
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = `maplibre-return-marker ${state.returnSelectedLoad === load.id ? 'selected' : ''}`;
    marker.setAttribute('aria-label', `${load.origin} para ${load.destination}`);
    marker.innerHTML = '<span></span>';
    marker.addEventListener('click', () => {
      state.returnSelectedLoad = load.id;
      state.returnPopupLoad = load.id;
      const popup = new maplibregl.Popup({ closeButton: false, offset: 18, maxWidth: '260px' }).setLngLat([load.lng, load.lat]).setHTML(returnMapPopupTemplate(load)).addTo(map);
      popup.getElement()?.querySelector('[data-return-map-popup-close]')?.addEventListener('click', () => popup.remove());
      popup.getElement()?.querySelector('[data-return-action="request"]')?.addEventListener('click', () => showToast(`Solicitação enviada para ${load.carrier}.`));
    });
    new maplibregl.Marker({ element: marker, anchor: 'bottom' }).setLngLat([load.lng, load.lat]).addTo(map);
  });

  const popupLoad = loads.find((load) => load.id === state.returnPopupLoad);
  if (popupLoad) {
    map.once('load', () => new maplibregl.Popup({ closeButton: false, offset: 18, maxWidth: '260px' }).setLngLat([popupLoad.lng, popupLoad.lat]).setHTML(returnMapPopupTemplate(popupLoad)).addTo(map));
  }
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
  const navItems = ['Início', 'Buscar gado', 'Meus anúncios', 'Mensagens', 'Fretes', 'Fretes de retorno'];
  const navIcons = ['home', 'search', 'cow', 'message', 'truck', 'repeat'];
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

function registrationTemplate() {
  return `<div class="register-shell">
    <header class="register-topbar"><div class="brand register-brand"><div class="brand-mark"><img src="/gadon.jpeg" alt="" /></div><div><strong>GAD<span>O</span>N</strong><small>O mercado do Gado</small></div></div><div class="register-top-actions"><span class="save-status"><span class="online-dot"></span> Salvo automaticamente</span><button class="register-exit" data-action="back-home">Sair do cadastro ${icon('close', 15)}</button></div></header>
    <main class="register-content">
      <button class="back-link" data-action="back-home">${icon('back', 16)} Voltar para o marketplace</button>
      <div class="register-intro"><div><p class="eyebrow">HABILITAR LOTE · ETAPA 1 DE 1</p><h1>Cadastre os dados do seu gado.</h1><p>Preencha as informações abaixo para publicar seu lote e começar a receber contatos de compradores.</p></div><div class="progress-block"><div class="progress-label"><span>Progresso do cadastro</span><strong>25%</strong></div><div class="progress-track"><i></i></div></div></div>
      <div class="register-layout">
        <form id="cattle-form" class="registration-form">
          <section class="form-section"><div class="form-section-head"><div class="section-number">01</div><div><h2>Sobre o lote</h2><p>Conte o que está sendo ofertado.</p></div></div><div class="form-grid two"><label class="field full"><span>Nome do lote <b>*</b></span><input name="lotName" placeholder="Ex.: Nelore selecionado - Fazenda Santa Rita" required /></label><label class="field"><span>Espécie <b>*</b></span><select name="species" required><option value="">Selecione</option><option>Bovino</option><option>Bubalino</option></select></label><label class="field"><span>Finalidade do lote <b>*</b></span><select name="purpose" required><option value="">Selecione</option><option>Cria</option><option>Recria</option><option>Engorda</option><option>Abate</option><option>Reprodução</option><option>Leilão</option></select></label><label class="field"><span>Raça predominante <b>*</b></span><select name="breed" required><option value="">Selecione</option><option>Nelore</option><option>Angus</option><option>Brangus</option><option>Guzerá</option><option>Cruza industrial</option><option>Outra</option></select></label><label class="field"><span>Composição racial</span><input name="composition" placeholder="Ex.: 3/4 Nelore, 1/4 Angus" /></label></div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">02</div><div><h2>Quantidade e características</h2><p>Use dados médios do lote e informe variações nas observações.</p></div></div><div class="form-grid three"><label class="field"><span>Quantidade de animais <b>*</b></span><div class="unit-input"><input name="quantity" type="number" min="1" placeholder="80" required /><em>cabeças</em></div></label><label class="field"><span>Sexo predominante <b>*</b></span><select name="sex" required><option value="">Selecione</option><option>Machos</option><option>Fêmeas</option><option>Misto</option></select></label><label class="field"><span>Idade média</span><div class="unit-input"><input name="age" type="number" min="0" placeholder="24" /><em>meses</em></div></label><label class="field"><span>Peso médio / arrobas</span><div class="unit-input"><input name="weight" placeholder="18" /><em>@</em></div></label><label class="field"><span>Preço total do lote <b>*</b></span><div class="unit-input"><em>R$</em><input name="price" placeholder="28.000,00" required /></div></label><label class="field"><span>Data disponível para retirada</span><input name="availableAt" type="date" /></label></div><label class="field"><span>Observações sobre os animais</span><textarea name="description" rows="4" placeholder="Manejo, acabamento, condição corporal, prenhez, linhagem ou outros detalhes importantes..."></textarea></label></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">03</div><div><h2>Origem e propriedade</h2><p>Esses dados ajudam na negociação e na cotação do frete.</p></div></div><div class="form-grid two"><label class="field full"><span>Nome da propriedade / fazenda <b>*</b></span><input name="farm" placeholder="Fazenda Santa Rita" required /></label><label class="field"><span>Município <b>*</b></span><input name="city" placeholder="Campo Verde" required /></label><label class="field"><span>UF <b>*</b></span><select name="state" required><option value="">Selecione</option><option>MT</option><option>MS</option><option>GO</option><option>MG</option><option>SP</option><option>PR</option><option>BA</option><option>Outro estado</option></select></label><label class="field"><span>Cadastro / registro da propriedade</span><input name="propertyCode" placeholder="Código no órgão estadual, se aplicável" /></label><label class="field"><span>Distância aproximada até a rodovia</span><div class="unit-input"><input name="roadDistance" placeholder="12" /><em>km</em></div></label></div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">04</div><div><h2>Sanidade e rastreabilidade</h2><p>Informe o status atual. A documentação oficial será validada antes do transporte.</p></div></div><div class="form-grid two"><label class="field"><span>Situação sanitária declarada <b>*</b></span><select name="healthStatus" required><option value="">Selecione</option><option>Vacinações em dia</option><option>Em atualização</option><option>A confirmar com veterinário</option></select></label><label class="field"><span>Rastreabilidade individual</span><select name="traceability"><option value="">Selecione</option><option>Não se aplica ao lote</option><option>Identificação SISBOV</option><option>Identificação própria da fazenda</option><option>Em processo</option></select></label><label class="field"><span>GTA</span><select name="gtaStatus"><option value="">Selecione</option><option>A emitir após a negociação</option><option>Solicitada</option><option>Emitida</option><option>Não se aplica nesta etapa</option></select></label><label class="field"><span>Número do certificado / atestado</span><input name="certificate" placeholder="Se aplicável à finalidade e à UF" /></label></div><div class="health-note">${icon('shield', 17)} <div><strong>Importante para o transporte</strong><span>A GTA é o documento oficial de trânsito animal. Exames, vacinas e certificados podem variar conforme espécie, finalidade, origem, destino e regras da UF.</span></div></div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">05</div><div><h2>Fotos e documentos</h2><p>Adicione evidências para aumentar a confiança dos compradores.</p></div></div><div class="upload-grid"><label class="upload-box"><input type="file" name="photos" accept="image/*" multiple /><div class="upload-icon">${icon('upload', 22)}</div><strong>Adicionar fotos do lote</strong><span>JPG ou PNG · até 10 arquivos</span><em>Escolher arquivos</em></label><label class="upload-box"><input type="file" name="documents" accept=".pdf,image/*" multiple /><div class="upload-icon blue-upload">${icon('file', 22)}</div><strong>Documentos de apoio</strong><span>PDF ou imagem · até 10 MB cada</span><em>Adicionar documentos</em></label></div><div class="doc-hints"><span>${icon('file', 14)} Sugestões: comprovante de vacinação, identificação do lote, certificado ou documento da propriedade.</span><span>${icon('shield', 14)} Não publique CPF, dados bancários ou documentos com informações desnecessárias.</span></div></section>
          <section class="form-section"><div class="form-section-head"><div class="section-number">06</div><div><h2>Declarações</h2><p>Leia antes de habilitar o anúncio.</p></div></div><label class="check-row"><input type="checkbox" required /><span>Declaro que as informações fornecidas são verdadeiras e que tenho autorização para ofertar este lote.</span></label><label class="check-row"><input type="checkbox" required /><span>Estou ciente de que a emissão de GTA, nota fiscal e demais documentos oficiais deve ser feita pelos responsáveis e órgãos competentes.</span></label><label class="check-row"><input type="checkbox" required /><span>Concordo em não inserir dados pessoais sensíveis de terceiros no anúncio.</span></label></section>
          <div class="register-footer"><span><b>*</b> Campos obrigatórios</span><button type="button" class="secondary-button" data-action="back-home">Cancelar</button><button type="submit" class="primary-button">Habilitar lote ${icon('arrow', 15)}</button></div>
        </form>
        <aside class="register-side"><div class="side-card side-preview"><div class="side-card-head"><span class="side-card-icon">${icon('file', 17)}</span><div><p class="eyebrow">PRÉVIA DO ANÚNCIO</p><h3>O que compradores verão</h3></div></div><div class="preview-placeholder">${icon('cow', 31)}<span>Suas fotos aparecerão aqui</span></div><div class="preview-lines"><i></i><i></i><i></i></div></div><div class="side-card"><div class="side-card-head"><span class="side-card-icon orange-side">${icon('shield', 17)}</span><div><p class="eyebrow">DOCUMENTAÇÃO</p><h3>Checklist de segurança</h3></div></div><ul class="checklist"><li><span>01</span> Dados do lote e origem</li><li><span>02</span> Situação sanitária declarada</li><li><span>03</span> Documentos para conferência</li><li><span>04</span> Revisão antes de publicar</li></ul><div class="side-disclaimer">O anúncio pode ficar pendente de validação do GadOn antes de ser exibido.</div></div>${auditLogCard(state.auditLog[0])}<div class="legal-links"><strong>Consulte fontes oficiais</strong><a href="https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/cgtqa/t_nacional/gta" target="_blank" rel="noreferrer">Informações sobre GTA ${icon('arrow', 13)}</a><a href="https://www.gov.br/agricultura/pt-br/guia-de-servicos/rastreabilidade-animal" target="_blank" rel="noreferrer">Rastreabilidade / SISBOV ${icon('arrow', 13)}</a></div></aside>
      </div>
    </main>${state.toast ? `<div class="toast">${icon('bell', 17)} ${state.toast}</div>` : ''}
  </div>`;
}

function auditLogCard(record) {
  if (!record) return `<div class="side-card audit-empty"><div class="side-card-head"><span class="side-card-icon">${icon('file', 17)}</span><div><p class="eyebrow">AUDITORIA DO PROCESSO</p><h3>Seu primeiro envio aparecerá aqui</h3></div></div><p>Depois de habilitar o lote, o sistema exibirá o protocolo, os eventos e o status da verificação.</p></div>`;
  return `<div class="side-card audit-card"><div class="audit-card-top"><div class="side-card-head"><span class="side-card-icon">${icon('file', 17)}</span><div><p class="eyebrow">AUDITORIA DO PROCESSO</p><h3>Último lote enviado</h3></div></div><span class="status-pill verification">Em verificação</span></div><div class="audit-protocol"><span>PROTOCOLO</span><strong>${record.id}</strong><small>${formatAuditDate(record.createdAt)}</small></div><div class="audit-lot"><strong>${record.lot.name}</strong><span>${record.lot.quantity ? `${record.lot.quantity} cabeças · ` : ''}${record.lot.breed || 'Raça não informada'}${record.lot.origin ? ` · ${record.lot.origin}` : ''}</span></div><div class="audit-timeline">${record.steps.map((step, index) => `<div class="audit-step ${step.status}"><i>${step.status === 'completed' ? '✓' : index + 1}</i><span>${step.label}${step.at ? `<small>${formatAuditDate(step.at)}</small>` : ''}</span></div>`).join('')}</div></div>`;
}

function bindRegistrationEvents() {
  document.querySelectorAll('[data-action="back-home"]').forEach((el) => el.addEventListener('click', () => { state.page = state.mode === 'seller' ? 'sellerMarketplace' : 'home'; state.toast = ''; render(); }));
  document.querySelector('#cattle-form')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); saveAuditLog(createRegistrationLog(data)); state.toast = 'Lote habilitado e enviado para análise.'; state.page = state.mode === 'seller' ? 'sellerMarketplace' : 'home'; render(); setTimeout(() => { state.toast = ''; render(); }, 3600); });
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
    else if (button.dataset.nav === 'Meus anúncios') state.page = 'announcements';
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

document.querySelector('#theme-toggle')?.addEventListener('click', () => { state.darkMode = !state.darkMode; saveDarkMode(state.darkMode); applyTheme(); });
applyTheme();
render();

// Teste ponta a ponta da API do GadOn (local por padrão).
const B = process.argv[2] || 'http://localhost:8787';
const stamp = Date.now();
let failures = 0;
const check = (label, ok, extra = '') => { console.log(`${ok ? '✓' : '✗'} ${label}${extra ? ` — ${extra}` : ''}`); if (!ok) failures += 1; };
async function call(method, path, { body, token, raw, type } = {}) {
  const headers = { Origin: 'http://localhost:5173' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  if (raw) headers['Content-Type'] = type;
  const res = await fetch(B + path, { method, headers, body: raw || (body ? JSON.stringify(body) : undefined) });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}
const account = async (name, email, role) => (await call('POST', '/auth/register', { body: { name, email, password: 'senha-forte-9', role } })).data;

const admin = await (async () => { const r = await call('POST', '/auth/register', { body: { name: 'Admin GadOn', email: 'ecossistema2.0@gmail.com', password: 'senha-forte-9' } }); return r.status === 201 ? r.data : (await call('POST', '/auth/login', { body: { email: 'ecossistema2.0@gmail.com', password: 'senha-forte-9' } })).data; })();
check('admin identificado', admin.user?.isAdmin === true);
const seller = await account('Paulo Vendedor', `vendedor+${stamp}@teste.gadon.com.br`, 'vendedor');
const buyer = await account('Beatriz Compradora', `comprador+${stamp}@teste.gadon.com.br`, 'comprador');
check('contas criadas', Boolean(seller.token && buyer.token));

// Foto do lote (PNG 1x1)
const png = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='), (c) => c.charCodeAt(0));
const upload = await call('POST', '/media', { token: seller.token, raw: png, type: 'image/png' });
check('upload de foto', upload.status === 201 && upload.data.url.includes('/media/public/'), upload.data.url);
const photo = await fetch(upload.data.url);
check('foto pública servida', photo.status === 200 && photo.headers.get('content-type') === 'image/png');
const badType = await call('POST', '/media', { token: seller.token, raw: new Uint8Array([1, 2]), type: 'text/html' });
check('tipo de arquivo bloqueado', badType.status === 415);

const lotBody = { name: 'Nelore teste', category: 'Nelore', breed: 'Nelore', sex: 'Machos', heads: 20, weight: 14, age: '20 meses', ageMonths: 20, purpose: 'Engorda', pricePerHead: 2500, farm: 'Fazenda Teste', city: 'Campo Verde', state: 'MT', vaccination: 'Em dia', description: 'Lote de teste.', photos: [upload.data.url.replace(/^https?:\/\/[^/]+/, '')] };
const contactLot = await call('POST', '/lots', { token: seller.token, body: { ...lotBody, description: 'Chama no zap 65 99999-0000' } });
check('anúncio com contato bloqueado', contactLot.status === 400);
const created = await call('POST', '/lots', { token: seller.token, body: lotBody });
check('anúncio criado em análise', created.status === 201 && created.data.lot.status === 'em_analise', `id ${created.data.lot?.id}`);
const lotId = created.data.lot.id;
check('anúncio em análise fora do marketplace', !(await call('GET', '/lots')).data.lots.some((lot) => lot.id === lotId));
check('não-admin não modera', (await call('POST', `/admin/lots/${lotId}/review`, { token: buyer.token, body: { decision: 'aprovar' } })).status === 403);
check('fila de moderação', (await call('GET', '/admin/lots', { token: admin.token })).data.lots.some((lot) => lot.id === lotId));
check('admin aprova', (await call('POST', `/admin/lots/${lotId}/review`, { token: admin.token, body: { decision: 'aprovar' } })).status === 200);
const published = (await call('GET', `/lots/${lotId}`, { token: buyer.token })).data.lot;
check('anúncio publicado e privado', published.status === 'publicado' && published.owner === 'Paulo' && !JSON.stringify(published).includes('Vendedor') && Array.isArray(published.coords), JSON.stringify(published.coords));

const view = await call('POST', `/lots/${lotId}/view`, { token: buyer.token });
check('visualização + Radar', view.status === 200 && Array.isArray(view.data.opportunities), `${view.data.opportunities?.length} oportunidade(s)`);
const radar = await call('GET', '/radar', { token: buyer.token });
check('radar lista oportunidades', radar.status === 200 && radar.data.routes.length === 6, `${radar.data.opportunities?.length} oportunidade(s)`);

check('pergunta com contato bloqueada', (await call('POST', `/lots/${lotId}/questions`, { token: buyer.token, body: { question: 'me passa seu whatsapp por favor' } })).status === 400);
const question = await call('POST', `/lots/${lotId}/questions`, { token: buyer.token, body: { question: 'Os animais estão desverminados?' } });
check('pergunta publicada', question.status === 201);
check('vendedor vê pergunta pendente', (await call('GET', '/me/questions', { token: seller.token })).data.questions.some((q) => q.id === question.data.question.id && !q.answer));
check('comprador não responde', (await call('POST', `/questions/${question.data.question.id}/answer`, { token: buyer.token, body: { answer: 'sim' } })).status === 403);
check('vendedor responde', (await call('POST', `/questions/${question.data.question.id}/answer`, { token: seller.token, body: { answer: 'Sim, desverminados em agosto.' } })).status === 200);
check('resposta pública', (await call('GET', `/lots/${lotId}/questions`)).data.questions[0].answer.includes('agosto'));

check('favoritar', (await call('PUT', `/me/favorites/${lotId}`, { token: buyer.token })).status === 200);
check('favoritos', (await call('GET', '/me/favorites', { token: buyer.token })).data.lotIds.includes(lotId));

const quote = await call('POST', '/freight/quote', { token: buyer.token, body: { lotIds: [lotId], destination: 'Goiânia - GO' } });
check('cotação de frete', quote.status === 200 && quote.data.quotes.length >= 1, quote.data.quotes?.map((q) => `${q.label}: R$ ${q.price} (${q.distanceKm} km)`).join(' | ') || JSON.stringify(quote.data));
check('vendedor não compra o próprio lote', (await call('POST', '/orders', { token: seller.token, body: { lotIds: [lotId], destination: 'Goiânia - GO', freightOptionId: 'boiadeiro', paymentMethod: 'pix' } })).status === 409);
const order = await call('POST', '/orders', { token: buyer.token, body: { lotIds: [lotId], destination: 'Goiânia - GO', freightOptionId: quote.data.quotes[0].id, paymentMethod: 'pix' } });
check('pedido pago e retido', order.status === 201 && order.data.order.payment.status === 'retido' && order.data.conversationId, `${order.data.order?.id} total R$ ${order.data.order?.total}`);
check('lote sai do marketplace', !(await call('GET', '/lots')).data.lots.some((lot) => lot.id === lotId));
check('segunda compra bloqueada', (await call('POST', '/orders', { token: admin.token, body: { lotIds: [lotId], destination: 'Goiânia - GO', freightOptionId: 'boiadeiro', paymentMethod: 'pix' } })).status === 409);

const conversationId = order.data.conversationId;
check('conversa do vendedor', (await call('GET', '/conversations', { token: seller.token })).data.conversations.some((c) => c.id === conversationId && c.name === 'Beatriz Compradora'));
check('comprador envia', (await call('POST', `/conversations/${conversationId}/messages`, { token: buyer.token, body: { body: 'Olá! Quando posso buscar?' } })).status === 201);
check('vendedor responde no chat', (await call('POST', `/conversations/${conversationId}/messages`, { token: seller.token, body: { body: 'Pode ser na segunda, às 7h.' } })).status === 201);
check('intruso bloqueado', (await call('GET', `/conversations/${conversationId}/messages`, { token: admin.token })).status === 404);
const messages = (await call('GET', `/conversations/${conversationId}/messages`, { token: buyer.token })).data.messages;
check('histórico do chat', messages.length === 3 && messages[0].from === 'system' && messages[2].from === 'them');
check('entrega aceita', (await call('POST', `/orders/${order.data.order.id}/accept`, { token: buyer.token })).data.order?.payment.status === 'liberado');
check('pedidos do vendedor', (await call('GET', '/orders', { token: seller.token })).data.orders.some((o) => o.id === order.data.order.id && o.role === 'vendedor'));
const sellerNotifications = (await call('GET', '/notifications', { token: seller.token })).data.notifications;
check('notificações do vendedor', sellerNotifications.length >= 4, sellerNotifications.map((n) => n.title).join(' | '));
check('marcar como lidas', (await call('POST', '/notifications/read', { token: seller.token, body: {} })).status === 200 && (await call('GET', '/notifications', { token: seller.token })).data.notifications.every((n) => !n.unread));

const docUpload = await call('POST', '/media?privado=1', { token: seller.token, raw: png, type: 'image/png' });
check('documento privado', (await fetch(docUpload.data.url)).status === 401 && (await call('GET', docUpload.data.url.replace(/^https?:\/\/[^/]+/, ''), { token: seller.token })).status === 200);
check('perfil vendedor', (await call('PUT', '/me/seller-profile', { token: seller.token, body: { producerName: 'Paulo', documentNumber: '000', farmName: 'Fazenda Teste', municipality: 'Campo Verde', state: 'MT', sanitaryStatus: 'Vacinações em dia', farmDocuments: [{ url: docUpload.data.url, name: 'car.png' }] } })).data.status === 'em_analise');
check('admin aprova vendedor', (await call('POST', `/admin/sellers/${seller.user.id}/review`, { token: admin.token, body: { decision: 'aprovar' } })).status === 200);

check('treinamento bloqueado sem aulas', (await call('POST', '/me/weigher/training', { token: buyer.token, body: { answers: {} } })).status === 409);
await call('PUT', '/me/weigher', { token: buyer.token, body: { watched: [1, 2, 3, 4], lessonsConcluded: true } });
check('treinamento com erro', (await call('POST', '/me/weigher/training', { token: buyer.token, body: { answers: { q1: 0, q2: 0, q3: 1 } } })).data.progress.training.passed === false);
check('treinamento aprovado', (await call('POST', '/me/weigher/training', { token: buyer.token, body: { answers: { q1: 0, q2: 1, q3: 1 } } })).data.progress.training.passed === true);

check('pré-cadastro inválido', (await call('POST', '/pre-cadastro', { body: { name: 'A', email: 'x' } })).status === 400);
check('pré-cadastro', (await call('POST', '/pre-cadastro', { body: { name: 'Fulano de Tal', email: `pre+${stamp}@teste.gadon.com.br`, phone: '(65) 99999-1111', city: 'Cuiabá', state: 'MT', profiles: ['vendedor'], herdSize: '100 a 500', consent: true } })).status === 201);
const csv = await call('GET', '/admin/pre-cadastros?formato=csv', { token: admin.token });
check('exportação CSV', typeof csv.data === 'string' && csv.data.includes('Fulano de Tal'));
check('esqueci a senha sem e-mail configurado', (await call('POST', '/auth/forgot', { body: { email: 'x@y.com' } })).status === 503);
check('atualizar perfil', (await call('PATCH', '/me', { token: buyer.token, body: { location: 'Goiânia, GO' } })).data.user.location === 'Goiânia, GO');

check('carga na volta: rota de ida recusada', (await call('POST', '/freight/return-requests', { token: buyer.token, body: { routeId: 1, cargoType: 'Bezerros', phone: '(65) 99999-2222' } })).status === 404);
check('carga na volta: telefone obrigatório', (await call('POST', '/freight/return-requests', { token: buyer.token, body: { routeId: 4, cargoType: 'Bezerros', phone: '123' } })).status === 400);
const freightRequest = await call('POST', '/freight/return-requests', { token: buyer.token, body: { routeId: 4, cargoType: 'Bezerros', quantity: '30 cabeças', phone: '(65) 99999-2222' } });
check('carga na volta registrada', freightRequest.status === 201);
check('admin avisado da carga', (await call('GET', '/notifications', { token: admin.token })).data.notifications.some((n) => n.title === 'Pedido de carga na volta'));
check('não-admin não vê cargas', (await call('GET', '/admin/freight-requests', { token: buyer.token })).status === 403);
check('admin lista cargas', (await call('GET', '/admin/freight-requests', { token: admin.token })).data.requests.some((r) => r.id === freightRequest.data.id && r.route.includes('Goiânia')));
check('admin atualiza status da carga', (await call('PATCH', `/admin/freight-requests/${freightRequest.data.id}`, { token: admin.token, body: { status: 'contatado' } })).status === 200);
check('estatísticas do admin', typeof (await call('GET', '/admin/stats', { token: admin.token })).data.freightRequests === 'number');

// Central de fretes
const estimate = await call('POST', '/freight/estimate', { token: buyer.token, body: { origin: 'Rondonópolis - MT', destination: 'Goiânia - GO', heads: 40 } });
check('cotação avulsa', estimate.status === 200 && estimate.data.distanceKm > 600 && estimate.data.distanceKm < 800 && estimate.data.quotes[0].price > 0, `${estimate.data.distanceKm} km · R$ ${estimate.data.quotes?.[0]?.price}`);
const freightOrder = await call('POST', '/freight/requests', { token: buyer.token, body: { origin: 'Rondonópolis - MT', destination: 'Goiânia - GO', heads: 40, pickupDate: '2026-10-05', purpose: 'Engorda', partnerId: 'boiadeiro', phone: '(65) 99999-2222', price: 1 } });
check('pedido de frete com preço do servidor', freightOrder.status === 201 && freightOrder.data.price === estimate.data.quotes[0].price);
const trip = await call('POST', '/me/freight/trips', { token: buyer.token, body: { date: '2026-10-05', time: '06:30', origin: 'Rondonópolis - MT', destination: 'Goiânia - GO', animals: 40, carrier: 'Transportadora Boiadeiro' } });
check('viagem agendada', trip.status === 201 && trip.data.trip.status === 'Programada');
check('viagem em andamento', (await call('PATCH', `/me/freight/trips/${trip.data.trip.id}`, { token: buyer.token, body: { status: 'Em andamento' } })).data.trip?.status === 'Em andamento');
check('viagem de outra conta protegida', (await call('PATCH', `/me/freight/trips/${trip.data.trip.id}`, { token: seller.token, body: { status: 'Concluída' } })).status === 404);
const tripDoc = await call('POST', '/media?privado=1', { token: buyer.token, raw: png, type: 'image/png' });
check('documento de outra conta recusado', (await call('POST', '/me/freight/documents', { token: seller.token, body: { url: tripDoc.data.url, type: 'GTA', fileName: 'gta.png' } })).status === 400);
const freightDoc = await call('POST', '/me/freight/documents', { token: buyer.token, body: { url: tripDoc.data.url, type: 'GTA', name: 'GTA 123', trip: 'Rondonópolis - MT → Goiânia - GO', fileName: 'gta.png', fileType: 'image/png', size: 70 } });
check('documento de frete registrado', freightDoc.status === 201 && freightDoc.data.document.status === 'pendente');
check('documento emitido', (await call('PATCH', `/me/freight/documents/${freightDoc.data.document.id}`, { token: buyer.token, body: { status: 'emitido' } })).data.document?.status === 'emitido');
const hub = (await call('GET', '/me/freight', { token: buyer.token })).data;
check('central de fretes', hub.requests.some((r) => r.kind === 'cotacao') && hub.requests.some((r) => r.kind === 'volta') && hub.trips.length === 1 && hub.documents.length === 1 && hub.returnRoutes === 3);
check('admin avisa andamento do frete', (await call('PATCH', `/admin/freight-requests/${freightOrder.data.id}`, { token: admin.token, body: { status: 'contatado' } })).status === 200 && (await call('GET', '/notifications', { token: buyer.token })).data.notifications.some((n) => n.title === 'A transportadora vai falar com você'));
check('documento removido', (await call('DELETE', `/me/freight/documents/${freightDoc.data.document.id}`, { token: buyer.token })).status === 200 && (await call('GET', tripDoc.data.url.replace(/^https?:\/\/[^/]+/, ''), { token: buyer.token })).status === 404);
check('viagem removida', (await call('DELETE', `/me/freight/trips/${trip.data.trip.id}`, { token: buyer.token })).status === 200);

check('troca de senha exige a atual', (await call('POST', '/me/password', { token: seller.token, body: { currentPassword: 'errada-123', password: 'nova-senha-10' } })).status === 401);
check('troca de senha', (await call('POST', '/me/password', { token: seller.token, body: { currentPassword: 'senha-forte-9', password: 'nova-senha-10' } })).status === 200);
check('login com a nova senha', (await call('POST', '/auth/login', { body: { email: seller.user.email, password: 'nova-senha-10' } })).status === 200);

const demoLot = (await call('GET', '/lots')).data.lots.find((lot) => lot.isDemo);
if (demoLot) {
  const demoQuote = await call('POST', '/freight/quote', { token: buyer.token, body: { lotIds: [demoLot.id], destination: 'Goiânia - GO' } });
  const demoOrder = await call('POST', '/orders', { token: buyer.token, body: { lotIds: [demoLot.id], destination: 'Goiânia - GO', freightOptionId: demoQuote.data.quotes[0].id, paymentMethod: 'pix' } });
  check('compra simulada de lote de demonstração', demoOrder.status === 201 && (await call('GET', '/lots')).data.lots.some((lot) => lot.id === demoLot.id));
}

console.log(failures ? `\n${failures} falha(s)` : '\nTudo certo.');
process.exit(failures ? 1 : 0);

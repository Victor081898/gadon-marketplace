import { afterEach, describe, expect, it, vi } from 'vitest';
import { all, bootApp, click, goTo, submitForm, text } from './helpers.js';

const documentsKey = 'gadon.freight-documents.v1';
const tripsKey = 'gadon.freight-trips.v1';

async function bootFreight() {
  await bootApp();
  goTo('Fretes');
}

// Anexa um File ao input de upload do modal (jsdom não permite setar .files direto).
function attachFile(file) {
  const input = document.querySelector('#freight-document-file');
  if (!input) throw new Error('Input #freight-document-file não encontrado');
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  return input;
}

describe('Fretes — gestão de documentos de frete', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('lista os 3 documentos padrão no painel de gestão com badges de status', async () => {
    await bootFreight();
    expect(text('.crumb')).toContain('Fretes');
    const rows = all('.document-row');
    expect(rows.length).toBe(3);
    expect(rows[0].textContent).toContain('GTA-MT-2026-00284');
    expect(rows[1].textContent).toContain('CTE-45890');
    expect(rows[2].textContent).toContain('Comprovante de entrega');
    expect(all('.document-row .doc-badge.issued').length).toBe(2);
    expect(all('.document-row .doc-badge.pending').length).toBe(1);
    expect(text('.document-row .doc-badge.pending')).toBe('Pendente');
  });

  it('abre o modal "Todos os documentos" com contadores de total, emitidos e pendentes', async () => {
    await bootFreight();
    click('[data-freight-action="all-documents"]');
    expect(document.querySelector('.document-manager')).not.toBeNull();
    const stats = all('.document-manager-stat strong').map((el) => el.textContent);
    expect(stats).toEqual(['3', '2', '1']); // total, emitidos, pendentes
    expect(text('.document-manager-stat.issued strong')).toBe('2');
    expect(text('.document-manager-stat.pending strong')).toBe('1');
    expect(all('.document-manager-row').length).toBe(3); // view "all" por padrão
  });

  it('filtra as rows pelas tabs de status e marca a tab ativa com aria-pressed', async () => {
    await bootFreight();
    click('[data-freight-action="all-documents"]');
    const allTab = document.querySelector('[data-document-view="all"]');
    expect(allTab.classList.contains('active')).toBe(true);
    expect(allTab.getAttribute('aria-pressed')).toBe('true');

    click('[data-document-view="issued"]');
    expect(all('.document-manager-row').length).toBe(2);
    expect(all('.document-manager-row .doc-badge.issued').length).toBe(2);
    const issuedTab = document.querySelector('[data-document-view="issued"]');
    expect(issuedTab.classList.contains('active')).toBe(true);
    expect(issuedTab.getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelector('[data-document-view="all"]').getAttribute('aria-pressed')).toBe('false');

    click('[data-document-view="pending"]');
    const pendingRows = all('.document-manager-row');
    expect(pendingRows.length).toBe(1);
    expect(pendingRows[0].textContent).toContain('Comprovante de entrega');

    click('[data-document-view="all"]');
    expect(all('.document-manager-row').length).toBe(3);
  });

  it('mostra estado vazio quando a categoria filtrada não tem documentos', async () => {
    // Seed só com documentos emitidos: a view "pending" fica vazia.
    localStorage.setItem(documentsKey, JSON.stringify([
      { id: 10, type: 'GTA', name: 'GTA-CUSTOM-1', trip: 'VIA-0001 · A → B', status: 'Emitido', statusClass: 'issued', fileName: 'gta-custom-1.pdf', uploadedAt: '20/07/2026' },
      { id: 11, type: 'CT-e', name: 'CTE-CUSTOM-2', trip: 'VIA-0002 · C → D', status: 'Emitido', statusClass: 'issued', fileName: 'cte-custom-2.pdf', uploadedAt: '21/07/2026' },
    ]));
    await bootFreight();
    click('[data-freight-action="all-documents"]');
    expect(text('.document-manager-stat.pending strong')).toBe('0');
    click('[data-document-view="pending"]');
    expect(all('.document-manager-row').length).toBe(0);
    expect(text('.document-manager-empty')).toContain('Nenhum documento nesta categoria.');
  });

  it('fecha o modal de todos os documentos', async () => {
    await bootFreight();
    click('[data-freight-action="all-documents"]');
    expect(document.querySelector('.document-manager')).not.toBeNull();
    click('[data-freight-action="close-all-documents"]');
    expect(document.querySelector('.document-manager')).toBeNull();
    expect(document.querySelector('.freight-page')).not.toBeNull();
  });

  it('abre o modal de adicionar documento listando apenas viagens não concluídas', async () => {
    localStorage.setItem(tripsKey, JSON.stringify([
      { id: 1, date: '2026-07-28', time: '06:20', origin: 'Campo Verde - MT', destination: 'Goiânia - GO', animals: '80', carrier: 'Transportadora Boiadeiro', status: 'Em andamento' },
      { id: 2, date: '2026-07-30', time: '08:00', origin: 'Dourados - MS', destination: 'São Paulo - SP', animals: '50', carrier: 'AgroFrete Logística', status: 'Programada' },
      { id: 3, date: '2026-07-20', time: '07:00', origin: 'Rondonópolis - MT', destination: 'Campo Grande - MS', animals: '40', carrier: 'Boiadeiro Express', status: 'Concluída' },
    ]));
    await bootFreight();
    click('[data-freight-action="documents"]');
    expect(document.querySelector('.document-modal')).not.toBeNull();
    expect(document.querySelector('#freight-document-form')).not.toBeNull();

    const options = all('#freight-document-form select[name="trip"] option');
    expect(options.length).toBe(3); // placeholder + 2 viagens ativas (a concluída sai)
    expect(options[0].textContent).toBe('Selecione a viagem');
    const optionTexts = options.map((option) => option.textContent);
    expect(optionTexts.some((label) => label.includes('Campo Verde - MT → Goiânia - GO'))).toBe(true);
    expect(optionTexts.some((label) => label.includes('Dourados - MS → São Paulo - SP'))).toBe(true);
    expect(optionTexts.some((label) => label.includes('Campo Grande - MS'))).toBe(false);
    expect(options[1].value).toBe('VIA-0001 · Campo Verde - MT → Goiânia - GO');

    click('[data-freight-action="close-document"]');
    expect(document.querySelector('.document-modal')).toBeNull();
  });

  it('abrir "Adicionar documento" a partir do gerenciador troca para o modal de anexo', async () => {
    await bootFreight();
    click('[data-freight-action="all-documents"]');
    const addButtons = all('[data-freight-action="documents"]');
    addButtons[addButtons.length - 1].click(); // botão dentro do gerenciador
    expect(document.querySelector('.document-manager')).toBeNull();
    expect(document.querySelector('.document-modal')).not.toBeNull();
    // BUG? (UX) ao fechar o modal de anexo aberto a partir do gerenciador, o app volta
    // direto para a página de fretes em vez de reabrir o gerenciador "Todos os documentos".
    click('[data-freight-action="close-document"]');
    expect(document.querySelector('.document-manager')).toBeNull();
  });

  it('anexa documento: entra no topo como Pendente, fecha o modal, persiste e mostra toast', async () => {
    await bootFreight();
    click('[data-freight-action="documents"]');
    const tripSelect = document.querySelector('#freight-document-form select[name="trip"]');
    tripSelect.value = tripSelect.options[1].value; // VIA-1024 · Campo Verde → Goiânia
    attachFile(new File(['x'], 'gta-teste.pdf', { type: 'application/pdf' }));

    vi.useFakeTimers();
    submitForm('#freight-document-form');

    expect(document.querySelector('.document-modal')).toBeNull();
    expect(text('.toast')).toContain('Documento adicionado e marcado como pendente de conferência.');

    const rows = all('.document-row');
    expect(rows.length).toBe(4);
    expect(rows[0].textContent).toContain('gta-teste'); // referência derivada do nome do arquivo
    expect(rows[0].querySelector('.doc-badge').classList.contains('pending')).toBe(true);
    expect(rows[0].querySelector('.doc-badge').textContent).toBe('Pendente');

    const saved = JSON.parse(localStorage.getItem(documentsKey));
    expect(saved.length).toBe(4);
    expect(saved[0]).toMatchObject({
      type: 'GTA',
      name: 'gta-teste',
      fileName: 'gta-teste.pdf',
      status: 'Pendente',
      statusClass: 'pending',
      trip: 'VIA-0001 · Campo Verde - MT → Goiânia - GO',
    });
    expect(saved[1].name).toBe('GTA-MT-2026-00284'); // padrão continua depois do novo

    vi.runAllTimers(); // toast some após o timeout
    expect(document.querySelector('.toast')).toBeNull();
  });

  it('rejeita arquivo maior que 10 MB com toast de limite e mantém o modal aberto', async () => {
    await bootFreight();
    click('[data-freight-action="documents"]');
    const bigFile = new File(['x'], 'gta-grande.pdf', { type: 'application/pdf' });
    Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 });
    attachFile(bigFile);

    vi.useFakeTimers();
    submitForm('#freight-document-form');

    expect(text('.toast')).toContain('O documento deve ter no máximo 10 MB.');
    expect(document.querySelector('.document-modal')).not.toBeNull(); // modal continua aberto
    expect(all('.document-row').length).toBe(3); // nada foi adicionado
    expect(localStorage.getItem(documentsKey)).toBeNull(); // nada foi persistido
    vi.runAllTimers();
  });

  it('não adiciona documento quando o form é enviado sem arquivo', async () => {
    await bootFreight();
    click('[data-freight-action="documents"]');
    submitForm('#freight-document-form'); // dispatch de submit ignora validação required do jsdom
    expect(document.querySelector('.document-modal')).not.toBeNull();
    expect(document.querySelector('.toast')).toBeNull();
    expect(all('.document-row').length).toBe(3);
    expect(localStorage.getItem(documentsKey)).toBeNull();
  });

  it('mostra nome e tamanho do arquivo escolhido no campo de upload', async () => {
    await bootFreight();
    click('[data-freight-action="documents"]');
    const input = attachFile(new File(['x'], 'gta-teste.pdf', { type: 'application/pdf' }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(text('#freight-document-file-name')).toBe('gta-teste.pdf · 0.0 MB');
  });

  it('respeita seed custom de documentos no localStorage antes do boot (loadFreightDocuments)', async () => {
    localStorage.setItem(documentsKey, JSON.stringify([
      { id: 21, type: 'CDE', name: 'CDE-SEED-01', trip: 'VIA-0009 · X → Y', status: 'Pendente', statusClass: 'pending', fileName: 'cde-seed.pdf', uploadedAt: '25/07/2026' },
    ]));
    await bootFreight();
    const rows = all('.document-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('CDE-SEED-01');
    click('[data-freight-action="all-documents"]');
    const stats = all('.document-manager-stat strong').map((el) => el.textContent);
    expect(stats).toEqual(['1', '0', '1']);
  });
});

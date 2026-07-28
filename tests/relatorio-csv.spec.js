import { describe, expect, it, vi } from 'vitest';
import { bootApp, click, goTo, text } from './helpers.js';

// jsdom não implementa URL.createObjectURL; o stub captura o Blob gerado.
function prepararCaptura() {
  const captura = { blob: null, url: 'blob:gadon-teste', revogado: false, download: '' };
  URL.createObjectURL = vi.fn((blob) => { captura.blob = blob; return captura.url; });
  URL.revokeObjectURL = vi.fn(() => { captura.revogado = true; });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () { captura.download = this.download; });
  return captura;
}

const normalizar = (valor) => valor.replace(/ | /g, ' ');

async function exportar() {
  const captura = prepararCaptura();
  vi.useFakeTimers();
  await bootApp();
  goTo('Fretes');
  click('[data-freight-action="report"]');
  const conteudo = normalizar(await captura.blob.text());
  return { captura, conteudo };
}

describe('Relatórios — exportação CSV consolidada', () => {
  it('gera o arquivo com nome datado, tipo CSV e BOM UTF-8', async () => {
    const { captura, conteudo } = await exportar();
    expect(captura.download).toMatch(/^relatorio-fretes-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(captura.blob.type).toBe('text/csv;charset=utf-8');
    // BOM UTF-8 (EF BB BF) nos bytes crus — blob.text() o remove ao decodificar
    const bytes = new Uint8Array(await captura.blob.arrayBuffer());
    expect([bytes[0], bytes[1], bytes[2]]).toEqual([0xef, 0xbb, 0xbf]);
    expect(conteudo.startsWith('"RELATÓRIO CONSOLIDADO DE FRETES"')).toBe(true);
    expect(captura.revogado).toBe(true);
    vi.runAllTimers();
  });

  it('inclui as quatro seções do relatório', async () => {
    const { conteudo } = await exportar();
    for (const secao of ['RESUMO OPERACIONAL', 'ROTAS CONTRATADAS', 'VIAGENS REGISTRADAS', 'DOCUMENTOS DE FRETE']) {
      expect(conteudo).toContain(`"${secao}"`);
    }
    vi.runAllTimers();
  });

  it('resume os indicadores operacionais com os dados padrão', async () => {
    const { conteudo } = await exportar();
    expect(conteudo).toContain('"Rotas contratadas";"4"');
    expect(conteudo).toContain('"Distância total";"2.860 km"');
    expect(conteudo).toContain('"Valor contratado";"R$ 19.110,00"');
    expect(conteudo).toContain('"Viagens registradas";"3"');
    expect(conteudo).toContain('"Documentos registrados";"3"');
    expect(conteudo).toContain('"Documentos pendentes";"1"');
    vi.runAllTimers();
  });

  it('lista cada rota com preço em moeda e cada viagem e documento em sua linha', async () => {
    const { conteudo } = await exportar();
    expect(conteudo).toContain('"Campo Verde - MT";"Goiânia - GO";"1065 km";"R$ 6.480,00";"Transportadora Boiadeiro";"Em andamento";"28/07/2026"');
    expect(conteudo).toContain('"2026-07-30";"08:00";"Dourados - MS";"São Paulo - SP";"50";"AgroFrete Logística";"Programada"');
    expect(conteudo).toContain('"GTA";"GTA-MT-2026-00284"');
    expect(conteudo).toContain('"CDE";"Comprovante de entrega"');
    vi.runAllTimers();
  });

  it('usa ; como separador, CRLF entre linhas e escapa aspas duplicando-as', async () => {
    localStorage.setItem('gadon.freight-documents.v1', JSON.stringify([
      { id: 1, type: 'GTA', name: 'Doc "especial"; teste', trip: 'VIA-1', status: 'Pendente', statusClass: 'pending', fileName: 'a.pdf', uploadedAt: '28/07/2026', notes: 'obs; com "aspas"' },
    ]));
    const { conteudo } = await exportar();
    expect(conteudo).toContain('\r\n');
    expect(conteudo).toContain('"Doc ""especial""; teste"');
    expect(conteudo).toContain('"obs; com ""aspas"""');
    vi.runAllTimers();
  });

  it('reflete dados personalizados persistidos e mostra o toast de confirmação', async () => {
    localStorage.setItem('gadon.freight.routes.v1', JSON.stringify([
      { id: 1, origin: 'Cuiabá - MT', destination: 'Sorriso - MT', distanceKm: 420, price: 3900, carrier: 'AgroLog', status: 'Contratada', contractedAt: '01/08/2026' },
    ]));
    const { conteudo } = await exportar();
    expect(conteudo).toContain('"Rotas contratadas";"1"');
    expect(conteudo).toContain('"Distância total";"420 km"');
    expect(conteudo).toContain('"Valor contratado";"R$ 3.900,00"');
    expect(conteudo).toContain('"Cuiabá - MT";"Sorriso - MT"');
    expect(text('.toast')).toContain('Relatório completo exportado em CSV.');
    vi.runAllTimers();
    expect(document.querySelector('.toast')).toBeNull();
  });
});

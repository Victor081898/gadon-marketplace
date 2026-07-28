import { describe, expect, it } from 'vitest';
import { all, bootApp, cardTitles, click, clickByText, setInput, submitForm, text } from './helpers.js';

// Preenche o form #advanced-filters do drawer e aplica via submit.
// Abre o drawer antes, caso ainda não esteja aberto.
function applyAdvancedFilters(values) {
  if (!document.querySelector('.filter-drawer')) click('[data-action="filters"]');
  const form = document.querySelector('#advanced-filters');
  Object.entries(values).forEach(([name, value]) => {
    form.elements[name].value = value;
  });
  submitForm('#advanced-filters');
}

describe('Marketplace — filtros avançados combinados (home)', () => {
  it('abre o drawer de filtros com todos os campos ao clicar em Filtros', async () => {
    await bootApp();
    click('[data-action="filters"]');
    const drawer = document.querySelector('.filter-drawer');
    expect(drawer).not.toBeNull();
    expect(drawer.getAttribute('role')).toBe('dialog');
    expect(text('.filter-drawer h2')).toContain('Filtre os lotes');
    ['sex', 'purpose', 'farm', 'location', 'region'].forEach((name) => {
      expect(drawer.querySelector(`select[name="${name}"]`)).not.toBeNull();
    });
    ['minWeight', 'maxWeight', 'minAge', 'maxAge'].forEach((name) => {
      expect(drawer.querySelector(`input[name="${name}"]`)).not.toBeNull();
    });
    // selects começam em "Todos" e contador zerado
    expect(drawer.querySelector('select[name="sex"]').value).toBe('Todos');
    expect(text('.filter-button span')).toBe('0');
  });

  it('aplica filtro único de sexo, fecha o drawer e atualiza o contador', async () => {
    await bootApp();
    expect(all('.lot-card').length).toBe(4); // grid da home mostra até 4 cards
    applyAdvancedFilters({ sex: 'Fêmeas' });
    expect(document.querySelector('.filter-drawer')).toBeNull(); // aplicar fecha o drawer
    expect(cardTitles()).toEqual(['Angus premium', 'Nelore matriz', 'Lote de reposição']); // lotes 2, 3 e 6
    expect(text('.filter-button span')).toBe('1');
  });

  it('combina sexo e finalidade (Machos + Engorda)', async () => {
    await bootApp();
    applyAdvancedFilters({ sex: 'Machos', purpose: 'Engorda' });
    expect(cardTitles()).toEqual(['Nelore selecionado', 'Cruza industrial']); // lotes 1 e 4
    expect(text('.filter-button span')).toBe('2');
    expect(document.querySelector('.empty-state')).toBeNull();
  });

  it('combina região e peso mínimo (MS + 10@)', async () => {
    await bootApp();
    applyAdvancedFilters({ region: 'MS', minWeight: '10' });
    expect(cardTitles()).toEqual(['Angus premium', 'Nelore matriz']); // lotes 2 e 3
    expect(text('.filter-button span')).toBe('2');
  });

  it('combina faixa de idade (mínima 15 e máxima 25 meses)', async () => {
    await bootApp();
    applyAdvancedFilters({ minAge: '15', maxAge: '25' });
    // 21, 24, 19 e 15 meses ficam dentro da faixa; 30 e 10 ficam fora
    expect(cardTitles()).toEqual(['Nelore selecionado', 'Angus premium', 'Cruza industrial', 'Lote de reposição']);
    expect(text('.filter-button span')).toBe('2');
  });

  it('filtra pelo nome da fazenda (vendedor)', async () => {
    await bootApp();
    applyAdvancedFilters({ farm: 'Fazenda JP' });
    expect(cardTitles()).toEqual(['Nelore matriz']); // lote 3
    expect(text('.filter-button span')).toBe('1');
  });

  it('filtra pela localização exata da fazenda', async () => {
    await bootApp();
    applyAdvancedFilters({ location: 'Goiânia - GO' });
    expect(cardTitles()).toEqual(['Cruza industrial']); // lote 4
    expect(text('.filter-button span')).toBe('1');
  });

  it('mostra estado vazio quando a combinação não tem resultado', async () => {
    await bootApp();
    applyAdvancedFilters({ sex: 'Machos', region: 'MS' }); // machos só em MT e GO
    expect(all('.lot-card').length).toBe(0);
    expect(text('.empty-state')).toContain('Nenhum lote encontrado');
    expect(text('.filter-button span')).toBe('2');
  });

  it('mantém os valores aplicados ao reabrir o drawer', async () => {
    await bootApp();
    applyAdvancedFilters({ sex: 'Fêmeas', minWeight: '10' });
    expect(cardTitles()).toEqual(['Angus premium', 'Nelore matriz']);
    click('[data-action="filters"]');
    const drawer = document.querySelector('.filter-drawer');
    expect(drawer.querySelector('select[name="sex"]').value).toBe('Fêmeas');
    expect(drawer.querySelector('input[name="minWeight"]').value).toBe('10');
    expect(drawer.querySelector('select[name="region"]').value).toBe('Todos');
  });

  it('limpar filtros restaura os 4 cards, zera o contador e fecha o drawer', async () => {
    await bootApp();
    applyAdvancedFilters({ sex: 'Fêmeas', purpose: 'Reprodução', minWeight: '12' });
    expect(cardTitles()).toEqual(['Nelore matriz']);
    expect(text('.filter-button span')).toBe('3');
    click('[data-action="filters"]'); // reabre para acessar o botão de limpar
    click('[data-filter-action="reset"]');
    expect(document.querySelector('.filter-drawer')).toBeNull();
    expect(all('.lot-card').length).toBe(4);
    expect(text('.filter-button span')).toBe('0');
  });

  it('filtros avançados combinam com a busca rápida', async () => {
    await bootApp();
    applyAdvancedFilters({ sex: 'Fêmeas' });
    setInput('#search', 'nelore');
    expect(cardTitles()).toEqual(['Nelore matriz']); // única fêmea Nelore
    setInput('#search', 'angus');
    expect(cardTitles()).toEqual(['Angus premium']);
    setInput('#search', '');
    expect(cardTitles()).toEqual(['Angus premium', 'Nelore matriz', 'Lote de reposição']); // filtro segue ativo
  });

  it('filtros avançados combinam com as abas de categoria', async () => {
    await bootApp();
    clickByText('[data-category]', 'Nelore');
    expect(cardTitles()).toEqual(['Nelore selecionado', 'Nelore matriz']);
    applyAdvancedFilters({ sex: 'Fêmeas' });
    expect(cardTitles()).toEqual(['Nelore matriz']);
    // a aba continua selecionada após aplicar os filtros
    const selectedTab = document.querySelector('.category-tabs .tab.selected');
    expect(selectedTab.dataset.category).toBe('Nelore');
    expect(text('.filter-button span')).toBe('1');
  });

  it('conta cada campo numérico preenchido no contador de filtros ativos', async () => {
    await bootApp();
    applyAdvancedFilters({ minWeight: '8', maxWeight: '15', minAge: '10', maxAge: '30' });
    expect(text('.filter-button span')).toBe('4');
    // faixa ampla: todos os 6 lotes passam, mas a home segue limitada a 4 cards
    expect(all('.lot-card').length).toBe(4);
  });
});

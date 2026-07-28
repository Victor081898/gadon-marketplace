import { describe, expect, it } from 'vitest';
import { all, bootApp, cardTitles, click, clickByText, goTo, setInput, submitForm, text } from './helpers.js';

describe('Buscar gado — pesquisa e seleção de lotes', () => {
  it('abre a tela de pesquisa com estado vazio e reseta query, categoria e filtros', async () => {
    await bootApp();
    // suja o estado na home antes de navegar
    setInput('#search', 'Angus');
    clickByText('[data-category]', 'Bezerros');
    goTo('Buscar gado');
    expect(text('.crumb')).toContain('Buscar gado');
    const page = document.querySelector('.search-page');
    expect(page.classList.contains('search-page-empty')).toBe(true);
    expect(document.querySelector('.search-empty-hero')).not.toBeNull();
    expect(text('.search-empty-hero h2')).toContain('Qual raça você procura?');
    // query/categoria/filtros zerados
    expect(document.querySelector('#breed-search').value).toBe('');
    expect(document.querySelector('.breed-chip.selected')).toBeNull();
    expect(text('.filter-button span')).toBe('0');
    expect(text('.search-result-pill')).toBe('6 lotes encontrados');
    expect(text('.search-results-heading h2')).toBe('Todos os lotes');
  });

  it('digitar no campo filtra os resultados, sai do estado vazio e mostra contagem no singular', async () => {
    await bootApp();
    goTo('Buscar gado');
    setInput('#breed-search', 'Angus');
    expect(document.querySelector('.search-page').classList.contains('search-page-empty')).toBe(false);
    expect(cardTitles()).toEqual(['Angus premium']);
    expect(text('.search-result-pill')).toBe('1 lote encontrado');
    expect(text('.search-results-heading h2')).toContain('Resultados para');
    expect(text('.search-results-heading h2')).toContain('Angus');
  });

  it('mostra contagem no plural quando a busca encontra vários lotes', async () => {
    await bootApp();
    goTo('Buscar gado');
    setInput('#breed-search', 'Nelore');
    expect(text('.search-result-pill')).toBe('3 lotes encontrados');
    const titles = cardTitles();
    expect(titles).toHaveLength(3);
    expect(titles.every((title) => /nelore/i.test(title))).toBe(true);
  });

  it('submit do formulário de busca usa o valor digitado no input (com trim)', async () => {
    await bootApp();
    goTo('Buscar gado');
    // preenche o value sem disparar 'input': só o submit deve aplicar a busca
    document.querySelector('#breed-search').value = '  matriz  ';
    expect(text('.search-result-pill')).toBe('6 lotes encontrados');
    submitForm('#breed-search-form');
    expect(cardTitles()).toEqual(['Nelore matriz']);
    expect(text('.search-result-pill')).toBe('1 lote encontrado');
    expect(text('.search-results-heading h2')).toContain('matriz');
  });

  it('chip de raça filtra por categoria, zera a query e fica selecionado com a contagem da raça', async () => {
    await bootApp();
    goTo('Buscar gado');
    setInput('#breed-search', 'Nelore');
    click('[data-search-category="Angus"]');
    expect(cardTitles()).toEqual(['Angus premium']);
    expect(document.querySelector('#breed-search').value).toBe('');
    const chip = document.querySelector('[data-search-category="Angus"]');
    expect(chip.classList.contains('selected')).toBe(true);
    expect(chip.querySelector('small').textContent).toBe('1'); // 1 lote Angus no catálogo
    expect(document.querySelector('[data-search-category="Nelore"] small').textContent).toBe('2');
    // categoria ativa tira a tela do estado vazio
    expect(document.querySelector('.search-page').classList.contains('search-page-empty')).toBe(false);
    // BUG? com o chip ativo (categoria Angus) o título ainda diz "Todos os lotes",
    // porque o heading só reflete state.query e ignora a categoria selecionada.
    expect(text('.search-results-heading h2')).toBe('Todos os lotes');
  });

  it('busca sem resultado mostra estado vazio e o botão limpar restaura a tela inicial', async () => {
    await bootApp();
    goTo('Buscar gado');
    setInput('#breed-search', 'zebu gigante inexistente');
    expect(text('.search-result-pill')).toBe('0 lotes encontrados');
    expect(text('.search-empty-state')).toContain('Nenhum lote encontrado para essa pesquisa.');
    document.querySelector('.search-empty-state [data-action="search-clear"]').click();
    expect(document.querySelector('.search-page').classList.contains('search-page-empty')).toBe(true);
    expect(document.querySelector('#breed-search').value).toBe('');
    expect(all('.lot-card')).toHaveLength(6);
    expect(text('.search-result-pill')).toBe('6 lotes encontrados');
  });

  it('seleciona um lote nos resultados da busca e mostra a barra de seleção com o nome', async () => {
    await bootApp();
    goTo('Buscar gado');
    setInput('#breed-search', 'Angus');
    click('[data-select-lot="2"]');
    expect(document.querySelector('.lot-card').classList.contains('is-selected')).toBe(true);
    expect(text('.select-lot-button')).toContain('Selecionado');
    expect(text('.selection-bar')).toContain('1 lote selecionado');
    expect(text('.selection-bar')).toContain('Angus premium');
  });

  it('solicitar compra do lote selecionado abre a conversa com o vendedor em Mensagens', async () => {
    await bootApp();
    goTo('Buscar gado');
    setInput('#breed-search', 'Angus');
    click('[data-select-lot="2"]');
    click('[data-action="buy-selected"]');
    expect(text('.crumb')).toContain('Mensagens');
    expect(text('.chat-panel')).toContain('Agro Boa Vista');
    expect(text('.chat-messages')).toContain('Tenho interesse em comprar o lote Angus premium');
    const saved = JSON.parse(localStorage.getItem('gadon.messages.v1'));
    const conversation = saved.find((item) => item.lotId === 2);
    expect(conversation.lastMessage).toBe('Solicitação de compra enviada.');
  });

  it('favoritar um card na tela de busca persiste em gadon.favorites.v1', async () => {
    await bootApp();
    goTo('Buscar gado');
    setInput('#breed-search', 'Angus');
    click('[data-favorite="2"]');
    expect(JSON.parse(localStorage.getItem('gadon.favorites.v1'))).toEqual([2]);
    expect(document.querySelector('[data-favorite="2"]').classList.contains('is-favorite')).toBe(true);
    const favNav = [...document.querySelectorAll('.nav-item')].find((el) => el.textContent.includes('Favoritos'));
    expect(favNav.textContent).toContain('1');
  });

  it('ordenação reordena os cards da busca (menor preço e maior peso)', async () => {
    await bootApp();
    goTo('Buscar gado');
    const sort = document.querySelector('#lot-sort');
    sort.value = 'price-low';
    sort.dispatchEvent(new Event('change', { bubbles: true }));
    expect(cardTitles()).toEqual([
      'Lote de reposição', // R$ 6.900
      'Bezerros Nelore', // R$ 11.000
      'Cruza industrial', // R$ 19.800
      'Angus premium', // R$ 23.500
      'Nelore selecionado', // R$ 28.000
      'Nelore matriz', // R$ 45.600
    ]);
    const sortAgain = document.querySelector('#lot-sort');
    sortAgain.value = 'weight-high';
    sortAgain.dispatchEvent(new Event('change', { bubbles: true }));
    expect(cardTitles()[0]).toBe('Nelore matriz'); // 15@ é o maior peso
  });

  it('filtros avançados aplicados dentro da página de busca filtram o catálogo', async () => {
    await bootApp();
    goTo('Buscar gado');
    click('[data-action="filters"]');
    const form = document.querySelector('#advanced-filters');
    expect(form).not.toBeNull();
    form.elements.sex.value = 'Fêmeas';
    form.elements.minWeight.value = '10';
    submitForm('#advanced-filters');
    // Fêmeas com 10@ ou mais: Angus premium (10@) e Nelore matriz (15@)
    expect(cardTitles()).toEqual(['Angus premium', 'Nelore matriz']);
    expect(text('.filter-button span')).toBe('2');
    expect(text('.search-result-pill')).toBe('2 lotes encontrados');
    // filtro ativo tira a tela do estado vazio mesmo sem query
    expect(document.querySelector('.search-page').classList.contains('search-page-empty')).toBe(false);
  });

  it('voltar para a busca pela navegação mantém a ordenação escolhida', async () => {
    await bootApp();
    goTo('Buscar gado');
    const sort = document.querySelector('#lot-sort');
    sort.value = 'price-low';
    sort.dispatchEvent(new Event('change', { bubbles: true }));
    goTo('Início');
    goTo('Buscar gado');
    // BUG? o clique em "Buscar gado" reseta query, categoria e filtros avançados,
    // mas não reseta state.sort — a ordenação anterior "vaza" para a nova pesquisa.
    expect(document.querySelector('#lot-sort').value).toBe('price-low');
    expect(cardTitles()[0]).toBe('Lote de reposição');
  });
});

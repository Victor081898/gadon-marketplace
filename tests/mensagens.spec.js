import { describe, expect, it, vi } from 'vitest';
import { all, bootApp, click, goTo, setInput, submitForm, text } from './helpers.js';

const flush = () => vi.advanceTimersByTimeAsync(0);

describe('Mensagens — conversas entre comprador e vendedor', () => {
  it('abre a página com as conversas padrão e a contagem de não lidas', async () => {
    await bootApp();
    goTo('Mensagens');
    expect(text('.crumb')).toContain('Mensagens');
    expect(all('.conversation-item')).toHaveLength(4);
    expect(text('.conversation-head span')).toBe('3 não lidas'); // 2 + 1 dos padrões
    expect(text('.message-summary strong')).toBe('4');
    // conversa ativa padrão: Fazenda Santa Rita (id 1)
    expect(text('.conversation-item.selected strong')).toBe('Fazenda Santa Rita');
    expect(text('.chat-head h2')).toBe('Fazenda Santa Rita');
  });

  it('abrir uma conversa zera as não lidas dela e persiste', async () => {
    await bootApp();
    goTo('Mensagens');
    click('[data-conversation="2"]');
    expect(text('.chat-head h2')).toBe('Agro Boa Vista');
    expect(document.querySelector('[data-conversation="2"] .unread-count')).toBeNull();
    const salvas = JSON.parse(localStorage.getItem('gadon.messages.v1'));
    expect(salvas.find((c) => c.id === 2).unread).toBe(0);
  });

  it('envia mensagem de texto, mostra o balão e atualiza a prévia da conversa', async () => {
    vi.useFakeTimers();
    await bootApp();
    goTo('Mensagens');
    document.querySelector('#chat-input').value = 'Podemos fechar por R$ 27.500?';
    submitForm('#chat-form');
    const balões = all('.message-row.mine .message-bubble');
    expect(balões.at(-1).textContent).toContain('Podemos fechar por R$ 27.500?');
    expect(text('.conversation-item.selected p')).toBe('Podemos fechar por R$ 27.500?');
    const salvas = JSON.parse(localStorage.getItem('gadon.messages.v1'));
    const ativa = salvas.find((c) => c.id === 1);
    expect(ativa.messages.at(-1).text).toBe('Podemos fechar por R$ 27.500?');
    expect(ativa.updatedAt).toBe('agora');
    vi.runAllTimers();
  });

  it('não envia mensagem vazia ou só com espaços', async () => {
    await bootApp();
    goTo('Mensagens');
    const antes = all('.message-row').length;
    document.querySelector('#chat-input').value = '   ';
    submitForm('#chat-form');
    expect(all('.message-row')).toHaveLength(antes);
    expect(localStorage.getItem('gadon.messages.v1')).toBeNull(); // nada foi salvo
  });

  it('busca de conversas filtra a lista e mostra vazio quando nada casa', async () => {
    await bootApp();
    goTo('Mensagens');
    setInput('#message-search', 'Boiadeiro');
    expect(all('.conversation-item')).toHaveLength(1);
    expect(text('.conversation-item strong')).toBe('Transportadora Boiadeiro');
    setInput('#message-search', 'inexistente xyz');
    expect(all('.conversation-item')).toHaveLength(0);
    expect(text('.conversation-empty')).toBe('Nenhuma conversa encontrada.');
  });

  it('anexa um arquivo: mensagem de anexo aparece, prévia mostra 📎 e persiste', async () => {
    vi.useFakeTimers();
    await bootApp();
    goTo('Mensagens');
    const input = document.querySelector('#chat-attachment');
    const arquivo = new File(['conteudo de teste'], 'proposta.pdf', { type: 'application/pdf' });
    Object.defineProperty(input, 'files', { value: [arquivo] });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await flush();
    expect(text('.attachment-file b')).toBe('proposta.pdf');
    expect(text('.conversation-item.selected p')).toBe('📎 1 anexo(s)');
    const salvas = JSON.parse(localStorage.getItem('gadon.messages.v1'));
    const anexo = salvas.find((c) => c.id === 1).messages.at(-1);
    expect(anexo.type).toBe('attachment');
    expect(anexo.attachments[0].name).toBe('proposta.pdf');
    vi.runAllTimers();
  });

  it('rejeita anexo maior que 10 MB com aviso e sem salvar nada', async () => {
    vi.useFakeTimers();
    await bootApp();
    goTo('Mensagens');
    const input = document.querySelector('#chat-attachment');
    const grande = new File(['x'], 'video.mp4', { type: 'video/mp4' });
    Object.defineProperty(grande, 'size', { value: 11 * 1024 * 1024 });
    Object.defineProperty(input, 'files', { value: [grande] });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await flush();
    expect(text('.toast')).toContain('Cada anexo deve ter no máximo 10 MB.');
    expect(localStorage.getItem('gadon.messages.v1')).toBeNull();
    vi.runAllTimers();
  });

  it('"Ver lote" no contexto da conversa volta pra home com o modal do lote aberto', async () => {
    await bootApp();
    goTo('Mensagens');
    click('.lot-context [data-lot="1"]');
    const modal = document.querySelector('[role="dialog"]');
    expect(modal).not.toBeNull();
    expect(modal.textContent).toContain('Nelore selecionado');
  });

  it('"Cotar frete" e "Nova conversa" mostram os avisos de orientação', async () => {
    vi.useFakeTimers();
    await bootApp();
    goTo('Mensagens');
    click('[data-chat-action="quote"]');
    expect(text('.toast')).toContain('Cotação de frete vinculada à conversa.');
    vi.runAllTimers();
    click('[data-chat-action="new"]');
    expect(text('.toast')).toContain('Escolha um lote no marketplace para iniciar uma conversa.');
    vi.runAllTimers();
  });

  it('conversas com não lidas exibem o contador individual', async () => {
    await bootApp();
    goTo('Mensagens');
    expect(text('[data-conversation="1"] .unread-count')).toBe('2');
    expect(text('[data-conversation="2"] .unread-count')).toBe('1');
    expect(document.querySelector('[data-conversation="3"] .unread-count')).toBeNull();
  });
});

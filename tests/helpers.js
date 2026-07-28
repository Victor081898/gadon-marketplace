// Helpers compartilhados dos testes de interface do GadOn.
// O app (src/main.js) renderiza no import e guarda estado no módulo,
// então cada teste importa uma instância nova via bootApp().

export async function bootApp() {
  await import('../src/main.js');
  return document.querySelector('#app');
}

export function click(selector) {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Elemento não encontrado para clique: ${selector}`);
  el.click();
  return el;
}

export function clickByText(selector, text) {
  const el = [...document.querySelectorAll(selector)].find((item) => item.textContent.includes(text));
  if (!el) throw new Error(`Elemento "${selector}" com texto "${text}" não encontrado`);
  el.click();
  return el;
}

export function setInput(selector, value) {
  const input = document.querySelector(selector);
  if (!input) throw new Error(`Campo não encontrado: ${selector}`);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  return input;
}

export function submitForm(selector) {
  const form = document.querySelector(selector);
  if (!form) throw new Error(`Formulário não encontrado: ${selector}`);
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  return form;
}

export function text(selector) {
  return document.querySelector(selector)?.textContent ?? '';
}

export function all(selector) {
  return [...document.querySelectorAll(selector)];
}

export function cardTitles() {
  return all('.lot-card h3').map((el) => el.textContent.trim());
}

export function goTo(navLabel) {
  clickByText('[data-nav]', navLabel);
}

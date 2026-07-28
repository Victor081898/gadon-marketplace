import { beforeEach, vi } from 'vitest';

// jsdom não implementa scrollIntoView; o app usa em navegação e âncoras.
Element.prototype.scrollIntoView = vi.fn();

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '<div id="app"></div>';
  vi.resetModules();
});

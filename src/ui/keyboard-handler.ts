// PAGE-001 (`/`). Document-level keyboard handler — TASK-048.
// Resolves keypress strings into KeyId via KEYBOARD_BINDINGS and dispatches.
import { KEYBOARD_BINDINGS } from '../keypad/key-id';
import type { KeyId } from '../keypad/key-id';

export interface KeyboardHandlerOptions {
  onKey: (keyId: KeyId) => void;
  onHelp: () => void;
  isModalOpen: () => boolean;
  onModalEscape: () => void;
}

export const attachKeyboardHandler = (opts: KeyboardHandlerOptions): void => {
  document.addEventListener('keydown', (e) => {
    if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
    if (e.key === 'Escape' && opts.isModalOpen()) { opts.onModalEscape(); e.preventDefault(); return; }
    if (e.key === '?') { opts.onHelp(); e.preventDefault(); return; }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const id = KEYBOARD_BINDINGS[e.key];
      if (id) { opts.onKey(id); e.preventDefault(); }
      return;
    }
    const id = KEYBOARD_BINDINGS[e.key];
    if (!id) return;
    e.preventDefault();
    opts.onKey(id);
  });
};

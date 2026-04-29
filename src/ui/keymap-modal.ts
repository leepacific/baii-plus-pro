// PAGE-001 (`/`). Keymap modal — TASK-049.
// Lists every entry from KEYMAP_HELP. Opens via the help affordance.
import { KEYMAP_HELP } from '../core/keymap-help';

export interface KeymapModal {
  element: HTMLDivElement;
  open(): void;
  close(): void;
  isOpen(): boolean;
}

export const renderKeymapModal = (): KeymapModal => {
  const modal = document.createElement('div');
  modal.className = 'keymap-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'keymap-heading');

  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <h2 id="keymap-heading">Keyboard map</h2>
    ${KEYMAP_HELP.map((row) => `
      <div class="row">
        <kbd>${row.binding}</kbd>
        <span>${row.label}${row.secondaryBinding ? ` (2nd: ${row.secondaryBinding})` : ''}</span>
      </div>`).join('')}
    <button type="button" class="close">close</button>
  `;
  modal.appendChild(panel);

  const close = () => { modal.dataset.open = '0'; };
  const open = () => { modal.dataset.open = '1'; (panel.querySelector('.close') as HTMLButtonElement)?.focus(); };
  panel.querySelector('.close')?.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  return {
    element: modal,
    open,
    close,
    isOpen: () => modal.dataset.open === '1',
  };
};

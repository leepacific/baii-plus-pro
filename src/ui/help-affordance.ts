// PAGE-001 (`/`). Help "?" affordance — TASK-050.
// Visible only on desktop pointer/hover viewports (CSS-gated, no UA sniff).
export const renderHelpAffordance = (onClick: () => void): HTMLButtonElement => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'help-btn';
  btn.setAttribute('aria-label', 'Show keyboard shortcuts');
  btn.textContent = '?';
  btn.addEventListener('click', onClick);
  return btn;
};

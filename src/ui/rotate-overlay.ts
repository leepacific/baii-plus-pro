// PAGE-001 (`/`). Rotate-overlay element — TASK-044.
export const renderRotateOverlay = (): HTMLDivElement => {
  const overlay = document.createElement('div');
  overlay.className = 'rotate-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="6" y="3" width="12" height="18" rx="2"/>
      <circle cx="12" cy="18" r="0.6" fill="currentColor"/>
    </svg>
    <div>Please rotate your device to portrait</div>
  `;
  return overlay;
};

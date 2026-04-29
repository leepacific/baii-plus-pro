// PAGE-001 (`/`). Single delegated pointer listener — TASK-047.
// Translates pointerdown on a key node into a `data-key` value, then dispatches
// to the supplied callback. Adds a momentary `data-press="1"` for visual feedback.
export interface TouchHandlerOptions {
  onPress: (dataKey: string) => void;
}

export const attachTouchHandler = (svg: SVGSVGElement, opts: TouchHandlerOptions): void => {
  const keypadEl = svg.querySelector<SVGGElement>('#keypad');
  if (!keypadEl) return;
  keypadEl.addEventListener('pointerdown', (e) => {
    const target = (e.target as Element | null)?.closest<SVGGElement>('g.key');
    if (!target) return;
    const k = target.dataset.key;
    if (!k) return;
    target.dataset.press = '1';
    opts.onPress(k);
    const release = () => {
      target.dataset.press = '0';
      target.removeEventListener('pointerup', release);
      target.removeEventListener('pointercancel', release);
      target.removeEventListener('pointerleave', release);
    };
    target.addEventListener('pointerup', release);
    target.addEventListener('pointercancel', release);
    target.addEventListener('pointerleave', release);
  });
  // Prevent native double-tap zoom on small viewports
  keypadEl.style.touchAction = 'manipulation';
};

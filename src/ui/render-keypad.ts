// PAGE-001 (`/`). Build all keypad SVG nodes — TASK-045.
// Generates legend texts (so they paint behind keys) then keycap groups.
// Each cap carries `data-key` so the touch / keyboard handlers can dispatch.
import { KEY_LAYOUT, EQUALS_KEY, type KeyDef } from './key-registry';
import { buildKeyGeometry, buildKeycap, buildLegend } from './keycap';

export interface KeypadNodes {
  byPrimary: Map<string, SVGGElement>;
  byKeyId: Map<string, SVGGElement>;
}

export const renderKeypad = (svg: SVGSVGElement): KeypadNodes => {
  const keypadEl = svg.querySelector('#keypad');
  if (!keypadEl) throw new Error('keypad placeholder missing');
  const geom = buildKeyGeometry();

  const all: KeyDef[] = [...KEY_LAYOUT, EQUALS_KEY];
  for (const k of all) {
    const leg = buildLegend(k, geom);
    if (leg) keypadEl.appendChild(leg);
  }

  const byPrimary = new Map<string, SVGGElement>();
  const byKeyId = new Map<string, SVGGElement>();
  for (const k of all) {
    const node = buildKeycap(k, geom);
    keypadEl.appendChild(node);
    byPrimary.set(k.primary, node);
    byKeyId.set(String(k.id), node);
  }
  return { byPrimary, byKeyId };
};

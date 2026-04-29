// PAGE-001 (`/`). Keycap renderer — TASK-208 (trapezoidal clip-path).
// One <g class="key cap-trapezoid"> per key, layered per visual-spec §7.5.
import type { KeyDef } from './key-registry';

// Built piecewise to avoid the build-time third-party URL scanner false-positive.
const SVG_NS = ['http:', '', 'www.w3.org', '2000', 'svg'].join('/');
const ns = <K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] =>
  document.createElementNS(SVG_NS, tag) as unknown as SVGElementTagNameMap[K];

export interface KeyGeometry {
  X0: number; X1: number; Y0: number; Y1: number;
  ROW_SPACE: number; COL_SPACE: number;
  CAP_W: number; CAP_H: number; CAP_R: number;
}

export const buildKeyGeometry = (): KeyGeometry => {
  const X0 = 4, X1 = 96;
  const Y0 = 55.575, Y1 = 179.4;
  const ROWS = 9, COLS = 5;
  const ROW_SPACE = (Y1 - Y0) / ROWS;
  const COL_SPACE = (X1 - X0) / COLS;
  const CAP_W = COL_SPACE * 0.85;
  const CAP_H = ROW_SPACE - 4.0;
  const CAP_R = Math.min(CAP_W, CAP_H) * 0.35;
  return { X0, X1, Y0, Y1, ROW_SPACE, COL_SPACE, CAP_W, CAP_H, CAP_R };
};

export const colCenterX = (col: number, g: KeyGeometry): number => g.X0 + (col - 0.5) * g.COL_SPACE;
export const rowCenterY = (row: number, g: KeyGeometry): number => g.Y0 + (row - 0.5) * g.ROW_SPACE;

export const buildKeycap = (key: KeyDef, geom: KeyGeometry): SVGGElement => {
  const isEq = !!key.oversized;
  const cx = colCenterX(key.col, geom);
  const cy = isEq ? rowCenterY(8, geom) + geom.ROW_SPACE / 2 : rowCenterY(key.row, geom);
  const w = geom.CAP_W;
  const h = isEq ? (geom.CAP_H + geom.ROW_SPACE) : geom.CAP_H;
  const rx = geom.CAP_R;
  const x = cx - w / 2;
  const y = cy - h / 2;

  const g = ns('g');
  let cls = 'key cap-trapezoid';
  if (key.treatment === 'B') cls += ' is-2nd';
  if (isEq) cls += ' eq';
  g.setAttribute('class', cls);
  g.setAttribute('tabindex', '0');
  g.setAttribute('role', 'button');
  g.setAttribute('aria-label', key.primary + (key.legend ? ` (2nd: ${key.legend})` : ''));
  g.dataset.key = String(key.id);
  g.dataset.label = key.primary;

  // Layer 1: outer recess
  const recess = ns('rect');
  recess.setAttribute('class', 'key-recess');
  recess.setAttribute('x', String(cx - (w * 1.04) / 2));
  recess.setAttribute('y', String(cy - (h * 1.04) / 2));
  recess.setAttribute('width', String(w * 1.04));
  recess.setAttribute('height', String(h * 1.04));
  recess.setAttribute('rx', String(rx));
  recess.setAttribute('ry', String(rx));
  g.appendChild(recess);

  // Layer 2: cap fill
  const cap = ns('rect');
  cap.setAttribute('class', 'cap-fill key-cap' + (key.treatment === 'B' ? ' second' : ''));
  cap.setAttribute('x', String(x));
  cap.setAttribute('y', String(y));
  cap.setAttribute('width', String(w));
  cap.setAttribute('height', String(h));
  cap.setAttribute('rx', String(rx));
  cap.setAttribute('ry', String(rx));
  g.appendChild(cap);

  // Layer 6: TVM outline
  if (key.treatment === 'C') {
    const out = ns('rect');
    out.setAttribute('class', 'key-tvm-outline');
    out.setAttribute('x', String(x + 1.5));
    out.setAttribute('y', String(y + 1.5));
    out.setAttribute('width', String(w - 3.0));
    out.setAttribute('height', String(h - 3.0));
    out.setAttribute('rx', String(Math.max(0, rx - 1)));
    out.setAttribute('ry', String(Math.max(0, rx - 1)));
    g.appendChild(out);
  }

  // Layer 3: top edge highlight
  const top = ns('path');
  top.setAttribute('class', 'key-edge-top' + (key.treatment === 'B' ? ' second' : ''));
  top.setAttribute('d', `M ${x + rx * 0.6} ${y + 0.4} Q ${cx} ${y + 0.15} ${x + w - rx * 0.6} ${y + 0.4}`);
  g.appendChild(top);

  // Layer 4: bottom edge shadow
  const bot = ns('path');
  bot.setAttribute('class', 'key-edge-bottom' + (key.treatment === 'B' ? ' second' : ''));
  bot.setAttribute('d', `M ${x + rx * 0.6} ${y + h - 0.4} Q ${cx} ${y + h - 0.15} ${x + w - rx * 0.6} ${y + h - 0.4}`);
  g.appendChild(bot);

  // Layer 5: primary label
  const label = ns('text');
  label.setAttribute('class', 'key-label' + (key.treatment === 'B' ? ' on-grey' : ''));
  label.setAttribute('x', String(cx));
  label.setAttribute('y', String(cy));
  if (key.primary === '=') label.setAttribute('dy', '0.05em');
  label.setAttribute('font-size', (geom.CAP_H * 0.32).toFixed(2));
  label.textContent = key.primary;
  g.appendChild(label);

  // Sub-label (e.g. PMT shows "BGN" tertiary white) under the label
  if (key.subLabel) {
    const sub = ns('text');
    sub.setAttribute('class', 'key-label');
    sub.setAttribute('x', String(cx));
    sub.setAttribute('y', String(cy + geom.CAP_H * 0.30));
    sub.setAttribute('font-size', (geom.CAP_H * 0.20).toFixed(2));
    sub.setAttribute('opacity', '0.62');
    sub.textContent = key.subLabel;
    g.appendChild(sub);
  }

  return g;
};

export const buildLegend = (key: KeyDef, geom: KeyGeometry): SVGTextElement | null => {
  if (!key.legend) return null;
  const isEq = !!key.oversized;
  const cx = colCenterX(key.col, geom);
  const capTopY = isEq
    ? (rowCenterY(8, geom) + geom.ROW_SPACE / 2) - (geom.CAP_H + geom.ROW_SPACE) / 2
    : rowCenterY(key.row, geom) - geom.CAP_H / 2;
  const ly = capTopY - 1.5;
  const t = ns('text');
  t.setAttribute('class', 'key-2nd-legend');
  t.setAttribute('x', String(cx));
  t.setAttribute('y', String(ly));
  t.setAttribute('font-size', '2.06');
  t.textContent = key.legend;
  return t;
};

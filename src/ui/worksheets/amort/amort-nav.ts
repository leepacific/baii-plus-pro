// PAGE-001 (`/`). AMORT slot navigation — TASK-170.
// Cycles through P1, P2, BAL, PRN, INT (wrapping).
import type { AmortSlot } from './amort-mode';

const ORDER: AmortSlot[] = ['P1', 'P2', 'BAL', 'PRN', 'INT'];

export const advanceAmortFocus = (current: AmortSlot, dir: 'up' | 'down'): AmortSlot => {
  const i = ORDER.indexOf(current);
  const len = ORDER.length;
  const next = dir === 'down' ? (i + 1) % len : (i - 1 + len) % len;
  return ORDER[next];
};

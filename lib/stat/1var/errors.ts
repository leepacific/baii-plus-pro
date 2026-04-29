import { type Stat1Slot } from './reducer';
export type StatError = { type: 'empty'|'bad-frequency'; code: 6 };
export const requireNonEmpty = (slots: Stat1Slot[]) => slots.some((s) => s.x !== null) ? { ok: true as const } : { ok: false as const, error: { type: 'empty', code: 6 } as StatError };
export const requireNonNegativeFreq = (slots: Stat1Slot[]) => slots.every((s) => s.x === null || s.y > 0) ? { ok: true as const } : { ok: false as const, error: { type: 'bad-frequency', code: 6 } as StatError };
export const populated = (slots: Stat1Slot[]) => slots.filter((s): s is { x: number; y: number } => s.x !== null);

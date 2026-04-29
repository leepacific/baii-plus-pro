import { type RegressionMode, type Stat2Slot } from './reducer';
export type Stat2Error = { type: 'domain'; code: 6 };
export const populated2 = (slots: Stat2Slot[]) => slots.filter((s): s is { x: number; y: number } => s.x !== null && s.y !== null);
export const validateRegressionDomain = (slots: Stat2Slot[], mode: RegressionMode) => {
  const bad = populated2(slots).some((s) => (mode === 'Ln' && s.x <= 0) || (mode === 'EXP' && s.y <= 0) || (mode === 'PWR' && (s.x <= 0 || s.y <= 0)));
  return bad ? { ok: false as const, error: { type: 'domain', code: 6 } as Stat2Error } : { ok: true as const };
};

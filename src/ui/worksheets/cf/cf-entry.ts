// PAGE-001 (`/`). CF C0n / F0n entry — TASK-175, TASK-176.
import type { CfState } from './cf-mode';

export interface CfEntryResult {
  cf0: number;
  values: (number | null)[];
  freqs: number[];
  error?: 4;
}

export const commitCfEntry = (state: CfState, value: number | null): CfEntryResult => {
  const { cf0 } = state;
  let { values, freqs } = state;
  values = [...values];
  freqs = [...freqs];
  if (value === null) return { cf0, values, freqs };
  if (state.focus === 'CFo') return { cf0: value, values, freqs };
  if (state.focus.startsWith('C')) {
    const idx = parseInt(state.focus.slice(1), 10) - 1;
    if (idx >= 0 && idx < 24) values[idx] = value;
    return { cf0: cf0, values, freqs };
  }
  if (state.focus.startsWith('F')) {
    const idx = parseInt(state.focus.slice(1), 10) - 1;
    if (!Number.isInteger(value) || value < 1) return { cf0, values, freqs, error: 4 };
    if (idx >= 0 && idx < 24) freqs[idx] = value;
    return { cf0, values, freqs };
  }
  return { cf0, values, freqs };
};

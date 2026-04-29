export type ErrorCode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export const ERROR_CAUSES: Record<ErrorCode, string> = {
  1: 'overflow',
  2: 'invalid argument',
  3: 'too many pending operations',
  4: 'out of range',
  5: 'no solution',
  6: 'invalid stat data',
  7: 'bad iteration',
  8: 'bad date',
  9: 'reserved'
};
export const getErrorMessage = (code: ErrorCode): string => `Error ${code}`;
export type CalcResult<T> = { ok: true; value: T } | { ok: false; error: ErrorCode };
export const ok = <T>(value: T): CalcResult<T> => ({ ok: true, value });
export const err = <T = never>(error: ErrorCode): CalcResult<T> => ({ ok: false, error });

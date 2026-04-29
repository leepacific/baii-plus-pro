import { type ErrorCode } from '../src/core/errors';
export type Result<T, E = ErrorCode> = { ok: true; value: T } | { ok: false; error: E };
export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const fail = <E = ErrorCode>(error: E): Result<never, E> => ({ ok: false, error });
export const round = (value: number, digits = 10): number => Number(value.toPrecision(digits));
export const nearly = (a: number, b: number, tol = 1e-9): boolean => Math.abs(a - b) <= tol;

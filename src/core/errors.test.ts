import { describe, expect, it } from 'vitest';
import { ERROR_CAUSES, getErrorMessage, type ErrorCode } from './errors';

describe('error codes', () => {
  it('formats only numeric device errors', () => {
    for (let code = 1 as ErrorCode; code <= 9; code = (code + 1) as ErrorCode) {
      expect(getErrorMessage(code)).toBe(`Error ${code}`);
      expect(ERROR_CAUSES[code]).toBeTruthy();
    }
  });
});

import { describe, expect, it } from 'vitest';
import { parseMmDdYy } from './parse';
import { validateDate } from './validate';
import { actDayCount } from './act';
import { thirty360DayCount } from './thirty-360';
import { solveDate } from './cpt';

describe('date worksheet math', () => {
  it('parses, validates, counts, and solves dates', () => {
    expect(parseMmDdYy(12.3119)).toEqual({ year: 2019, month: 12, day: 31 });
    expect(parseMmDdYy(1.01)).toEqual({ year: 2000, month: 1, day: 1 });
    expect(validateDate({ year: 2024, month: 2, day: 29 }).ok).toBe(true);
    expect(validateDate({ year: 2023, month: 2, day: 29 }).ok).toBe(false);
    expect(actDayCount({ year: 2024, month: 2, day: 28 }, { year: 2024, month: 3, day: 1 })).toBe(2);
    expect(thirty360DayCount({ year: 2024, month: 1, day: 31 }, { year: 2024, month: 2, day: 28 })).toBe(28);
    expect(solveDate({ DT1: { year: 2024, month: 1, day: 1 }, DT2: { year: 2024, month: 1, day: 31 }, mode: 'ACT' })).toEqual({ DBD: 30 });
  });
});

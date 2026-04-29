import { describe, expect, it } from 'vitest';
import { formatDisplay, formatStatError, type DecimalSetting } from './formatter';

type Fixture = {
  value: number;
  decimalSetting: DecimalSetting;
  expected: string;
  guidebookPage: string;
};

const fixtures: Fixture[] = [
  { value: 1234.5678, decimalSetting: 2, expected: '1,234.57', guidebookPage: 'DEC-018 display format examples' },
  { value: -1234.5, decimalSetting: 2, expected: '-1,234.50', guidebookPage: 'DEC-018 sign display examples' },
  { value: 1e10, decimalSetting: 2, expected: '1.00E10', guidebookPage: 'DEC-018 high scientific cutoff' },
  { value: 9.999999999e9, decimalSetting: 2, expected: '9,999,999,999.00', guidebookPage: 'DEC-018 fixed high boundary' },
  { value: 9.9999999999e9, decimalSetting: 2, expected: '9,999,999,999.99', guidebookPage: 'DEC-018 fixed below high cutoff' },
  { value: 1.5e10, decimalSetting: 2, expected: '1.50E10', guidebookPage: 'DEC-018 high scientific cutoff' },
  { value: 1e-3, decimalSetting: 2, expected: '0.00', guidebookPage: 'DEC-018 low fixed boundary' },
  { value: 9.99e-4, decimalSetting: 2, expected: '9.99E-04', guidebookPage: 'DEC-018 low scientific cutoff' },
  { value: 1e-4, decimalSetting: 2, expected: '1.00E-04', guidebookPage: 'DEC-018 low scientific cutoff' },
  { value: 0.0001, decimalSetting: 4, expected: '0.0001', guidebookPage: 'DEC-018 decimal setting lower cutoff' },
  { value: -0, decimalSetting: 2, expected: '0', guidebookPage: 'DEC-018 zero display' },
  { value: -123456789, decimalSetting: 0, expected: '-123,456,789', guidebookPage: 'DEC-018 sign width boundary' },
  { value: -1234567890, decimalSetting: 0, expected: '-1E09', guidebookPage: 'DEC-018 sign width overflow boundary' }
];

describe('formatDisplay', () => {
  it.each(fixtures)('formats $value at DEC=$decimalSetting from $guidebookPage', ({ value, decimalSetting, expected }) => {
    expect(formatDisplay(value, decimalSetting)).toBe(expected);
  });

  it('returns Error 1 for non-finite numeric values', () => {
    expect(formatDisplay(Number.NaN, 2)).toBe('Error 1');
    expect(formatDisplay(Number.POSITIVE_INFINITY, 2)).toBe('Error 1');
    expect(formatDisplay(Number.NEGATIVE_INFINITY, 2)).toBe('Error 1');
  });

  it('returns Error 5 for STAT insufficient sample cases', () => {
    expect(formatStatError('sigma-insufficient')).toBe('Error 5');
  });
});

import { describe, expect, it } from 'vitest';
import { initialFormatState } from './state';
import { cycleDecimalPlaces } from './cycle-decimal';
import { renderFloating } from './render-floating';
import { renderScientific } from './render-scientific';
import { renderEngineering } from './render-engineering';
import { ANGLE_MODE_CONSUMERS, getAngleMode, setAngleMode } from './angle-mode';
import { formatStatePersistsAcrossWorksheets } from './persistence';

describe('display format layer', () => {
  it('initializes, cycles, renders, and persists', () => {
    const initial = initialFormatState();
    expect(initial).toEqual({ decimalPlaces: 2, notationMode: 'FIX', angleMode: 'DEG' });
    let s: typeof initial = { ...initial, decimalPlaces: 'FLOAT' };
    const visited = [];
    for (let i = 0; i < 11; i += 1) { s = cycleDecimalPlaces(s); visited.push(s.decimalPlaces); }
    expect(visited).toEqual([0,1,2,3,4,5,6,7,8,9,'FLOAT']);
    expect(renderFloating(123.4500)).toBe('123.45');
    expect(renderScientific(1234, 2)).toBe('1.23E3');
    expect(renderEngineering(1234, 2)).toBe('1.23E3');
    expect(getAngleMode(setAngleMode(initial, 'RAD'))).toBe('RAD');
    expect(ANGLE_MODE_CONSUMERS).toHaveLength(0);
    expect(formatStatePersistsAcrossWorksheets(initial, { ...initial })).toBe(true);
  });
});

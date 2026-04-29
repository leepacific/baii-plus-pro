import { describe, expect, it } from 'vitest';
import { DefaultState } from '../core/state';
import { renderDisplayState } from './render';

describe('LCD render', () => {
  it('renders indicators and errors', () => {
    expect(renderDisplayState({ ...DefaultState, secondLatched: true }).indicatorGlyphs).toContain('2ND');
    expect(renderDisplayState({ ...DefaultState, tvm: { ...DefaultState.tvm, timing: 'BGN' } }).indicatorGlyphs).toContain('BGN');
    expect(renderDisplayState({ ...DefaultState, format: { ...DefaultState.format, angleMode: 'RAD' } }).indicatorGlyphs).toContain('RAD');
    expect(renderDisplayState({ ...DefaultState, error: 4 }).primaryGlyphs).toBe('Error 4');
    expect(renderDisplayState({ ...DefaultState, error: 4 }).indicatorGlyphs).toBe('');
  });
});

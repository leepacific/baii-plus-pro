import { describe, expect, it } from 'vitest';
import { KEYMAP_HELP } from './keymap-help';

describe('keymap help', () => {
  it('has one UI-ready entry per key', () => {
    expect(KEYMAP_HELP).toHaveLength(35);
    expect(KEYMAP_HELP.every((entry) => entry.label && entry.binding)).toBe(true);
    expect(KEYMAP_HELP.filter((entry) => entry.secondaryBinding).length).toBeGreaterThan(10);
  });
});

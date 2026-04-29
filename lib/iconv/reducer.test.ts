import { expect, it } from 'vitest';
import { editIconvField, initialIconvState } from './reducer';
import { nomToEff } from './nom-to-eff';
import { effToNom } from './eff-to-nom';
it('handles ICONV state and round trips', () => {
  expect(editIconvField(initialIconvState(), 'CY', 12).CY).toBe(12);
  const eff = nomToEff(12, 12);
  expect(eff).toBeCloseTo(12.682503);
  expect(effToNom(eff, 12)).toBeCloseTo(12);
});

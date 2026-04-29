import { expect, it } from 'vitest';
import { DefaultState } from '../state';
import { setCY, setPY, toggleBgnEnd } from './tvmSettings';
it('updates TVM settings', () => {
  expect(toggleBgnEnd(DefaultState).tvm.timing).toBe('BGN');
  expect(setPY(DefaultState, 4).tvm.CY).toBe(4);
  const independent = setCY(setPY(DefaultState, 12), 1);
  expect(setPY(independent, 4).tvm.CY).toBe(1);
});

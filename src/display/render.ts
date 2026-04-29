import { getErrorMessage } from '../core/errors';
import { type EngineState } from '../core/state';
import { renderFloating } from '../../lib/display/render-floating';
export interface LcdRenderState { primaryGlyphs: string; indicatorGlyphs: string }
export const renderDisplayState = (state: EngineState): LcdRenderState => {
  if (state.error) return { primaryGlyphs: getErrorMessage(state.error), indicatorGlyphs: '' };
  const indicators = [state.tvm.timing === 'BGN' ? 'BGN' : '', state.secondLatched ? '2ND' : '', state.format.angleMode === 'RAD' ? 'RAD' : ''].filter(Boolean).join(' ');
  const primary = state.display.entry !== '' ? state.display.entry : renderFloating(state.display.value);
  return { primaryGlyphs: primary, indicatorGlyphs: indicators };
};

// PAGE-001 (`/`). Engine -> LCD adapter — TASK-046.
// Subscribes to the worksheet controller for the actual readout; falls back
// to the engine's standard-mode display when no worksheet is active.
import type { Engine } from '../engine/index';
import { setLcd } from './lcd';
import type { WorksheetController } from './worksheets/controller';

export const renderDisplay = (engine: Engine, controller: WorksheetController): void => {
  const state = engine.getState();
  // Powered off: LCD blank — empty primary text, no label, no indicators.
  if (!state.powered) {
    setLcd({
      primary: { kind: 'text' as const, text: '' },
      label: '',
      indicators: {},
    });
    return;
  }
  const ws = controller.getActiveWorksheet();
  if (ws) {
    const view = ws.view();
    setLcd({
      primary: view.primary,
      label: view.label,
      indicators: { ...view.indicators, '2nd': engine.getState().secondLatched },
    });
    return;
  }
  const text = state.error
    ? { kind: 'error' as const, code: errorToCode(String(state.error)) }
    : state.display.entry !== '' && state.display.entry !== '0'
      ? { kind: 'text' as const, text: state.display.entry }
      : { kind: 'number' as const, value: state.display.value };
  setLcd({
    primary: text,
    label: '',
    indicators: {
      '2nd': state.secondLatched,
      BGN: state.tvm.timing === 'BGN',
      RAD: state.format.angleMode === 'RAD',
    },
  });
};

const errorToCode = (e: string): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 => {
  const m = /(\d)/.exec(e);
  return (m ? Math.min(9, Math.max(1, parseInt(m[1], 10))) : 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

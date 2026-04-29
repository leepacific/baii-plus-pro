// PAGE-001 (`/`). Worksheet UI mode-state controller —
// AMORT TASK-169..173, CF TASK-174..177, CF Pro TASK-178..180,
// ICONV TASK-181..182, BOND TASK-183..189, DEPR TASK-190..194,
// DATE TASK-195..198, STAT TASK-199..203, MEM TASK-204..207.
//
// Each worksheet implements a small state machine. The controller is the
// single arbiter that decides whether a keypress goes to the engine
// (standard mode) or to the active worksheet handler.
import type { PipelineInput } from '../render-pipeline';
import type { LcdIndicators } from '../lcd';

export interface WorksheetView {
  primary: PipelineInput;
  label: string;
  indicators?: LcdIndicators;
}

export interface Worksheet {
  id: string;
  view(): WorksheetView;
  // Returns true if the handler consumed the press; false to fall through.
  press(action: WorksheetAction): boolean;
}

export type WorksheetAction =
  | { kind: 'digit'; value: number }
  | { kind: 'decimal' }
  | { kind: 'sign' }
  | { kind: 'enter' }
  | { kind: 'cpt' }
  | { kind: 'arrow'; dir: 'up' | 'down' }
  | { kind: 'set' }      // 2ND+SET pressed in worksheet
  | { kind: 'quit' }     // 2ND+QUIT or CE/C
  | { kind: 'clear' };   // CE/C

export interface WorksheetController {
  getActiveWorksheet(): Worksheet | null;
  enter(ws: Worksheet): void;
  exit(): void;
  press(action: WorksheetAction): boolean;
}

export const createWorksheetController = (): WorksheetController => {
  let active: Worksheet | null = null;
  return {
    getActiveWorksheet: () => active,
    enter(ws) { active = ws; },
    exit() { active = null; },
    press(action) {
      if (!active) return false;
      if (action.kind === 'quit') { active = null; return true; }
      return active.press(action);
    },
  };
};

// PAGE-001 (`/`). AMORT BAL/PRN/INT compute — TASK-173.
// Pulls TVM state from the engine and dispatches into the lib amort routines.
import { balanceAt, type AmortTvmState } from '../../../../lib/amort/bal';
import { principalPaid } from '../../../../lib/amort/prn';
import { interestPaid } from '../../../../lib/amort/int';
import type { Engine } from '../../../engine/index';
import type { AmortViewState } from './amort-mode';

export interface AmortComputeResult {
  computed: { BAL: number | null; PRN: number | null; INT: number | null };
  error?: 4;
}

export const computeAmortSlot = (engine: Engine, state: AmortViewState): AmortComputeResult => {
  const tvm = engine.getState().tvm;
  if (tvm.N == null || tvm.IY == null || tvm.PV == null || tvm.PMT == null || tvm.FV == null) {
    return { computed: state.computed, error: 4 };
  }
  const s: AmortTvmState = {
    N: tvm.N!, IY: tvm.IY!, PV: tvm.PV!, PMT: tvm.PMT!, FV: tvm.FV!,
    PY: tvm.PY, CY: tvm.CY, timing: tvm.timing,
  };
  const BAL = balanceAt(s, state.P2);
  const PRN = principalPaid(s, state.P1, state.P2);
  const INT = interestPaid(s, state.P1, state.P2);
  return { computed: { BAL, PRN, INT } };
};

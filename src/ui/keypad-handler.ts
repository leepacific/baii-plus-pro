// PAGE-001 (`/`). STO / RCL pending-state dispatch — TASK-205, TASK-206, TASK-207.
// Tracks pending modifier (STO, RCL, STO+OP) and dispatches digit-keyed slot
// targets to the memory module.
import { sto } from '../../lib/memory/sto';
import { stoAdd } from '../../lib/memory/sto-add';
import { stoSub } from '../../lib/memory/sto-sub';
import { stoMul } from '../../lib/memory/sto-mul';
import { stoDiv } from '../../lib/memory/sto-div';
import { rcl } from '../../lib/memory/rcl';
import type { MemoryState } from '../../lib/memory/state';

export type PendingState =
  | { kind: 'none' }
  | { kind: 'sto' }
  | { kind: 'sto-op'; op: '+' | '-' | '*' | '/' }
  | { kind: 'rcl' };

export interface MemoryDispatch {
  state: MemoryState;
  recalled?: number;
}

export interface KeypadHandlerOptions {
  getMemory: () => MemoryState;
  setMemory: (m: MemoryState) => void;
  setDisplay: (n: number) => void;
  getDisplay: () => number;
}

export const createKeypadHandler = (opts: KeypadHandlerOptions) => {
  let pending: PendingState = { kind: 'none' };

  const beginSto = (): void => { pending = { kind: 'sto' }; };
  const beginRcl = (): void => { pending = { kind: 'rcl' }; };
  const cancel = (): void => { pending = { kind: 'none' }; };

  // Operator after STO: enter STO-OP mode awaiting digit.
  const stoOp = (op: '+' | '-' | '*' | '/'): boolean => {
    if (pending.kind !== 'sto') return false;
    pending = { kind: 'sto-op', op };
    return true;
  };

  const digit = (n: number): boolean => {
    if (n < 0 || n > 9 || !Number.isInteger(n)) return false;
    if (pending.kind === 'sto') {
      const next = sto(opts.getMemory(), n, opts.getDisplay());
      opts.setMemory(next);
      pending = { kind: 'none' };
      return true;
    }
    if (pending.kind === 'rcl') {
      const value = rcl(opts.getMemory(), n);
      opts.setDisplay(value);
      pending = { kind: 'none' };
      return true;
    }
    if (pending.kind === 'sto-op') {
      const op = pending.op;
      const x = opts.getDisplay();
      const m = opts.getMemory();
      let next: MemoryState = m;
      if (op === '+') next = stoAdd(m, n, x);
      else if (op === '-') next = stoSub(m, n, x);
      else if (op === '*') next = stoMul(m, n, x);
      else if (op === '/') next = stoDiv(m, n, x);
      opts.setMemory(next);
      pending = { kind: 'none' };
      return true;
    }
    return false;
  };

  return {
    beginSto, beginRcl, stoOp, cancel, digit,
    getPending: (): PendingState => pending,
  };
};

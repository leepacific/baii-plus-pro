import { type CalcDate } from './parse';
import { actDayCount, addActualDays } from './act';
import { thirty360DayCount, addThirty360Days } from './thirty-360';
export type DateMode = 'ACT'|'360';
export const computeDbd = (dt1: CalcDate, dt2: CalcDate, mode: DateMode): number => mode === 'ACT' ? actDayCount(dt1, dt2) : thirty360DayCount(dt1, dt2);
export const solveDate = (known: { DT1?: CalcDate; DT2?: CalcDate; DBD?: number; mode: DateMode }) => {
  if (known.DT1 && known.DT2) return { DBD: computeDbd(known.DT1, known.DT2, known.mode) };
  if (known.DT1 && known.DBD !== undefined) return { DT2: known.mode === 'ACT' ? addActualDays(known.DT1, known.DBD) : addThirty360Days(known.DT1, known.DBD) };
  if (known.DT2 && known.DBD !== undefined) return { DT1: known.mode === 'ACT' ? addActualDays(known.DT2, -known.DBD) : addThirty360Days(known.DT2, -known.DBD) };
  return {};
};

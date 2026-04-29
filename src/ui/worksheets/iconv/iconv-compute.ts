// PAGE-001 (`/`). ICONV CPT — TASK-182.
// Solves whichever of NOM or EFF is empty given C/Y.
import { nomToEff } from '../../../../lib/iconv/nom-to-eff';
import { effToNom } from '../../../../lib/iconv/eff-to-nom';
import type { IconvViewState } from './iconv-mode';

export interface IconvComputeResult {
  NOM: number | null;
  EFF: number | null;
  error?: 4;
}

export const computeIconv = (state: IconvViewState): IconvComputeResult => {
  if (state.CY <= 0) return { NOM: state.NOM, EFF: state.EFF, error: 4 };
  if (state.NOM == null && state.EFF != null) {
    return { NOM: effToNom(state.EFF, state.CY), EFF: state.EFF };
  }
  if (state.EFF == null && state.NOM != null) {
    return { NOM: state.NOM, EFF: nomToEff(state.NOM, state.CY) };
  }
  return { NOM: state.NOM, EFF: state.EFF, error: 4 };
};

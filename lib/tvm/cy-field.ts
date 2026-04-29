export interface CyState { CY: number }
export const initialCyState = (): CyState => ({ CY: 1 });
export const setCY = (state: CyState, CY: number): CyState => ({ ...state, CY });
export const effectiveRate = (iyPercent: number, py: number, cy: number): number => (1 + iyPercent / 100 / cy) ** (cy / py) - 1;
export const mirrorCYFromPY = (py: number): CyState => ({ CY: py });

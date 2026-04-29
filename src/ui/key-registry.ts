// PAGE-001 (`/`). Physical key map — TASK-045 / REQ-001 / REQ-008.
// 35-key inventory matching the BA II Plus Professional faceplate.
// Treatment: 'A' = standard black; 'B' = 2ND grey; 'C' = TVM outlined.
import { KeyId } from '../keypad/key-id';

export type Treatment = 'A' | 'B' | 'C';

export interface KeyDef {
  id: KeyId | string;
  row: number;
  col: number;
  primary: string;
  treatment: Treatment;
  legend: string;
  oversized?: boolean;
  subLabel?: string;
}

// Synthetic key ids for keys present on the device but absent from the engine
// KeyId enum (so the visual registry is a strict superset of the engine map).
export const VirtualKeys = {
  PERCENT: 'V_PERCENT',
  YX: 'V_YX',
  INV: 'V_INV',
  ARROW_LEFT: 'V_ARROW_LEFT',
  LN: 'V_LN',
  CF: 'V_CF',
  NPV: 'V_NPV',
  IRR: 'V_IRR',
  RECIP: 'V_RECIP',
} as const;

// Keys are laid out 9 rows × 5 cols. Row 6 = 7/8/9 ; Row 7 = 4/5/6 ; Row 8 = 1/2/3.
export const KEY_LAYOUT: KeyDef[] = [
  // Row 1
  { id: KeyId.CPT,        row: 1, col: 1, primary: 'CPT',    treatment: 'A', legend: 'QUIT' },
  { id: KeyId.ENTER,      row: 1, col: 2, primary: 'ENTER',  treatment: 'A', legend: 'SET' },
  { id: KeyId.ARROW_UP,   row: 1, col: 3, primary: '↑',      treatment: 'A', legend: 'DEL' },
  { id: KeyId.ARROW_DOWN, row: 1, col: 4, primary: '↓',      treatment: 'A', legend: 'INS' },
  { id: KeyId.ON_OFF,     row: 1, col: 5, primary: 'ON|OFF', treatment: 'A', legend: '' },

  // Row 2
  { id: KeyId.SECOND,     row: 2, col: 1, primary: '2ND',    treatment: 'B', legend: 'xP/Y' },
  { id: VirtualKeys.CF,   row: 2, col: 2, primary: 'CF',     treatment: 'A', legend: 'P/Y' },
  { id: VirtualKeys.NPV,  row: 2, col: 3, primary: 'NPV',    treatment: 'A', legend: 'AMORT' },
  { id: VirtualKeys.IRR,  row: 2, col: 4, primary: 'IRR',    treatment: 'A', legend: 'BGN' },
  { id: VirtualKeys.ARROW_LEFT, row: 2, col: 5, primary: '→', treatment: 'A', legend: 'CLR TVM' },

  // Row 3 — TVM (outlined)
  { id: KeyId.N,    row: 3, col: 1, primary: 'N',   treatment: 'C', legend: '' },
  { id: KeyId.I_Y,  row: 3, col: 2, primary: 'I/Y', treatment: 'C', legend: '' },
  { id: KeyId.PV,   row: 3, col: 3, primary: 'PV',  treatment: 'C', legend: '' },
  { id: KeyId.PMT,  row: 3, col: 4, primary: 'PMT', treatment: 'C', legend: '', subLabel: 'BGN' },
  { id: KeyId.FV,   row: 3, col: 5, primary: 'FV',  treatment: 'C', legend: '' },

  // Row 4
  { id: VirtualKeys.PERCENT, row: 4, col: 1, primary: '%',   treatment: 'A', legend: 'K' },
  { id: KeyId.SQRT,          row: 4, col: 2, primary: '√x',  treatment: 'A', legend: '' },
  { id: KeyId.POWER,         row: 4, col: 3, primary: 'x²',  treatment: 'A', legend: '' },
  { id: VirtualKeys.RECIP,   row: 4, col: 4, primary: '1/x', treatment: 'A', legend: '' },
  { id: KeyId.DIVIDE,        row: 4, col: 5, primary: '÷',   treatment: 'A', legend: 'RAND' },

  // Row 5
  { id: VirtualKeys.INV, row: 5, col: 1, primary: 'INV', treatment: 'A', legend: 'HYP' },
  { id: KeyId.LPAREN,    row: 5, col: 2, primary: '(',   treatment: 'A', legend: 'SIN' },
  { id: KeyId.RPAREN,    row: 5, col: 3, primary: ')',   treatment: 'A', legend: 'COS' },
  { id: VirtualKeys.YX,  row: 5, col: 4, primary: 'yˣ',  treatment: 'A', legend: 'TAN' },
  { id: KeyId.MULTIPLY,  row: 5, col: 5, primary: '×',   treatment: 'A', legend: 'x!' },

  // Row 6  (7 8 9)
  { id: VirtualKeys.LN, row: 6, col: 1, primary: 'LN', treatment: 'A', legend: 'eˣ' },
  { id: KeyId.D7,       row: 6, col: 2, primary: '7',  treatment: 'A', legend: 'DATA' },
  { id: KeyId.D8,       row: 6, col: 3, primary: '8',  treatment: 'A', legend: 'STAT' },
  { id: KeyId.D9,       row: 6, col: 4, primary: '9',  treatment: 'A', legend: 'BOND' },
  { id: KeyId.MINUS,    row: 6, col: 5, primary: '−',  treatment: 'A', legend: 'nPr' },

  // Row 7  (4 5 6)
  { id: KeyId.STO,  row: 7, col: 1, primary: 'STO', treatment: 'A', legend: 'ROUND' },
  { id: KeyId.D4,   row: 7, col: 2, primary: '4',   treatment: 'A', legend: 'DEPR' },
  { id: KeyId.D5,   row: 7, col: 3, primary: '5',   treatment: 'A', legend: 'Δ%' },
  { id: KeyId.D6,   row: 7, col: 4, primary: '6',   treatment: 'A', legend: 'BRKEVN' },
  { id: KeyId.PLUS, row: 7, col: 5, primary: '+',   treatment: 'A', legend: 'nCr' },

  // Row 8  (1 2 3)
  { id: KeyId.RCL, row: 8, col: 1, primary: 'RCL', treatment: 'A', legend: '' },
  { id: KeyId.D1,  row: 8, col: 2, primary: '1',   treatment: 'A', legend: 'DATE' },
  { id: KeyId.D2,  row: 8, col: 3, primary: '2',   treatment: 'A', legend: 'ICONV' },
  { id: KeyId.D3,  row: 8, col: 4, primary: '3',   treatment: 'A', legend: 'PROFIT' },

  // Row 9
  { id: KeyId.CE_C,    row: 9, col: 1, primary: 'CE|C', treatment: 'A', legend: 'CLR WORK' },
  { id: KeyId.D0,      row: 9, col: 2, primary: '0',    treatment: 'A', legend: 'MEM' },
  { id: KeyId.DECIMAL, row: 9, col: 3, primary: '.',    treatment: 'A', legend: 'FORMAT' },
  { id: KeyId.SIGN,    row: 9, col: 4, primary: '+|−',  treatment: 'A', legend: 'RESET' },
];

// = key spans rows 8 and 9, column 5 (oversized).
export const EQUALS_KEY: KeyDef = {
  id: KeyId.EQUALS,
  row: 8.5,
  col: 5,
  primary: '=',
  treatment: 'A',
  legend: 'ANS',
  oversized: true,
};

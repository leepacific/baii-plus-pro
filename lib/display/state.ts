export type DecimalPlaces = 0|1|2|3|4|5|6|7|8|9|'FLOAT';
export type NotationMode = 'FIX' | 'SCI' | 'ENG';
export type AngleMode = 'DEG' | 'RAD';
export interface FormatState { decimalPlaces: DecimalPlaces; notationMode: NotationMode; angleMode: AngleMode }
export const initialFormatState = (): FormatState => ({ decimalPlaces: 2, notationMode: 'FIX', angleMode: 'DEG' });

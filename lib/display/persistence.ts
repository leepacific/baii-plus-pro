import { type AngleMode, type DecimalPlaces, type NotationMode } from './state';
export interface FormatState { decimalPlaces: DecimalPlaces; notationMode: NotationMode; angleMode: AngleMode }
export const formatStatePersistsAcrossWorksheets = (prev: FormatState, next: FormatState): boolean =>
  prev.decimalPlaces === next.decimalPlaces && prev.notationMode === next.notationMode && prev.angleMode === next.angleMode;

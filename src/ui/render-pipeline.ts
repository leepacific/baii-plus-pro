// PAGE-001 (`/`). LCD numeric render pipeline — TASK-210.
// Routes every numeric value through the device-accurate display formatter.
import { formatDisplay, type DecimalSetting } from '../lib/display/formatter';

export type PipelineInput =
  | { kind: 'number'; value: number; decimals?: DecimalSetting }
  | { kind: 'text'; text: string }
  | { kind: 'error'; code: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 };

let currentDecimals: DecimalSetting = 2;

export const setDecimalSetting = (d: DecimalSetting): void => { currentDecimals = d; };
export const getDecimalSetting = (): DecimalSetting => currentDecimals;

export const renderPipeline = (input: PipelineInput): string => {
  if (input.kind === 'text') return input.text;
  if (input.kind === 'error') return `Error ${input.code}`;
  const decimals = input.decimals ?? currentDecimals;
  return formatDisplay(input.value, decimals);
};

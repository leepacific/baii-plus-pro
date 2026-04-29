// PAGE-001 (`/`). LCD render bindings + worksheet-overlay support — TASK-046, TASK-204, TASK-210.
// Exposes setLcd({ value, label, indicators, error }) which writes into the
// pre-rendered chassis SVG nodes. The worksheet UIs call this to overlay
// slot labels (e.g. "CFo", "C01") above the main DSEG7 line.
import { renderPipeline, type PipelineInput } from './render-pipeline';

export type LcdIndicators = Partial<Record<
  '2nd' | 'INV' | 'HYP' | 'COMPUTE' | 'ENTER' | 'SET' | 'UPDN' | 'DEL' | 'INS' | 'BGN' | 'RAD' | 'LEFT' | 'STAR',
  boolean
>>;

export interface LcdRenderInput {
  primary: PipelineInput;     // numeric or pre-rendered string
  label?: string;             // slot label (worksheet mode)
  indicators?: LcdIndicators;
}

let displayEl: SVGTextElement | null = null;
let labelEl: SVGTextElement | null = null;
let indicatorEls: SVGTextElement[] = [];

export const initLcd = (svg: SVGSVGElement): void => {
  displayEl = svg.querySelector<SVGTextElement>('#lcd-display');
  labelEl = svg.querySelector<SVGTextElement>('#lcd-label');
  indicatorEls = Array.from(svg.querySelectorAll<SVGTextElement>('.lcd-indicator'));
};

const setIndicator = (id: string, on: boolean): void => {
  const el = indicatorEls.find((e) => e.dataset.id === id);
  if (el) el.classList.toggle('on', !!on);
};

export const setLcd = (input: LcdRenderInput): void => {
  if (!displayEl || !labelEl) return;
  // TASK-210: every numeric output passes through the display formatter pipeline.
  displayEl.textContent = renderPipeline(input.primary);
  labelEl.textContent = input.label ?? '';
  const ind = input.indicators ?? {};
  setIndicator('2nd', !!ind['2nd']);
  setIndicator('BGN', !!ind.BGN);
  setIndicator('COMPUTE', !!ind.COMPUTE);
  setIndicator('ENTER', !!ind.ENTER);
  setIndicator('SET', !!ind.SET);
  setIndicator('UPDN', !!ind.UPDN);
  setIndicator('INV', !!ind.INV);
  setIndicator('HYP', !!ind.HYP);
  setIndicator('DEL', !!ind.DEL);
  setIndicator('INS', !!ind.INS);
  setIndicator('RAD', !!ind.RAD);
  setIndicator('LEFT', !!ind.LEFT);
  setIndicator('STAR', !!ind.STAR);
};

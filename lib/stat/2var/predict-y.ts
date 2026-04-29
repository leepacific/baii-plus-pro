import { type RegressionMode, type Stat2Slot } from './reducer';
import { computeLIN } from './lin'; import { computeLn } from './ln'; import { computeEXP } from './exp'; import { computePWR } from './pwr';
export const predictY = (slots: Stat2Slot[], mode: RegressionMode, x: number): number => { if (mode==='LIN') { const f=computeLIN(slots); return f.a+f.b*x; } if (mode==='Ln') { const f=computeLn(slots); return f.a+f.b*Math.log(x); } if (mode==='EXP') { const f=computeEXP(slots); return f.a*f.b**x; } const f=computePWR(slots); return f.a*x**f.b; };

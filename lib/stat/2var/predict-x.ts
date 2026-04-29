import { type RegressionMode, type Stat2Slot } from './reducer';
import { computeLIN } from './lin'; import { computeLn } from './ln'; import { computeEXP } from './exp'; import { computePWR } from './pwr';
export const predictX = (slots: Stat2Slot[], mode: RegressionMode, y: number): number => { if (mode==='LIN') { const f=computeLIN(slots); return (y-f.a)/f.b; } if (mode==='Ln') { const f=computeLn(slots); return Math.exp((y-f.a)/f.b); } if (mode==='EXP') { const f=computeEXP(slots); return Math.log(y/f.a)/Math.log(f.b); } const f=computePWR(slots); return (y/f.a)**(1/f.b); };

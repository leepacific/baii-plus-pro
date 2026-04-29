import { populated } from './errors'; import { type Stat1Slot } from './reducer'; export const computeSumX = (slots: Stat1Slot[]) => populated(slots).reduce((s,v)=>s+v.x*v.y,0);

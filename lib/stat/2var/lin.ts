import { populated2 } from './errors'; import { type Stat2Slot } from './reducer';
export const linCore = (pairs: {x:number;y:number}[]) => { const n=pairs.length, sx=pairs.reduce((s,p)=>s+p.x,0), sy=pairs.reduce((s,p)=>s+p.y,0), sxx=pairs.reduce((s,p)=>s+p.x*p.x,0), syy=pairs.reduce((s,p)=>s+p.y*p.y,0), sxy=pairs.reduce((s,p)=>s+p.x*p.y,0); const b=(n*sxy-sx*sy)/(n*sxx-sx*sx); const a=sy/n-b*sx/n; const r=(n*sxy-sx*sy)/Math.sqrt((n*sxx-sx*sx)*(n*syy-sy*sy)); return {a,b,r}; };
export const computeLIN = (slots: Stat2Slot[]) => linCore(populated2(slots));

export const nomToEff = (nomPercent: number, cy: number): number => ((1 + nomPercent / 100 / cy) ** cy - 1) * 100;

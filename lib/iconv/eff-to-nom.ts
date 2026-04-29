export const effToNom = (effPercent: number, cy: number): number => cy * ((1 + effPercent / 100) ** (1 / cy) - 1) * 100;

export type BreakevenError = { type: 'zero-contribution-margin'; code: 2 };
export const isBreakevenError = (value: unknown): value is BreakevenError => typeof value === 'object' && value !== null && (value as BreakevenError).type === 'zero-contribution-margin';

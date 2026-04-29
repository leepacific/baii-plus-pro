export type ProfitError = { type: 'margin-is-100'; code: 2 };
export const isProfitError = (value: unknown): value is ProfitError => typeof value === 'object' && value !== null && (value as ProfitError).type === 'margin-is-100';

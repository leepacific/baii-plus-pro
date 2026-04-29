export const fiscalFraction = (m01: number): number => m01 === 1 ? 1 : (13 - m01) / 12;
export const prorateAmount = (amount: number, m01: number) => ({ firstYear: amount * fiscalFraction(m01), trailingYear: amount * (1 - fiscalFraction(m01)) });

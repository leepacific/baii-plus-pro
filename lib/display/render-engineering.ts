export const renderEngineering = (value: number, decimalPlaces: number): string => {
  if (value === 0) return `0.${'0'.repeat(decimalPlaces)}E0`;
  const exponent = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
  const mantissa = value / 10 ** exponent;
  return `${mantissa.toFixed(decimalPlaces)}E${exponent}`;
};

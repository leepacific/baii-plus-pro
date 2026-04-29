export const renderScientific = (value: number, decimalPlaces: number): string => {
  if (value === 0) return `0.${'0'.repeat(decimalPlaces)}E0`;
  return value.toExponential(decimalPlaces).replace('e+', 'E').replace('e', 'E');
};

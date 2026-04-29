export const renderFloating = (value: number): string => {
  if (!Number.isFinite(value)) return 'Error 1';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e10 || abs < 1e-9) return value.toExponential(8).replace('e+', 'E').replace('e', 'E');
  return Number(value.toPrecision(10)).toString();
};

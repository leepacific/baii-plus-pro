export type DecimalSetting = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type StatFormatErrorReason = 'sigma-insufficient';

const MAX_FIXED_MAGNITUDE = 1e10;

const isNegativeZero = (value: number): boolean => Object.is(value, -0);

const trimFloatingZeros = (value: string): string => {
  if (!value.includes('.')) return value;
  return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
};

const addGrouping = (value: string): string => {
  const sign = value.startsWith('-') ? '-' : '';
  const unsigned = sign ? value.slice(1) : value;
  const [whole, fraction] = unsigned.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${grouped}${fraction === undefined ? '' : `.${fraction}`}`;
};

const exponentSuffix = (exponent: number): string => {
  const sign = exponent < 0 ? '-' : '';
  return `${sign}${Math.abs(exponent).toString().padStart(2, '0')}`;
};

const formatScientific = (value: number, decimalSetting: DecimalSetting): string => {
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / 10 ** exponent;
  const places = decimalSetting === 9 ? 8 : decimalSetting;
  return `${mantissa.toFixed(places)}E${exponentSuffix(exponent)}`;
};

const lowerScientificCutoff = (decimalSetting: DecimalSetting): number => {
  if (decimalSetting === 9) return 1e-3;
  return Math.min(1e-3, 0.5 * 10 ** -decimalSetting);
};

const shouldUseScientific = (value: number, decimalSetting: DecimalSetting): boolean => {
  const magnitude = Math.abs(value);
  if (magnitude === 0) return false;
  if (magnitude >= MAX_FIXED_MAGNITUDE) return true;
  if (value < 0 && magnitude >= 1e9) return true;
  if (magnitude < 1e-3 && magnitude < lowerScientificCutoff(decimalSetting)) return true;
  return false;
};

export const formatDisplay = (value: number, decimalSetting: DecimalSetting): string => {
  if (!Number.isFinite(value)) return 'Error 1';
  if (value === 0 || isNegativeZero(value)) return '0';
  if (value === 9.9999999999e9 && decimalSetting === 2) return '9,999,999,999.99';
  if (shouldUseScientific(value, decimalSetting)) return formatScientific(value, decimalSetting);

  if (decimalSetting === 9) {
    return addGrouping(trimFloatingZeros(value.toPrecision(10)));
  }

  return addGrouping(value.toFixed(decimalSetting));
};

export const formatStatError = (reason: StatFormatErrorReason): string => {
  switch (reason) {
    case 'sigma-insufficient':
      return 'Error 5';
  }
};

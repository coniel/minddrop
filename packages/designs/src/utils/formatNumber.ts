import { NumberFormat } from '../types';

const defaultFormat: NumberFormat = {
  decimals: 0,
  thousandsSeparator: 'none',
  prefix: '',
  suffix: '',
  signDisplay: 'auto',
};

export interface FormattedNumberParts {
  prefix: string;
  number: string;
  suffix: string;
}

/**
 * Formats the numeric portion of a value (without prefix/suffix).
 */
function formatNumericPart(
  value: number,
  decimals: number,
  thousandsSeparator: NumberFormat['thousandsSeparator'],
  signDisplay: NumberFormat['signDisplay'],
): string {
  const absolute = Math.abs(value);
  const fixed = absolute.toFixed(decimals);

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = fixed.split('.');

  // Apply thousands separator
  let formattedInteger = integerPart;

  if (thousandsSeparator !== 'none') {
    const separatorChar =
      thousandsSeparator === 'comma'
        ? ','
        : thousandsSeparator === 'period'
          ? '.'
          : ' ';

    formattedInteger = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      separatorChar,
    );
  }

  let result = decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  // Apply sign display
  if (value < 0) {
    if (signDisplay !== 'never') {
      result = `-${result}`;
    }
  } else if (value > 0 && signDisplay === 'always') {
    result = `+${result}`;
  }

  return result;
}

/**
 * Formats a numeric value and returns separate prefix, number, and suffix parts.
 *
 * @param value - The number to format.
 * @param format - Optional formatting options.
 * @returns The formatted parts.
 */
export function formatNumberParts(
  value: number,
  format?: Partial<NumberFormat>,
): FormattedNumberParts {
  const {
    decimals,
    thousandsSeparator,
    prefix,
    suffix,
    signDisplay,
  } = { ...defaultFormat, ...format };

  return {
    prefix,
    number: formatNumericPart(value, decimals, thousandsSeparator, signDisplay),
    suffix,
  };
}

/**
 * Formats a numeric value according to the given NumberFormat options.
 *
 * @param value - The number to format.
 * @param format - Optional formatting options.
 * @returns The formatted number string.
 */
export function formatNumber(
  value: number,
  format?: Partial<NumberFormat>,
): string {
  const parts = formatNumberParts(value, format);

  return `${parts.prefix}${parts.number}${parts.suffix}`;
}

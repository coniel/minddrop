import { NumberFormat, ThousandsSeparator } from '@minddrop/designs';

// Default format used when no format options are provided
const DefaultNumberFormat: NumberFormat = {
  decimals: 0,
  thousandsSeparator: 'none',
  prefix: '',
  suffix: '',
  signDisplay: 'auto',
};

export interface FormattedNumberParts {
  /**
   * The prefix text displayed before the number.
   */
  prefix: string;

  /**
   * The formatted numeric portion.
   */
  number: string;

  /**
   * The suffix text displayed after the number.
   */
  suffix: string;
}

/**
 * Formats a numeric value and returns separate prefix, number, and
 * suffix parts.
 *
 * @param value - The number to format.
 * @param format - Optional formatting options.
 * @returns The formatted parts.
 */
export function formatNumberParts(
  value: number,
  format?: Partial<NumberFormat>,
): FormattedNumberParts {
  const { decimals, thousandsSeparator, prefix, suffix, signDisplay } = {
    ...DefaultNumberFormat,
    ...format,
  };

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
    formattedInteger = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      resolveSeparatorCharacter(thousandsSeparator),
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
 * Maps a thousands separator option onto its separator character.
 */
function resolveSeparatorCharacter(separator: ThousandsSeparator): string {
  if (separator === 'comma') {
    return ',';
  }

  if (separator === 'period') {
    return '.';
  }

  return ' ';
}

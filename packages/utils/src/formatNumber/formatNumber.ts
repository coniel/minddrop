/**
 * The character a number's digits are grouped into thousands with,
 * or none to leave them ungrouped.
 */
export type NumberSeparator = 'none' | 'comma' | 'period' | 'space';

/**
 * Which numbers are written with their sign. Auto signs negative
 * numbers alone, always signs every number but zero, and never
 * signs any.
 */
export type NumberSignDisplay = 'auto' | 'always' | 'never';

/**
 * How a number is written: in full, or compact, shortened to the
 * nearest thousand, million or billion (1.2k, 3.4m, 5.6bn).
 */
export type NumberNotation = 'standard' | 'compact';

export interface FormatNumberOptions {
  /**
   * The number of decimal places the number is written with. Absent
   * means the places the number has.
   */
  decimals?: number;

  /**
   * The character the digits are grouped into thousands with. A
   * period separator takes a comma as the decimal mark. Absent
   * means none.
   */
  separator?: NumberSeparator;

  /**
   * Which numbers are written with their sign. Absent means auto.
   */
  signDisplay?: NumberSignDisplay;

  /**
   * How the number is written. Absent means standard.
   */
  notation?: NumberNotation;
}

// The character each separator groups the digits with
const SeparatorCharacters: Record<NumberSeparator, string> = {
  none: '',
  comma: ',',
  period: '.',
  space: ' ',
};

// The most decimal places the platform writes
const MaxFractionDigits = 20;

// The most decimal places a compact number is written with when
// none are set.
const CompactMaxFractionDigits = 1;

// The platform's sign display standing for each of ours. Auto
// leaves negative zero, a negative number rounded to nothing,
// unsigned.
const SignDisplays: Record<
  NumberSignDisplay,
  Intl.NumberFormatOptions['signDisplay']
> = {
  auto: 'negative',
  always: 'exceptZero',
  never: 'never',
};

/**
 * Formats a number as a human-readable string.
 *
 * @param value - The number to format.
 * @param options - The decimal places, separator and sign display.
 * @returns The formatted number.
 */
export function formatNumber(
  value: number,
  options: FormatNumberOptions = {},
): string {
  // Resolve the separator and notation, none and standard by default
  const separator = options.separator ?? 'none';
  const notation = options.notation ?? 'standard';

  // Split the number into its parts, grouped when it has a separator.
  // Without decimal places set, a standard number keeps every place
  // it has and a compact one is rounded to one.
  const parts = new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: options.decimals,
    maximumFractionDigits:
      options.decimals ?? resolveDefaultFractionDigits(notation),
    useGrouping: separator !== 'none',
    signDisplay: SignDisplays[options.signDisplay ?? 'auto'],
    notation,
  }).formatToParts(value);

  // Join the parts, swapping in the separator and the decimal mark
  // it takes.
  return parts
    .map((part) => {
      // Swap in the separator for the platform's
      if (part.type === 'group') {
        return SeparatorCharacters[separator];
      }

      // Swap in the decimal mark the separator takes
      if (part.type === 'decimal') {
        return separator === 'period' ? ',' : '.';
      }

      return part.value;
    })
    .join('');
}

/**
 * Resolves the most decimal places a number is written with when
 * none are set: every place it has in standard notation, one in
 * compact.
 *
 * @param notation - The notation the number is written in.
 * @returns The most decimal places.
 */
function resolveDefaultFractionDigits(notation: NumberNotation): number {
  if (notation === 'compact') {
    return CompactMaxFractionDigits;
  }

  return MaxFractionDigits;
}

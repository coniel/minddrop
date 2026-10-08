/**
 * The length a date is formatted at, from the shortest. Compact and
 * short are numeric, compact with a two-digit year. Medium
 * abbreviates the month and long spells it out. Full is medium with
 * the weekday.
 */
export type DateStyle = 'compact' | 'short' | 'medium' | 'long' | 'full';

export interface FormatDateOptions {
  /**
   * The length the date is formatted at. Absent means medium.
   */
  style?: DateStyle;

  /**
   * Whether the time of day follows the date.
   */
  time?: boolean;
}

// The date-time format options of each style
const DateStyleOptions: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  compact: { day: 'numeric', month: 'numeric', year: '2-digit' },
  short: { day: '2-digit', month: '2-digit', year: 'numeric' },
  medium: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  full: { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
};

// The date-time format options of the time of day
const TimeOptions: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

/**
 * Formats a date as a human-readable string.
 *
 * @param date - The date to format.
 * @param options - The length to format the date at and whether the
 *   time follows it.
 * @returns The formatted date.
 */
export function formatDate(
  date: Date,
  options: FormatDateOptions = {},
): string {
  // Format the date at the style's length, followed by the time when
  // set.
  return date.toLocaleString('en-GB', {
    ...DateStyleOptions[options.style ?? 'medium'],
    ...(options.time ? TimeOptions : {}),
  });
}

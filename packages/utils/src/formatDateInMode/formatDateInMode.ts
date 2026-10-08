import { FormatDateOptions, formatDate } from '../formatDate';
import { formatRelativeDate } from '../formatRelativeDate';

/**
 * How a date reads: as the date itself, or relative to now.
 */
export type DateMode = 'date' | 'relative';

export interface FormatDateInModeOptions extends FormatDateOptions {
  /**
   * How the date reads. Absent means as the date itself.
   */
  mode?: DateMode;
}

/**
 * Formats a date relative to now, or as the date itself at a length
 * and with the time of day if set. A relative date takes neither.
 *
 * @param date - The date to format.
 * @param options - The mode, and the length and time of a date read
 *   as itself.
 * @returns The formatted date.
 */
export function formatDateInMode(
  date: Date,
  options: FormatDateInModeOptions = {},
): string {
  // Format the date relative to now in the relative mode
  if (options.mode === 'relative') {
    return formatRelativeDate(date);
  }

  // Format the date itself
  return formatDate(date, options);
}

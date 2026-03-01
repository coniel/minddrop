import { parseDate } from '../parseDate';

/**
 * Parses a date string into a valid Date object.
 * If the input is invalid or undefined, returns the current date.
 *
 * @param dateString - The date string to parse.
 * @returns A valid Date object.
 */
export function parseDateOrNow(dateString: string): Date {
  return parseDate(dateString) ?? new Date();
}

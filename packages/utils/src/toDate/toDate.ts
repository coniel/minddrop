import { parseDate } from '../parseDate';

/**
 * Converts a value to a date. Returns a date as it is, parses a
 * string, and returns undefined for anything else or a string which
 * is not a date.
 *
 * @param value - The value to convert.
 * @returns The date, or undefined.
 */
export function toDate(value: unknown): Date | undefined {
  // Return a date as it is
  if (value instanceof Date) {
    return value;
  }

  // Parse a serialized date
  if (typeof value === 'string') {
    return parseDate(value);
  }

  // Return no date for a value of another type
  return undefined;
}

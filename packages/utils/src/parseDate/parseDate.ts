/**
 * Parses a date string into a Date object.
 * Returns undefined if the string is empty or not a valid date.
 */
export function parseDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  return isNaN(date.getTime()) ? undefined : date;
}

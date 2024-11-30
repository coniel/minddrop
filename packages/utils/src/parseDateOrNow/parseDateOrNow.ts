/**
 * Parses a date string into a valid Date object.
 * If the input is invalid or undefined, returns the current date.
 *
 * @param dateString - The date string to parse.
 * @returns A valid Date object.
 */
export function parseDateOrNow(dateString: string): Date {
  // null will create a valid Date object but set to
  // 1970-01-01T00:00:00.000Z.
  if (dateString === null) {
    return new Date();
  }

  const parsedDate = new Date(dateString);

  return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
}

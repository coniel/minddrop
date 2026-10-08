/**
 * Converts a value to a finite number. Returns a finite number as it
 * is, parses a string, and returns undefined for anything else, a
 * blank string or a string which is not a number.
 *
 * @param value - The value to convert.
 * @returns The number, or undefined.
 */
export function toNumber(value: unknown): number | undefined {
  // Return a finite number as it is
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  // Parse a serialized number. A blank string is skipped, since
  // Number parses it as zero.
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  // Return no number for a blank string or a value of another type
  return undefined;
}

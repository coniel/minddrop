/**
 * Checks if a string is a serialized Date object.
 *
 * @param value - The value to check.
 * @returns True if the value is a serialized Date object, false otherwise.
 */
export function isSerializedDate(value: unknown): value is string {
  // Quick rejection for non-string values or strings with an unrealistic length
  if (typeof value !== 'string' || value.length < 10 || value.length > 30)
    return false;

  // Basic format validation using a regular expression for ISO-like dates
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

  if (!isoDatePattern.test(value)) {
    return false;
  }

  // Parse the string as a Date and validate it
  const date = new Date(value);

  return !isNaN(date.getTime());
}

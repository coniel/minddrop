/**
 * Turns a value passed to a console call into its text
 * representation.
 *
 * @param value - The value to format.
 * @returns The formatted value.
 */
export function formatLogArgument(value: unknown): string {
  // Strings are logged as they were passed
  if (typeof value === 'string') {
    return value;
  }

  // Errors are logged by name and message, their stack is noise
  if (value instanceof Error) {
    return `${value.name}: ${value.message}`;
  }

  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    // Values which cannot be serialized (circular references,
    // symbols, functions) fall back to their string form
    return String(value);
  }
}

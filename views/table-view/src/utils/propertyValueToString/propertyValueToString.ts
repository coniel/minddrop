/**
 * Converts a property value of any type to a display string.
 * Handles null, undefined, Date, arrays, and primitives.
 */
export function propertyValueToString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return String(value);
}

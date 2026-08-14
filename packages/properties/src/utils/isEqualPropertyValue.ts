import { PropertyValue } from '../types';

/**
 * Checks whether two property values are equal.
 *
 * @param value - The first value.
 * @param other - The second value.
 * @returns Whether the values are equal.
 */
export function isEqualPropertyValue(
  value: PropertyValue | undefined,
  other: PropertyValue | undefined,
): boolean {
  // Dates are compared by timestamp rather than identity
  if (value instanceof Date && other instanceof Date) {
    return value.getTime() === other.getTime();
  }

  // Arrays are compared element by element, in order
  if (Array.isArray(value) && Array.isArray(other)) {
    return (
      value.length === other.length &&
      value.every((item, index) => item === other[index])
    );
  }

  return value === other;
}

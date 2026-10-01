/**
 * Checks whether a value is a finite number within the given bounds.
 *
 * @param value - The value to check.
 * @param min - The lower bound, inclusive.
 * @param max - The upper bound, inclusive. Omitted for no upper bound.
 * @returns Whether the value is a number within the bounds.
 */
export function isNumberInRange(
  value: unknown,
  min: number,
  max?: number,
): value is number {
  // Only finite numbers can be in a range
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return false;
  }

  // Check the lower bound
  if (value < min) {
    return false;
  }

  // Check the upper bound when there is one
  return max === undefined || value <= max;
}

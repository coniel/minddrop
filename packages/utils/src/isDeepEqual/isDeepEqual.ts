import { isPlainObject } from '../isPlainObject';

/**
 * Checks whether two values are structurally equal. Use `isSameValue`
 * for a shallow comparison.
 *
 * @param a - The first value.
 * @param b - The second value.
 * @returns Whether the values are equal.
 */
export function isDeepEqual(a: unknown, b: unknown): boolean {
  // Match identical values
  if (a === b) {
    return true;
  }

  // Compare dates by their time
  if (a instanceof Date || b instanceof Date) {
    return (
      a instanceof Date && b instanceof Date && a.getTime() === b.getTime()
    );
  }

  // Compare arrays by their members in order
  if (Array.isArray(a) || Array.isArray(b)) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((member, index) => isDeepEqual(member, b[index]))
    );
  }

  // Treat any other values as unequal, unless both are plain objects
  if (!isPlainObject(a) || !isPlainObject(b)) {
    return false;
  }

  // Get the first object's keys
  const keys = Object.keys(a);

  // Compare the objects by their keys and values, in any order
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => key in b && isDeepEqual(a[key], b[key]))
  );
}

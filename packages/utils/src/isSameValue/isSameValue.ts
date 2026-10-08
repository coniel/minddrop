/**
 * Checks whether two values are the same. Dates compare by their
 * time, lists by their members in order, anything else by identity.
 * Use `isDeepEqual` for nested values.
 *
 * @param a - The first value.
 * @param b - The second value.
 * @returns Whether the values are the same.
 */
export function isSameValue(a: unknown, b: unknown): boolean {
  // Compare dates by their time
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Compare lists by their members in order
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((member, index) => member === b[index])
    );
  }

  // Compare everything else by identity
  return a === b;
}

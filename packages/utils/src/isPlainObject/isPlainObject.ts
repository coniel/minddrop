/**
 * Checks whether a value is a plain object. A plain object is created
 * by an object literal or has a null prototype.
 *
 * @param value - The value to check.
 * @returns Whether the value is a plain object.
 */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  // Rule out primitives and null
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // Get the value's prototype
  const prototype = Object.getPrototypeOf(value);

  // Check the prototype is the plain object prototype or null
  return prototype === Object.prototype || prototype === null;
}

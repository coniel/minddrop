/**
 * Resolves a value given either as is or as a function returning
 * it.
 *
 * @param value - The value, or a function returning it.
 * @returns The value.
 */
export function resolveLazyValue<T>(value: T | (() => T)): T {
  // Check if the value is a function. If so, call it for the value.
  if (typeof value === 'function') {
    return (value as () => T)();
  }

  return value;
}

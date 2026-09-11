/**
 * Returns the value as an array: arrays unchanged, null and
 * undefined as an empty array, anything else wrapped.
 *
 * @param value - The value to wrap.
 * @returns The value as an array.
 */
export function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

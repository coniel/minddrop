/**
 * Checks whether a value is an object with a string `id`.
 *
 * @param value - The value to check.
 * @returns Whether the value has a string ID.
 */
export function hasStringId(value: unknown): value is { id: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { id?: unknown }).id === 'string'
  );
}

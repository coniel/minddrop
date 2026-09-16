/**
 * Renames a key in an object, keeping it in its original position.
 * The object is returned as is when it does not have the key.
 *
 * @param object - The object to rename the key in.
 * @param oldKey - The key to rename.
 * @param newKey - The new key.
 * @returns The object with the key renamed.
 */
export function renameObjectKey<TValue>(
  object: Record<string, TValue>,
  oldKey: string,
  newKey: string,
): Record<string, TValue> {
  // Check the object has the key to rename
  if (!(oldKey in object)) {
    return object;
  }

  // Rebuild the object, renaming the key where it sits
  return Object.fromEntries(
    Object.entries(object).map(([key, value]): [string, TValue] => [
      key === oldKey ? newKey : key,
      value,
    ]),
  );
}

/**
 * Changes to an object's fields. A null clears a field, an undefined
 * leaves it as it is.
 */
export type NullableChanges<TObject> = {
  [TKey in keyof TObject]?: TObject[TKey] | null;
};

/**
 * Applies changes to a copy of an object. A null change deletes the
 * field rather than storing a null. An undefined change leaves the
 * field as it is.
 *
 * @param target - The object to apply the changes to.
 * @param changes - The changes to apply.
 * @returns A copy of the object with the changes applied.
 */
export function applyNullableChanges<TObject extends object>(
  target: TObject,
  changes: NullableChanges<TObject>,
): TObject {
  // Copy the object, leaving the original untouched
  const result = { ...target };

  // Apply each change
  for (const key in changes) {
    const value = changes[key];

    // Leave the field as it is when the change is undefined
    if (value === undefined) {
      continue;
    }

    // Delete the field when the change is null
    if (value === null) {
      delete result[key];

      continue;
    }

    // Set the field
    result[key] = value;
  }

  return result;
}

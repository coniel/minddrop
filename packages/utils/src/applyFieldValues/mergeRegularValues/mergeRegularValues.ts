import { FieldValue } from '../../FieldValue';

/**
 * Merges non FieldValue values into the original values.
 *
 * @param object The original field values.
 * @param changes The changes to apply.
 */
export function mergeRegularValues<O extends object, C extends object>(
  object: O,
  changes: C,
): O {
  const merged = { ...object };

  Object.keys(changes).forEach((key) => {
    const value = changes[key];

    if (typeof value !== 'object' || !(value as FieldValue).isFieldValue) {
      merged[key] = value;
    }
  });

  return merged;
}

import { FieldValueDelete } from '../../FieldValue';

/**
 * Removes fields set to FieldValueDelete from an object.
 *
 * @param object The original field values.
 * @param changes The changes to apply.
 */
export function applyFieldValueDelete<O extends object, C extends object>(
  object: O,
  changes: C,
): O {
  const cleaned = { ...object };

  Object.keys(changes).forEach((key) => {
    const value = changes[key];

    if (
      value !== null &&
      typeof value === 'object' &&
      (value as FieldValueDelete).isFieldValue &&
      (value as FieldValueDelete).type === 'delete'
    ) {
      delete cleaned[key];
    }
  });

  return cleaned;
}

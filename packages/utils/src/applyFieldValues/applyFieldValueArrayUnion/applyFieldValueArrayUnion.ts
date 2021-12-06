import { FieldValueArrayUnion } from '../../FieldValue';

/**
 * Appplies FieldValueArrayUnion by merging the elements
 * into the existing field's values, or adding the field
 * if it does not exist.
 *
 * @param object The original field values.
 * @param changes The changes to apply.
 */
export function applyFieldValueArrayUnion<O extends object, C extends object>(
  object: O,
  changes: C,
): O {
  const merged = { ...object };

  Object.keys(changes).forEach((key) => {
    const value = changes[key] as FieldValueArrayUnion;

    if (
      typeof value === 'object' &&
      value.isFieldValue &&
      value.type === 'array-union'
    ) {
      if (typeof object[key] !== 'undefined') {
        merged[key] = [...object[key], ...value.elements];
      } else {
        merged[key] = value.elements;
      }
    }
  });

  return merged;
}

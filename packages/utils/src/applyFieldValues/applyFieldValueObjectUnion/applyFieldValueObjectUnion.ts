import { applyFieldValues } from '../applyFieldValues';
import { FieldValueObjectUnion } from '../../FieldValue';

/**
 * Appplies FieldValueObjectUnion by merging the elements
 * into the existing field's values, or adding the field
 * if it does not exist.
 *
 * @param object The original field values.
 * @param changes The changes to apply.
 */
export function applyFieldValueObjectUnion<O extends object, C extends object>(
  object: O,
  changes: C,
): O {
  const merged = { ...object };

  Object.keys(changes).forEach((key) => {
    const value = changes[key] as FieldValueObjectUnion;

    if (
      value !== null &&
      typeof value === 'object' &&
      value.isFieldValue &&
      value.type === 'object-union'
    ) {
      merged[key] = applyFieldValues(object[key] || {}, changes[key].value);
    }
  });

  return merged;
}

import { FieldValueArrayRemove } from '../../FieldValue';

/**
 * Appplies FieldValueArrayRemove by removing the elements
 * from the field's elements.
 *
 * @param object The original field values.
 * @param changes The changes to apply.
 */
export function applyFieldValueArrayRemove<O extends object, C extends object>(
  object: O,
  changes: C,
): O {
  const removed = { ...object };

  Object.keys(changes).forEach((key) => {
    const value = changes[key] as FieldValueArrayRemove;

    if (
      typeof value === 'object' &&
      value.isFieldValue &&
      value.type === 'array-remove'
    ) {
      const elements = Array.isArray(value.elements)
        ? value.elements
        : [value.elements];

      if (Array.isArray(object[key])) {
        removed[key] = object[key].filter(
          (element) => elements.indexOf(element) === -1,
        );
      }
    }
  });

  return removed;
}

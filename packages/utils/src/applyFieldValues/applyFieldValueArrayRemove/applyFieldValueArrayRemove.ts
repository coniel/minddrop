import { arrayContainsObject } from '../../arrayContainsObject';
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
      value !== null &&
      typeof value === 'object' &&
      value.isFieldValue &&
      value.type === 'array-remove'
    ) {
      // Make sure the target property is an array
      if (Array.isArray(object[key])) {
        // If a single element was provided as the element to remove
        // turn it into an array.
        const elements = Array.isArray(value.elements)
          ? value.elements
          : [value.elements];

        // Filter out the elements to remove
        removed[key] = object[key].filter((element) =>
          typeof element === 'object' && element !== null
            ? // Filter out object
              !arrayContainsObject(elements, element)
            : // Filter out primitive
              elements.indexOf(element) === -1,
        );
      }
    }
  });

  return removed;
}

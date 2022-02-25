import { FieldValueArrayFilter } from '../../FieldValue';

/**
 * Appplies FieldValueArrayFilter by running the filter
 * callback on the array.
 *
 * @param object The original field values.
 * @param changes The changes to apply.
 */
export function applyFieldValueArrayFilter<O extends object, C extends object>(
  object: O,
  changes: C,
): O {
  const filtered = { ...object };

  Object.keys(changes).forEach((key) => {
    const value = changes[key] as FieldValueArrayFilter;

    if (
      value !== null &&
      typeof value === 'object' &&
      value.isFieldValue &&
      value.type === 'array-filter'
    ) {
      const { callback } = value;

      if (Array.isArray(object[key])) {
        filtered[key] = object[key].filter(callback);
      }
    }
  });

  return filtered;
}

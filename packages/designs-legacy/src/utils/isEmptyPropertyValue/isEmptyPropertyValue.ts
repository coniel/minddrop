import { PropertyValue } from '@minddrop/properties';

/**
 * Determines whether a property value counts as empty for the
 * purpose of an element's empty behavior: null, undefined, an
 * empty string, or an empty array. Zero and false are values,
 * not empty.
 *
 * @param value - The property value to check.
 * @returns Whether the value is empty.
 */
export function isEmptyPropertyValue(
  value: PropertyValue | undefined,
): boolean {
  // Missing values are empty
  if (value == null) {
    return true;
  }

  // Empty string is empty
  if (value === '') {
    return true;
  }

  // Empty array is empty
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
}

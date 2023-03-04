/**
 * Checks whether an array contains the given object.
 * For an object to be considered a part of the array,
 * an object in the array must contain the same keys
 * with the same values. Only performs a shallow
 * comparison of objects.
 *
 * @param array The array in which to check.
 * @param object The object to check for.
 * @returns Whether the object is on the array.
 */
export function arrayContainsObject(
  array: unknown[],
  object: Record<any, any>,
): boolean {
  // Get the object's keys
  const keys = Object.keys(object);

  // Look for equivalent object in the array
  return !!array.find((arrayItem) => {
    // Check that the array item is an non-null object
    if (typeof arrayItem !== 'object' || arrayItem === null) {
      return false;
    }

    // Objects are not equal if they have a different key count
    let areEqual = keys.length === Object.keys(arrayItem).length;

    if (areEqual) {
      const objectItem = arrayItem as Record<any, any>;

      // If the objects have the same key count, check that they
      // have the same key values.
      keys.forEach((key) => {
        if (areEqual) {
          areEqual = object[key] === objectItem[key];
        }
      });
    }

    return areEqual;
  });
}

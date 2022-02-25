/**
 * Checks whether two arrays contain the same elements,
 * ignoring the order of the elements.
 *
 * @param array1 The array to check.
 * @param array2 The array to check against.
 * @returns Whether or not the arrays are equal.
 */
export function isEqual(array1, array2): boolean {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (array2.includes(element)) {
        return true;
      }

      return false;
    });
  }

  return false;
}

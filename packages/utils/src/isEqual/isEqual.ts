import { contains } from '../contains';

type ComparisonItem =
  | string
  | number
  | null
  | boolean
  | Record<any, string | number | null | boolean>;

/**
 * Checks whether two arrays contain the same content,
 * ignoring the order of the elements. Supports items
 * of type: string, number, null, boolean, and objects
 * containing the above types.
 *
 * @param array1 The array to check.
 * @param array2 The array to check against.
 * @returns Whether or not the arrays are equal.
 */
export function isEqual(
  array1: ComparisonItem[],
  array2: ComparisonItem[],
): boolean {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (contains(array2, [element])) {
        return true;
      }

      return false;
    });
  }

  return false;
}

import { contains } from '../contains';

type ComparisonItem =
  | string
  | number
  | null
  | boolean
  | Record<any, string | number | null | boolean>;

/**
 * Checks that an array does not contain any of the items
 * in another array. Supports items of type: string,
 * number, null, boolean, and objects containing the
 * above types.
 *
 * @param haystack The array against which to check for items.
 * @param needles The array of items to check.
 * @returns `true` if the array does not contain any of the items.
 */
export function doesNotContain<TItem extends ComparisonItem = ComparisonItem>(
  haystack: TItem[],
  needles: TItem[],
): boolean {
  // Check if the haystack contains any of the needles
  const doesContain = needles.some((item) => {
    if (typeof item === 'object' && item !== null) {
      return contains(haystack, [item]);
    }

    return haystack.includes(item);
  });

  return !doesContain;
}

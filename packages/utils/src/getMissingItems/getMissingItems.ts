/**
 * Returns items from the 'needles' array which are
 * not present in the 'haystack' array.
 */
export function getMissingItems<T = string | number>(
  haystack: T[],
  needles: T[],
): T[] {
  return needles.filter((needle) => !haystack.includes(needle));
}

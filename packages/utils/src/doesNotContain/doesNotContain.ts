/**
 * Checks that an array does not contain any of the items
 * in another array.
 *
 * @param haystack The array against which to check for items.
 * @param needle The array of items to check.
 * @returns `true` if the array does not contain any of the items.
 */
export function doesNotContain(haystack: any[], needle: any[]): boolean {
  return !needle.some((value) => haystack.includes(value));
}

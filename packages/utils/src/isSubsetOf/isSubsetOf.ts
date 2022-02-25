/**
 * Checks whether all items in an array are present
 * in another array.
 *
 * @param subsetArray The potential subset array to check for.
 * @param targetArray The array against which to check.
 */
export function isSubsetOf(subsetArray: any[], targetArray: any[]): boolean {
  return subsetArray.every((item) => targetArray.includes(item));
}

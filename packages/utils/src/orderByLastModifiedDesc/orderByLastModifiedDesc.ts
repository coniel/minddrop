/**
 * Sort comparator ordering items by last modified date, newest
 * first.
 *
 * @param a - The first item to compare.
 * @param b - The second item to compare.
 * @returns The items' sort order.
 */
export function orderByLastModifiedDesc(
  a: { lastModified: Date },
  b: { lastModified: Date },
): number {
  return b.lastModified.getTime() - a.lastModified.getTime();
}

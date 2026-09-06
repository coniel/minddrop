/**
 * Sort comparator ordering items by last modified date, oldest
 * first.
 *
 * @param a - The first item to compare.
 * @param b - The second item to compare.
 * @returns The items' sort order.
 */
export function orderByLastModified(
  a: { lastModified: Date },
  b: { lastModified: Date },
): number {
  return a.lastModified.getTime() - b.lastModified.getTime();
}

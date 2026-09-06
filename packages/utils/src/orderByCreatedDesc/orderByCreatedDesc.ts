/**
 * Sort comparator ordering items by creation date, newest first.
 *
 * @param a - The first item to compare.
 * @param b - The second item to compare.
 * @returns The items' sort order.
 */
export function orderByCreatedDesc(
  a: { created: Date },
  b: { created: Date },
): number {
  return b.created.getTime() - a.created.getTime();
}

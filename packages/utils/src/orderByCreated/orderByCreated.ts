/**
 * Sort comparator ordering items by creation date, oldest first.
 *
 * @param a - The first item to compare.
 * @param b - The second item to compare.
 * @returns The items' sort order.
 */
export function orderByCreated(
  a: { created: Date },
  b: { created: Date },
): number {
  return a.created.getTime() - b.created.getTime();
}

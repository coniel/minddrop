/**
 * Sort comparator ordering items alphabetically by name.
 *
 * @param a - The first item to compare.
 * @param b - The second item to compare.
 * @returns The items' sort order.
 */
export function orderByName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

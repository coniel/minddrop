/**
 * Inserts an item into a group's items at the given index, dropping
 * it from its current position first so that the group never lists
 * it twice.
 *
 * The index is the item's position in the returned list, not in the
 * list as it was given. Moving an item later in a list it already
 * belongs to therefore lands it where the index says, rather than
 * one place short of it.
 *
 * @param items - The group's items.
 * @param itemId - The ID of the item to insert.
 * @param index - The position to insert the item at, appending it when omitted.
 * @returns The items with the item at the given index.
 */
export function insertGroupItem(
  items: string[],
  itemId: string,
  index?: number,
): string[] {
  // Drop the item from its current position
  const remaining = items.filter((id) => id !== itemId);

  // Insert it at the given index, appending it when none is given
  remaining.splice(index ?? remaining.length, 0, itemId);

  return remaining;
}

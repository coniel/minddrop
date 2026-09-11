/**
 * Returns the position dropped items take in a list's resulting
 * order, given the position they were dropped at in the list as it
 * currently stands.
 *
 * A dropped item the list already holds above the drop position is
 * removed before being reinserted, so the position it lands at is
 * one place earlier for each of them.
 *
 * @param ids - The list's IDs in the order it holds them.
 * @param droppedIds - The IDs of the dropped items.
 * @param index - The position the items were dropped at.
 * @returns The position the items take in the resulting order.
 */
export function resolveDropIndex(
  ids: string[],
  droppedIds: string[],
  index: number,
): number {
  // The dropped items the list holds above the drop position
  const listedAbove = droppedIds.filter((droppedId) => {
    const currentIndex = ids.indexOf(droppedId);

    return currentIndex > -1 && currentIndex < index;
  });

  return index - listedAbove.length;
}

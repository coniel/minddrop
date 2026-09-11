import { resolveDropIndex } from '../resolveDropIndex';

/**
 * Returns a list's IDs in the order they are held after dropping
 * items at a position in the list as it currently stands.
 *
 * @param ids - The list's IDs in the order it holds them.
 * @param droppedIds - The IDs of the dropped items.
 * @param index - The position the items were dropped at.
 * @returns The IDs in their resulting order.
 */
export function resolveDropOrder(
  ids: string[],
  droppedIds: string[],
  index: number,
): string[] {
  // Drop the items from the positions they currently hold
  const remaining = ids.filter((id) => !droppedIds.includes(id));

  // Insert them at the position they landed at
  remaining.splice(resolveDropIndex(ids, droppedIds, index), 0, ...droppedIds);

  return remaining;
}

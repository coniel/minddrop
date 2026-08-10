/**
 * Returns whether two ID lists contain the same IDs, ignoring
 * order.
 *
 * @param ids - The first ID list.
 * @param other - The second ID list.
 * @returns Whether the lists contain the same IDs.
 */
export function sameIds(ids: string[], other: string[]): boolean {
  // Lists of differing length can never match
  if (ids.length !== other.length) {
    return false;
  }

  const idSet = new Set(ids);

  return other.every((id) => idSet.has(id));
}

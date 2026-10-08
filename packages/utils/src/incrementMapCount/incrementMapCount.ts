/**
 * Adds one to a key's count in a map of counts. A key the map does not
 * have yet starts from zero.
 *
 * @param counts - The map of counts to update.
 * @param key - The key whose count to increment.
 * @returns The key's new count.
 */
export function incrementMapCount<TKey>(
  counts: Map<TKey, number>,
  key: TKey,
): number {
  // Add one to the key's count
  const count = (counts.get(key) ?? 0) + 1;

  // Store the new count
  counts.set(key, count);

  return count;
}

import { hasStringId } from '@minddrop/utils';

/**
 * Resolves the IDs of the dragged items of the given types from a
 * drag's data. The data lists the items of each type under the type.
 *
 * @param data - The drag's data, keyed by data type.
 * @param types - The types of item to read.
 * @returns The IDs of the dragged items of those types.
 */
export function resolveDraggedItemIds(
  data: Record<string, unknown>,
  types: string[],
): string[] {
  // Read the IDs listed under each type
  return types.flatMap((type) => {
    // Read the items listed under the type
    const items = data[type];

    if (!Array.isArray(items)) {
      return [];
    }

    // Return the IDs of the items which have one
    return items.flatMap((item) => (hasStringId(item) ? [item.id] : []));
  });
}

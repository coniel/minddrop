import { StoreContents } from '../../types';

/**
 * Counts the items or values a store holds.
 *
 * @param contents - The store's contents.
 * @returns How many items or values the store holds.
 */
export function getStoreContentsCount(contents: StoreContents): number {
  if (contents.kind === 'items') {
    return contents.items.length;
  }

  return Object.keys(contents.values).length;
}

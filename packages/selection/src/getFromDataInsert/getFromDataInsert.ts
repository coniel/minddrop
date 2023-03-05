import { DataInsert } from '@minddrop/core';
import { filterSelectionItems } from '../filterSelectionItems';
import { SelectionItem } from '../types';

/**
 * Returns the selection items contained in by DataInsert.
 *
 * Optionally, one or more item types can be passed
 * in to retrieve only selection items matching the
 * item types.
 *
 * @param dataInsert - The data insert from which to retrieve selection items.
 * @param resource - The item type(s) of the selection items to retrieve.
 * @returns An array of selection items.
 */
export function getFromDataInsert(
  dataInsert: DataInsert,
  itemType?: string,
): SelectionItem[] {
  // Get the keys of selection item types included
  // in the data insert.
  const items = dataInsert.types.filter((type) =>
    type.startsWith('minddrop-selection/'),
  );

  // Get the selection items from the data insert,
  // parsing and combining them into a single array.
  const selectionItems = items.reduce(
    (items, item) => [...items, ...JSON.parse(dataInsert.data[item])],
    [] as SelectionItem[],
  );

  if (itemType) {
    // If item type filter was passed in, filter the selection
    return filterSelectionItems(selectionItems, itemType);
  }

  return selectionItems;
}

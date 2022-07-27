import { DataInsert } from '@minddrop/core';
import { filterSelectionItems } from '../filterSelectionItems';
import { SelectionItem } from '../types';

/**
 * Returns the selection items contained in by DataInsert.
 *
 * Optionally, one or more resource types can be passed
 * in to retrieve only selection items matching the
 * resource types.
 *
 * @param dataInsert - The data insert from which to retrieve selection items.
 * @param resource - The resource type(s) of the selection items to retrieve.
 * @returns An array of selection items.
 */
export function getFromDataInsert(
  dataInsert: DataInsert,
  resource?: string,
): SelectionItem[] {
  // Get the keys of selection item resources included
  // in the data insert.
  const resources = dataInsert.types.filter((type) =>
    type.startsWith('minddrop-selection/'),
  );

  // Get the selection items from the data insert,
  // parsing and combining them into a single array.
  const selectionItems = resources.reduce(
    (items, resource) => [...items, ...JSON.parse(dataInsert.data[resource])],
    [],
  );

  if (resource) {
    // If resource filter was passed in, filter the selection
    return filterSelectionItems(selectionItems, resource);
  }

  return selectionItems;
}

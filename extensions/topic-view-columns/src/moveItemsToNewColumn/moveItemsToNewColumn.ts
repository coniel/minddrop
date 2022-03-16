import { generateId } from '@minddrop/utils';
import { removeEmptiedColumns } from '../removeEmptiedColumns';
import { removeItemsFromColumns } from '../removeItemsFromColumns';
import { Columns } from '../types';

/**
 * Moves items from existing columns into a new column
 * at a given index.
 *
 * @param columns The columns within which to move the items.
 * @param itemIds The IDs of the items to move.
 * @param newColumnIndex The index at which to create the new column.
 * @returns Updated columns.
 */
export function moveItemsToNewColumn(
  columns: Columns,
  itemIds: string[],
  newColumnIndex: number,
): Columns {
  // Get moved items
  const movedItems = columns
    .reduce((allItems, column) => [...allItems, ...column.items], [])
    .filter((item) => itemIds.includes(item.id));

  // Remove moved items from existing columns
  let updatedColumns = removeItemsFromColumns(columns, itemIds);

  // Insert moved intems as new column
  updatedColumns.splice(newColumnIndex, 0, {
    id: generateId(),
    items: movedItems,
  });

  // Remove emptied columns
  updatedColumns = removeEmptiedColumns(columns, updatedColumns);

  return updatedColumns;
}

import { Columns } from '../types';

/**
 * Removes items from columns.
 *
 * @param columns The columns from which to remove the items.
 * @param itemIds The IDs of the items to remove.
 * @returns The updated columns.
 */
export function removeItemsFromColumns(
  columns: Columns,
  itemIds: string[],
): Columns {
  // Clone the columns to remove nested references
  const clonedColumns = JSON.parse(JSON.stringify(columns));

  // Loop through columns and filter out removed drop IDs
  clonedColumns.forEach((column, index) => {
    clonedColumns[index] = columns[index].filter(
      (item) => !itemIds.includes(item.id),
    );
  });

  return clonedColumns;
}

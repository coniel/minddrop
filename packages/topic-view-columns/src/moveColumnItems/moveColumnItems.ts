import { ColumnItem, Columns } from '../types';

/**
 * Moves items within and between columns to a new column
 * or position.
 *
 * @param columns The current columns state.
 * @param items The items to move.
 * @param toColumn The column to which the items are being moved.
 * @param toIndex The index within the column to which the items are being moved.
 */
export function moveColumnItems(
  columns: Columns,
  items: ColumnItem[],
  toColumn: number,
  toIndex: number,
): Columns {
  const itemIds = items.map((item) => item.id);
  const updated = [...columns];

  // Remove items from non target columns
  columns.forEach((column, index) => {
    if (index !== toColumn) {
      updated[index] = columns[index].filter(
        (item) => !itemIds.includes(item.id),
      );
    }
  });

  // Split target column at insert index and remove moved
  // items from each half
  const firstHalf = columns[toColumn]
    .slice(0, toIndex)
    .filter((item) => !itemIds.includes(item.id));
  const secondHalf = columns[toColumn]
    .slice(toIndex)
    .filter((item) => !itemIds.includes(item.id));

  // Merge target columns halfs with inserted items in between
  updated[toColumn] = [...firstHalf, ...items, ...secondHalf];

  return updated;
}

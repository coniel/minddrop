import { ColumnItem, TopicViewColumnsData } from '../types';

/**
 * Distributes drops evenly into columns by adding
 * them to the least populated column first.
 *
 * @param columns The current column values.
 * @param drops The items to add to the columns.
 * @returns The updated column values.
 */
export function distributeItemsBetweenColumns(
  initialColumns: TopicViewColumnsData['columns'],
  items: ColumnItem[],
): TopicViewColumnsData['columns'] {
  // Loop through drops, adding each one to the shortest column
  return items.reduce((columns, item) => {
    // Index of the column with the least drops
    let shortestColumn = 0;
    // Drop count in the column with the least drops
    let minDropCount = columns[0].length;

    // Loop through each column and find the shortest one
    Object.keys(columns).forEach((columnIndex) => {
      if (columns[columnIndex].length < minDropCount) {
        minDropCount = columns[columnIndex].length;
        shortestColumn = parseInt(columnIndex, 10);
      }
    });

    // Add the drop to the end of the shortest column
    return {
      ...columns,
      [shortestColumn]: [...columns[shortestColumn], item],
    };
  }, initialColumns);
}

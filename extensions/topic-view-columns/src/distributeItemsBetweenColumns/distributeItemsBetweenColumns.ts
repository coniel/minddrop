import { ResourceReference } from '@minddrop/resources';
import { Columns, TopicViewColumnsData } from '../types';

/**
 * Distributes drops evenly into columns by adding
 * them to the least populated column first.
 *
 * @param initialColumns The current column values.
 * @param drops The items to add to the columns.
 * @returns The updated column values.
 */
export function distributeItemsBetweenColumns(
  initialColumns: TopicViewColumnsData['columns'],
  items: ResourceReference[],
): TopicViewColumnsData['columns'] {
  // Clone the initial columns array to remove nested references
  const clonedInitialColumns: Columns = JSON.parse(
    JSON.stringify(initialColumns),
  );

  // Loop through drops, adding each one to the shortest column
  return items.reduce((columns, item) => {
    const updatedColumns = [...columns];

    // Index of the column with the least drops
    let shortestColumn = 0;
    // Drop count in the column with the least drops
    let minDropCount = columns[0].items.length;

    // Loop through each column and find the shortest one
    columns.forEach((column, index) => {
      if (columns[index].items.length < minDropCount) {
        minDropCount = columns[index].items.length;
        shortestColumn = index;
      }
    });

    // Add the drop to the end of the shortest column
    updatedColumns[shortestColumn].items.push(item);

    return updatedColumns;
  }, clonedInitialColumns);
}

import { Columns } from '../types';

/**
 * Removes emptied columns. Compares the original
 * columns state to the new state in order to determine
 * which columns to remove.
 *
 * @param originalState The original column values, before they were updated.
 * @param newState The updated column values.
 * @returns The updated columns.
 */
export function removeEmptiedColumns(
  originalState: Columns,
  newState: Columns,
): Columns {
  let updated = [...newState];

  // Get a list of emptied column indexes by comparing the new
  // column length to the original one.
  const emptiedColumnIds = [];
  originalState.forEach((column) => {
    // Get the updated column
    const updatedColumn = newState.find(({ id }) => id === column.id);
    // If the column is empty but was not originally empty, it's been emptied
    if (updatedColumn.items.length === 0 && column.items.length !== 0) {
      emptiedColumnIds.push(column.id);
    }
  });

  // Filter out emptied columns
  updated = updated.filter((column) => !emptiedColumnIds.includes(column.id));

  return updated;
}

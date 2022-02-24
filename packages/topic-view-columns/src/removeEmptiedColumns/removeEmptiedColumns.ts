import { ColumnItem, Columns } from '../types';

/**
 * Removes emptied columns. Compares the original
 * columns state to the new state in order to determine
 * which columns to remove.
 *
 * @param originalState The original column values, before they were updated.
 * @param newState The updated column values.
 * @param addedColumnIndex The index of the new column if a column was added.
 * @returns The updated columns.
 */
export function removeEmptiedColumns(
  originalState: Columns,
  newState: Columns,
  addedColumnIndex?: number,
): Columns {
  // Clone columns to prevent remove nested reference
  const updated: Columns = JSON.parse(JSON.stringify(newState));
  // The added column, if one was added
  let addedColumn: ColumnItem[];

  // If a column was added, temporarily remove it to make columns
  // comparison easier.
  if (typeof addedColumnIndex !== 'undefined') {
    [addedColumn] = updated.splice(addedColumnIndex, 1);
  }

  // Get a list of emptied column indexes by comparing the new
  // column length to the original one.
  const emptiedColumnIndexes = [];
  updated.forEach((column, index) => {
    // If the column is empty but was not originally empty, it's been emptied
    if (column.length === 0 && originalState[index].length !== 0) {
      emptiedColumnIndexes.push(index);
    }
  });

  emptiedColumnIndexes.forEach((index) => {
    // Remove emptied column
    updated.splice(index, 1);
  });

  if (addedColumn) {
    // Adjust addedColumnIndex to account for removed columns
    // which appeared before it.
    let adjustedAddedColumnIndex = addedColumnIndex;
    emptiedColumnIndexes.forEach((index) => {
      if (index < addedColumnIndex) {
        // If the removed column appeared before the added one
        // decrement the added column's index.
        adjustedAddedColumnIndex -= 1;
      }
    });

    // Return the added column back into the updated state
    updated.splice(adjustedAddedColumnIndex, 0, addedColumn);
  }

  return updated;
}

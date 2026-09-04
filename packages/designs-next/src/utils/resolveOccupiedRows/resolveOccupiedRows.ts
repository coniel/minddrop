import { DesignElement } from '../../types';

/**
 * Resolves which rows are occupied by at least one element.
 *
 * @param elements - The design's elements.
 * @param rows - The design's row count.
 * @returns A flag per row, true when occupied.
 */
export function resolveOccupiedRows(
  elements: DesignElement[],
  rows: number,
): boolean[] {
  // Start with every row unoccupied
  const occupied = new Array<boolean>(rows).fill(false);

  // Mark every row covered by an element's span
  elements.forEach((element) => {
    for (
      let row = element.row;
      row < Math.min(element.row + element.rowSpan, rows);
      row += 1
    ) {
      occupied[row] = true;
    }
  });

  return occupied;
}

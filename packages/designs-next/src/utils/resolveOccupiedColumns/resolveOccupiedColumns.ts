import { DesignElement } from '../../types';

/**
 * Resolves which columns are occupied by at least one element.
 *
 * @param elements - The card's elements.
 * @param columns - The card's column count.
 * @returns A flag per column, true when occupied.
 */
export function resolveOccupiedColumns(
  elements: DesignElement[],
  columns: number,
): boolean[] {
  // Start with every column unoccupied
  const occupied = new Array<boolean>(columns).fill(false);

  // Mark every column covered by an element's span
  elements.forEach((element) => {
    for (
      let column = element.column;
      column < Math.min(element.column + element.columnSpan, columns);
      column += 1
    ) {
      occupied[column] = true;
    }
  });

  return occupied;
}

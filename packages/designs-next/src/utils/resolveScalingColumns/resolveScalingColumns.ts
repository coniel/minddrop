import { DesignElement } from '../../types';
import { resolveOccupiedColumns } from '../resolveOccupiedColumns';

/**
 * Resolves which columns scale when the card resizes. Fluid elements
 * make their columns scale while all gaps keep their fixed unit
 * width. Only when no fluid element is present do fixed elements make
 * the gap columns on their unpinned side scale instead, so they stay
 * pinned to the other edge.
 *
 * @param elements - The card's elements.
 * @param columns - The card's column count.
 * @returns A flag per column, true when the column scales.
 */
export function resolveScalingColumns(
  elements: DesignElement[],
  columns: number,
): boolean[] {
  // Resolve which columns elements occupy
  const occupied = resolveOccupiedColumns(elements, columns);

  // Start with every column fixed
  const scaling = new Array<boolean>(columns).fill(false);

  // Check if any element is fluid
  const hasFluid = elements.some((element) => element.widthMode === 'fluid');

  // Mark the columns each element makes scale
  elements.forEach((element) => {
    // Fluid elements scale across their own columns
    if (element.widthMode === 'fluid') {
      for (
        let column = element.column;
        column < Math.min(element.column + element.columnSpan, columns);
        column += 1
      ) {
        scaling[column] = true;
      }

      return;
    }

    // Fixed elements only absorb space as a fallback, a fluid element
    // takes it all and leaves every gap at its unit width.
    if (hasFluid) {
      return;
    }

    // Pinned left or centered: the gap to the element's right absorbs
    // the space.
    if (
      element.widthMode === 'fixed-left' ||
      element.widthMode === 'fixed-center'
    ) {
      for (
        let column = element.column + element.columnSpan;
        column < columns && !occupied[column];
        column += 1
      ) {
        scaling[column] = true;
      }
    }

    // Pinned right or centered: the gap to the element's left absorbs
    // the space.
    if (
      element.widthMode === 'fixed-right' ||
      element.widthMode === 'fixed-center'
    ) {
      for (
        let column = element.column - 1;
        column >= 0 && !occupied[column];
        column -= 1
      ) {
        scaling[column] = true;
      }
    }
  });

  return scaling;
}

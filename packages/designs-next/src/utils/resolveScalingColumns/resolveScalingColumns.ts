import { DesignElement } from '../../types';
import { resolveOccupiedColumns } from '../resolveOccupiedColumns';

/**
 * Resolves which columns scale when the card resizes. Fluid elements
 * make their columns scale while all gaps keep their fixed unit
 * width. Only when no fluid element is present do fixed elements make
 * the gap columns on their unpinned side scale instead, so they stay
 * pinned to the other edge. Gaps between consecutive same-side-pinned
 * elements stay fixed, so a pinned chain holds its spacing and the
 * extra space moves past the chain.
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

    // Check if the gap to the right leads to another left-pinned
    // element. If so, the gap is internal to a left-pinned chain and
    // stays fixed.
    const chainsLeft =
      element.widthMode === 'fixed-left' &&
      resolveNextElement(element, elements)?.widthMode === 'fixed-left';

    // Pinned left or centered: the gap to the element's right absorbs
    // the space.
    if (
      !chainsLeft &&
      (element.widthMode === 'fixed-left' ||
        element.widthMode === 'fixed-center')
    ) {
      for (
        let column = element.column + element.columnSpan;
        column < columns && !occupied[column];
        column += 1
      ) {
        scaling[column] = true;
      }
    }

    // Check if the gap to the left leads to another right-pinned
    // element. If so, the gap is internal to a right-pinned chain and
    // stays fixed.
    const chainsRight =
      element.widthMode === 'fixed-right' &&
      resolvePreviousElement(element, elements)?.widthMode === 'fixed-right';

    // Pinned right or centered: the gap to the element's left absorbs
    // the space.
    if (
      !chainsRight &&
      (element.widthMode === 'fixed-right' ||
        element.widthMode === 'fixed-center')
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

/**
 * Resolves the nearest element to the right of an element.
 *
 * @param element - The element to look right from.
 * @param elements - The elements to search.
 * @returns The nearest element to the right, or null if there is none.
 */
function resolveNextElement(
  element: DesignElement,
  elements: DesignElement[],
): DesignElement | null {
  const end = element.column + element.columnSpan;

  // Take the closest element starting at or past the right edge
  return elements
    .filter((other) => other.column >= end)
    .reduce<DesignElement | null>(
      (nearest, other) =>
        !nearest || other.column < nearest.column ? other : nearest,
      null,
    );
}

/**
 * Resolves the nearest element to the left of an element.
 *
 * @param element - The element to look left from.
 * @param elements - The elements to search.
 * @returns The nearest element to the left, or null if there is none.
 */
function resolvePreviousElement(
  element: DesignElement,
  elements: DesignElement[],
): DesignElement | null {
  // Take the closest element ending at or before the left edge
  return elements
    .filter((other) => other.column + other.columnSpan <= element.column)
    .reduce<DesignElement | null>(
      (nearest, other) =>
        !nearest ||
        other.column + other.columnSpan > nearest.column + nearest.columnSpan
          ? other
          : nearest,
      null,
    );
}

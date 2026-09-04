import { DesignElement, ElementHeightMode } from '../../types';
import { resolveOccupiedRows } from '../resolveOccupiedRows';

/**
 * Resolves which rows scale when an aspect-locked design's height
 * changes. Fluid-height elements make their rows scale while all
 * gaps keep their fixed unit height. Only when no fluid-height
 * element is present do fixed elements make the gap rows on their
 * unpinned side scale instead, so they stay pinned to the other
 * edge. Gaps between consecutive same-side-pinned elements stay
 * fixed, so a pinned chain holds its spacing and the extra space
 * moves past the chain.
 *
 * @param elements - The design's elements.
 * @param rows - The design's row count.
 * @returns A flag per row, true when the row scales.
 */
export function resolveScalingRows(
  elements: DesignElement[],
  rows: number,
): boolean[] {
  // Resolve which rows elements occupy
  const occupied = resolveOccupiedRows(elements, rows);

  // Start with every row fixed
  const scaling = new Array<boolean>(rows).fill(false);

  // Check if any element has a fluid height
  const hasFluid = elements.some(
    (element) => resolveHeightMode(element) === 'fluid',
  );

  // Mark the rows each element makes scale
  elements.forEach((element) => {
    const heightMode = resolveHeightMode(element);

    // Fluid-height elements scale across their own rows
    if (heightMode === 'fluid') {
      for (
        let row = element.row;
        row < Math.min(element.row + element.rowSpan, rows);
        row += 1
      ) {
        scaling[row] = true;
      }

      return;
    }

    // Fixed elements only absorb space as a fallback, a fluid-height
    // element takes it all and leaves every gap at its unit height.
    if (hasFluid) {
      return;
    }

    // Check if the gap below leads to another top-pinned element. If
    // so, the gap is internal to a top-pinned chain and stays fixed.
    const chainsTop =
      heightMode === 'fixed-top' &&
      resolveHeightMode(resolveElementBelow(element, elements)) === 'fixed-top';

    // Pinned top or centered: the gap below the element absorbs the
    // space.
    if (
      !chainsTop &&
      (heightMode === 'fixed-top' || heightMode === 'fixed-center')
    ) {
      for (
        let row = element.row + element.rowSpan;
        row < rows && !occupied[row];
        row += 1
      ) {
        scaling[row] = true;
      }
    }

    // Check if the gap above leads to another bottom-pinned element.
    // If so, the gap is internal to a bottom-pinned chain and stays
    // fixed.
    const chainsBottom =
      heightMode === 'fixed-bottom' &&
      resolveHeightMode(resolveElementAbove(element, elements)) ===
        'fixed-bottom';

    // Pinned bottom or centered: the gap above the element absorbs
    // the space.
    if (
      !chainsBottom &&
      (heightMode === 'fixed-bottom' || heightMode === 'fixed-center')
    ) {
      for (let row = element.row - 1; row >= 0 && !occupied[row]; row -= 1) {
        scaling[row] = true;
      }
    }
  });

  return scaling;
}

/**
 * Resolves an element's height mode, defaulting to fluid.
 *
 * @param element - The element, or null when there is none.
 * @returns The element's height mode, or null without an element.
 */
function resolveHeightMode(
  element: DesignElement | null,
): ElementHeightMode | null {
  if (!element) {
    return null;
  }

  return element.heightMode ?? 'fluid';
}

/**
 * Resolves the nearest element below an element.
 *
 * @param element - The element to look down from.
 * @param elements - The elements to search.
 * @returns The nearest element below, or null if there is none.
 */
function resolveElementBelow(
  element: DesignElement,
  elements: DesignElement[],
): DesignElement | null {
  const end = element.row + element.rowSpan;

  // Take the closest element starting at or past the bottom edge
  return elements
    .filter((other) => other.row >= end)
    .reduce<DesignElement | null>(
      (nearest, other) =>
        !nearest || other.row < nearest.row ? other : nearest,
      null,
    );
}

/**
 * Resolves the nearest element above an element.
 *
 * @param element - The element to look up from.
 * @param elements - The elements to search.
 * @returns The nearest element above, or null if there is none.
 */
function resolveElementAbove(
  element: DesignElement,
  elements: DesignElement[],
): DesignElement | null {
  // Take the closest element ending at or before the top edge
  return elements
    .filter((other) => other.row + other.rowSpan <= element.row)
    .reduce<DesignElement | null>(
      (nearest, other) =>
        !nearest || other.row + other.rowSpan > nearest.row + nearest.rowSpan
          ? other
          : nearest,
      null,
    );
}

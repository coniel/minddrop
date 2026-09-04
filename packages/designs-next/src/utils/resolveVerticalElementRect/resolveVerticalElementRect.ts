import { UnitPixelSize } from '../../constants';
import { DesignElement } from '../../types';
import { resolveOccupiedRows } from '../resolveOccupiedRows';
import { resolveScalingRows } from '../resolveScalingRows';
import { resolveVerticalContextElements } from '../resolveVerticalContextElements';

export interface ElementVerticalRect {
  /**
   * Pixel offset of the element's top edge.
   */
  top: number;

  /**
   * Pixel height of the element.
   */
  height: number;
}

/**
 * Resolves an element's vertical pixel rect at a given card height
 * in an aspect-locked design. Row heights are classified against the
 * element's own vertical context: scaling rows share the space left
 * after fixed rows take one unit height each. When the card is too
 * short for the fixed rows, gap rows compress toward zero first and
 * element rows compress only after them, so the locked ratio holds
 * without shrinking pinned elements while flexible space remains.
 *
 * @param element - The element to resolve the rect for.
 * @param elements - The design's elements.
 * @param rows - The design's row count.
 * @param cardHeight - The card's pixel height.
 * @returns The element's vertical rect.
 */
export function resolveVerticalElementRect(
  element: DesignElement,
  elements: DesignElement[],
  rows: number,
  cardHeight: number,
): ElementVerticalRect {
  // Classify row scaling against the element's vertical context
  const context = resolveVerticalContextElements(element, elements);
  const scaling = resolveScalingRows([element, ...context], rows);
  const occupied = resolveOccupiedRows([element, ...context], rows);
  const scalingCount = scaling.filter(Boolean).length;

  // Split the fixed rows into element rows and gap rows
  const elementRowCount = occupied.filter(
    (isOccupied, row) => isOccupied && !scaling[row],
  ).length;
  const gapCount = rows - scalingCount - elementRowCount;

  // Space left for scaling rows after fixed rows take theirs
  const scalingHeight = scalingCount
    ? Math.max(cardHeight - (elementRowCount + gapCount) * UnitPixelSize, 0) /
      scalingCount
    : 0;

  // Compress gap rows toward zero once the card is too short for
  // every fixed row.
  const gapHeight = gapCount
    ? Math.min(
        UnitPixelSize,
        Math.max(cardHeight - elementRowCount * UnitPixelSize, 0) / gapCount,
      )
    : UnitPixelSize;

  // Compress element rows only once the gaps are exhausted
  const elementRowHeight = elementRowCount
    ? Math.min(UnitPixelSize, cardHeight / elementRowCount)
    : UnitPixelSize;

  // Resolves a single row's height from its classification
  function resolveRowHeight(row: number): number {
    if (scaling[row]) {
      return scalingHeight;
    }

    return occupied[row] ? elementRowHeight : gapHeight;
  }

  // Sum row heights up to the element's top edge
  let top = 0;

  for (let row = 0; row < element.row; row += 1) {
    top += resolveRowHeight(row);
  }

  // Sum the heights of the element's own rows
  let height = 0;

  for (
    let row = element.row;
    row < Math.min(element.row + element.rowSpan, rows);
    row += 1
  ) {
    height += resolveRowHeight(row);
  }

  return { top, height };
}

import { UnitPixelSize } from '../../constants';
import { BlockElement } from '../../types';
import { resolveContextElements } from '../resolveContextElements';
import { resolveScalingColumns } from '../resolveScalingColumns';

export interface ElementRect {
  /**
   * Pixel offset of the element's left edge.
   */
  left: number;

  /**
   * Pixel width of the element.
   */
  width: number;
}

/**
 * Resolves an element's horizontal pixel rect at a given card width.
 * Column widths are classified against the element's own context:
 * scaling columns share the space left after fixed columns take one
 * unit width each.
 *
 * @param element - The element to resolve the rect for.
 * @param elements - The card's elements.
 * @param columns - The card's column count.
 * @param cardWidth - The card's pixel width.
 * @returns The element's horizontal rect.
 */
export function resolveElementRect(
  element: BlockElement,
  elements: BlockElement[],
  columns: number,
  cardWidth: number,
): ElementRect {
  // Classify column scaling against the element's context
  const context = resolveContextElements(element, elements);
  const scaling = resolveScalingColumns([element, ...context], columns);
  const scalingCount = scaling.filter(Boolean).length;
  const fixedCount = columns - scalingCount;

  // Space left for scaling columns after fixed columns take theirs
  const scalingWidth = scalingCount
    ? Math.max(cardWidth - fixedCount * UnitPixelSize, 0) / scalingCount
    : 0;

  // Sum column widths up to the element's left edge
  let left = 0;

  for (let column = 0; column < element.column; column += 1) {
    left += scaling[column] ? scalingWidth : UnitPixelSize;
  }

  // Sum the widths of the element's own columns
  let width = 0;

  for (
    let column = element.column;
    column < Math.min(element.column + element.columnSpan, columns);
    column += 1
  ) {
    width += scaling[column] ? scalingWidth : UnitPixelSize;
  }

  return { left, width };
}

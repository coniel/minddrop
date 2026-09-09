import { DesignElement } from '../../types';
import { resolveContextElements } from '../resolveContextElements';
import { resolveVerticalContextElements } from '../resolveVerticalContextElements';

export type ElementSide = 'left' | 'right' | 'top' | 'bottom';

/**
 * Checks whether an element has a neighbour on the given side, which
 * is what a pin to that side holds the element's distance from.
 * Without one, the pin holds it to the design's edge.
 *
 * @param element - The element to check.
 * @param elements - The design's elements.
 * @param side - The side to look for a neighbour on.
 * @returns Whether a neighbour sits on that side.
 */
export function hasNeighbourOnSide(
  element: DesignElement,
  elements: DesignElement[],
  side: ElementSide,
): boolean {
  // Stacked neighbours sit above and below
  if (side === 'top') {
    return resolveVerticalContextElements(element, elements).some(
      (other) => other.row + other.rowSpan <= element.row,
    );
  }

  if (side === 'bottom') {
    return resolveVerticalContextElements(element, elements).some(
      (other) => other.row >= element.row + element.rowSpan,
    );
  }

  // Side by side neighbours sit left and right
  if (side === 'left') {
    return resolveContextElements(element, elements).some(
      (other) => other.column + other.columnSpan <= element.column,
    );
  }

  return resolveContextElements(element, elements).some(
    (other) => other.column >= element.column + element.columnSpan,
  );
}

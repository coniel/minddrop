import { DesignElement } from '../../types';
import { columnsOverlap } from '../columnsOverlap';
import { rowsOverlap } from '../rowsOverlap';

/**
 * Resolves the elements an element negotiates row space with: its
 * stacked neighbours, sharing columns without overlapping rows.
 * Elements overlapping on both axes are layered and ignore each
 * other.
 *
 * @param element - The element to resolve the context for.
 * @param elements - The design's elements.
 * @returns The element's vertical context elements.
 */
export function resolveVerticalContextElements<TElement extends DesignElement>(
  element: TElement,
  elements: TElement[],
): TElement[] {
  return elements.filter(
    (other) =>
      other.id !== element.id &&
      columnsOverlap(element, other) &&
      !rowsOverlap(element, other),
  );
}

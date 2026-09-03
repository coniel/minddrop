import { BlockElement } from '../../types';
import { columnsOverlap } from '../columnsOverlap';
import { rowsOverlap } from '../rowsOverlap';

/**
 * Resolves the elements an element negotiates column space with: its
 * side-by-side neighbours, sharing rows without overlapping columns.
 * Elements overlapping on both axes are layered and ignore each other.
 *
 * @param element - The element to resolve the context for.
 * @param elements - The card's elements.
 * @returns The element's context elements.
 */
export function resolveContextElements<TElement extends BlockElement>(
  element: TElement,
  elements: TElement[],
): TElement[] {
  return elements.filter(
    (other) =>
      other.id !== element.id &&
      rowsOverlap(element, other) &&
      !columnsOverlap(element, other),
  );
}

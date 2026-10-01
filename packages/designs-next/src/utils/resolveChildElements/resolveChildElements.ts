import { DesignElement } from '../../types';

/**
 * Returns the elements held by the given parent, in array order.
 * Returns the design's own elements when no parent is given.
 *
 * @param elements - The design's elements.
 * @param parentId - The ID of the element holding them.
 * @returns The parent's child elements.
 */
export function resolveChildElements<TElement extends DesignElement>(
  elements: TElement[],
  parentId?: string,
): TElement[] {
  return elements.filter((element) => element.parent === parentId);
}

import { DesignElement } from '../../types';
import { resolveVerticalContextElements } from '../resolveVerticalContextElements';

/**
 * Checks whether vertically pinning an element has no visible
 * effect: a fluid-height element in its vertical context absorbs all
 * extra height, so pinning top, bottom or center behaves
 * identically. Applies to the element's current pin and to a
 * prospective one alike.
 *
 * @param element - The element to check.
 * @param elements - The design's elements.
 * @returns Whether the element's vertical pin choice is overridden.
 */
export function isElementVerticalPinOverridden(
  element: DesignElement,
  elements: DesignElement[],
): boolean {
  // Check the element's vertical context for a fluid-height neighbour
  return resolveVerticalContextElements(element, elements).some(
    (other) => (other.heightMode ?? 'fluid') === 'fluid',
  );
}

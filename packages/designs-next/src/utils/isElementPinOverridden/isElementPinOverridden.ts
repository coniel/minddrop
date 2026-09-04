import { DesignElement } from '../../types';
import { resolveContextElements } from '../resolveContextElements';

/**
 * Checks whether pinning an element has no visible effect: a fluid
 * element in its context absorbs all extra space, so pinning left,
 * right or center behaves identically. Applies to the element's
 * current pin and to a prospective one alike.
 *
 * @param element - The element to check.
 * @param elements - The design's elements.
 * @returns Whether the element's pin choice is overridden.
 */
export function isElementPinOverridden(
  element: DesignElement,
  elements: DesignElement[],
): boolean {
  // Check the element's context for a fluid neighbour
  return resolveContextElements(element, elements).some(
    (other) => other.widthMode === 'fluid',
  );
}

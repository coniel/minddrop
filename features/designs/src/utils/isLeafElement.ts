import { DesignElement, LeafDesignElement } from '@minddrop/designs';

/**
 * Checks if a design element is a leaf element (not a container or root).
 *
 * @param element - The design element to check.
 * @returns True if the element is a leaf element, false otherwise.
 */
export function isLeafElement(
  element: DesignElement,
): element is LeafDesignElement {
  return !('children' in element);
}

import { DesignElement, PropertyDesignElement } from '@minddrop/designs';

/**
 * Checks if a design element is a property based element.
 *
 * @param element - The design element to check.
 * @returns True if the element is a property element, false otherwise.
 */
export function isPropertyElement(
  element: DesignElement,
): element is PropertyDesignElement {
  return element.type.includes('property');
}

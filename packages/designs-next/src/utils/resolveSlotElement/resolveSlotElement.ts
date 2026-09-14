import { DesignElement } from '../../types';

/**
 * Returns the element filling a named slot of the given parent.
 *
 * @param elements - The design's elements.
 * @param parentId - The ID of the element holding the slot.
 * @param slot - The slot's name.
 * @returns The slot's element, or undefined when it is empty.
 */
export function resolveSlotElement(
  elements: DesignElement[],
  parentId: string,
  slot: string,
): DesignElement | undefined {
  return elements.find(
    (element) => element.parent === parentId && element.slot === slot,
  );
}

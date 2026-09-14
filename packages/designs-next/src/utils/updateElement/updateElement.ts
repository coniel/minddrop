import { DesignElement } from '../../types';

/**
 * Applies changes to the element with the given ID. Returns the
 * elements unchanged when the design has no such element.
 *
 * @param elements - The design's elements.
 * @param id - The ID of the element to update.
 * @param changes - The field values to merge into the element.
 * @returns The updated elements.
 */
export function updateElement(
  elements: DesignElement[],
  id: string,
  changes: Record<string, unknown>,
): DesignElement[] {
  return elements.map((element) =>
    element.id === id ? { ...element, ...changes } : element,
  );
}

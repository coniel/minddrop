import { DesignElement } from '../../types';

/**
 * Remaps a property's mapped elements to another property. Returns
 * the given elements when none maps the property.
 *
 * @param elements - The design's elements.
 * @param oldName - The property name the elements map to.
 * @param newName - The property name to map to instead.
 * @returns The elements with their property mappings remapped.
 */
export function remapElementProperties<TElement extends DesignElement>(
  elements: TElement[],
  oldName: string,
  newName: string,
): TElement[] {
  // Check if any element maps the property. If not, the elements are
  // returned unchanged.
  if (!elements.some((element) => element.property === oldName)) {
    return elements;
  }

  // Remap the elements mapping the property
  return elements.map((element) => {
    // Check if the element maps the property. If not, leave it as it is.
    if (element.property !== oldName) {
      return element;
    }

    // Remap the element to the new property
    return { ...element, property: newName };
  });
}

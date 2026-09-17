import { DesignElement } from '../../types';

/**
 * Clears a property's mapping from the elements mapping it. Returns
 * the given elements when none maps the property.
 *
 * @param elements - The design's elements.
 * @param name - The property name to unmap.
 * @returns The elements with their mappings to the property cleared.
 */
export function unmapElementProperties<TElement extends DesignElement>(
  elements: TElement[],
  name: string,
): TElement[] {
  // Check if any element maps the property. If not, the elements are
  // returned unchanged.
  if (!elements.some((element) => element.property === name)) {
    return elements;
  }

  // Unmap the elements mapping the property
  return elements.map((element) => {
    // Check if the element maps the property. If not, leave it as it is.
    if (element.property !== name) {
      return element;
    }

    // Copy the element
    const unmapped = { ...element };

    // Clear its property mapping
    delete unmapped.property;

    return unmapped;
  });
}

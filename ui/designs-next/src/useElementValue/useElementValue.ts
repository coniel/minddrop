import { DesignElement } from '@minddrop/designs-next';
import { Properties } from '@minddrop/properties';
import { useElementProperty } from '../useElementProperty';

/**
 * Returns the text of the property an element maps to. Returns
 * undefined when the element maps to no property, when the provided
 * properties do not include it, or when it has no value.
 *
 * @param element - The design element.
 * @returns The property's text, or undefined.
 */
export function useElementValue(element: DesignElement): string | undefined {
  // Read the property the element maps to
  const property = useElementProperty(element);

  // Check the element maps to a property which is still provided
  if (!property) {
    return undefined;
  }

  // Format the property's value as text
  return Properties.formatValue(property.value, property.schema) ?? undefined;
}

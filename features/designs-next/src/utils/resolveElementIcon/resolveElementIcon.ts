import { DesignElement } from '@minddrop/designs-next';
import { ElementProperty } from '@minddrop/ui-designs-next';

/**
 * Resolves the icon an element draws: the value of an icon
 * property, the schema's icon for a property of any other type,
 * falling back to the icon picked on the element.
 *
 * @param element - The element the icon is picked on.
 * @param property - The property the element maps to.
 * @returns The stringified icon, or undefined when there is none.
 */
export function resolveElementIcon(
  element: DesignElement,
  property: ElementProperty | undefined,
): string | undefined {
  // Return the picked icon for an element mapping to no property
  if (!property) {
    return element.content;
  }

  // Return an icon property's value
  if (property.schema.type === 'icon') {
    return typeof property.value === 'string'
      ? property.value
      : element.content;
  }

  // Return the property schema's icon
  return property.schema.icon ?? element.content;
}

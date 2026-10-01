import { PropertiesSchema, PropertyType } from '@minddrop/properties';
import { DesignElement } from '../../types';

/**
 * Returns whether any of the elements maps to a property of the
 * given type.
 *
 * @param elements - The design's elements.
 * @param properties - The schemas of the properties the elements map to.
 * @param type - The property type.
 * @returns Whether an element maps to a property of the type.
 */
export function hasMappedPropertyType(
  elements: DesignElement[],
  properties: PropertiesSchema,
  type: PropertyType,
): boolean {
  // Check if any element maps to a property of the type
  return elements.some((element) =>
    properties.some(
      (property) =>
        property.name === element.property && property.type === type,
    ),
  );
}

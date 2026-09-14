import { useContext } from 'react';
import { DesignElement } from '@minddrop/designs-next';
import { PropertySchema, PropertyValue } from '@minddrop/properties';
import { DesignPropertiesContext } from '../DesignPropertiesContext';

export interface ElementProperty {
  /**
   * The schema of the property the element maps to.
   */
  schema: PropertySchema;

  /**
   * The property's value, null when it has none.
   */
  value: PropertyValue;
}

/**
 * Returns the schema and value of the property an element maps to.
 * Returns undefined when the element maps to no property, or when
 * the provided properties do not include it.
 *
 * @param element - The design element.
 * @returns The mapped property, or undefined.
 */
export function useElementProperty(
  element: DesignElement,
): ElementProperty | undefined {
  // Read the provided property schemas and values
  const { properties, values } = useContext(DesignPropertiesContext);

  // Check the element maps to a property
  if (!element.property) {
    return undefined;
  }

  // Look up the schema of the mapped property
  const schema = properties.find(
    (property) => property.name === element.property,
  );

  // Check the mapped property is still provided
  if (!schema) {
    return undefined;
  }

  // Pair the schema with the property's value
  return { schema, value: values[element.property] ?? null };
}

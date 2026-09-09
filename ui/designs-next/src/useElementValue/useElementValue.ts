import { useContext } from 'react';
import { DesignElement } from '@minddrop/designs-next';
import { Properties } from '@minddrop/properties';
import { DesignPropertiesContext } from '../DesignPropertiesContext';

/**
 * Returns the text of the property an element maps to. Returns
 * undefined when the element maps to no property, when the provided
 * properties do not hold it, or when it has no value.
 *
 * @param element - The design element.
 * @returns The property's text, or undefined.
 */
export function useElementValue(element: DesignElement): string | undefined {
  const { properties, values } = useContext(DesignPropertiesContext);

  if (!element.property) {
    return undefined;
  }

  // Look up the schema of the mapped property, which its value is
  // read against.
  const schema = properties.find(
    (property) => property.name === element.property,
  );

  if (!schema) {
    return undefined;
  }

  // Format the property's value as text
  return Properties.formatValue(values[element.property], schema) ?? undefined;
}

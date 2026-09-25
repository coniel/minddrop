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

  /**
   * Updates the property's value. Absent when the render is read
   * only.
   */
  updateValue?: (value: PropertyValue) => void;

  /**
   * Validates a new value before it is committed. Returns a
   * translated error message when it is invalid. Absent when the
   * render validates nothing.
   */
  validateValue?: (value: PropertyValue) => string | undefined;
}

/**
 * Returns the schema and value of the property an element maps to,
 * and the callbacks updating it when the render provides them.
 * Returns undefined without an element, when it maps to no
 * property, or when the provided properties do not include it.
 *
 * @param element - The design element.
 * @returns The mapped property, or undefined.
 */
export function useElementProperty(
  element: DesignElement | undefined,
): ElementProperty | undefined {
  // Read the provided property schemas, values and callbacks
  const { properties, values, onValueChange, validateValue } = useContext(
    DesignPropertiesContext,
  );

  // Check the element maps to a property
  if (!element?.property) {
    return undefined;
  }

  // The mapped property's name
  const name = element.property;

  // Look up the schema of the mapped property
  const schema = properties.find((property) => property.name === name);

  // Check the mapped property is still provided
  if (!schema) {
    return undefined;
  }

  // Pair the schema with the property's value and the callbacks
  // bound to its name.
  return {
    schema,
    value: values[name] ?? null,
    updateValue: onValueChange && ((value) => onValueChange(name, value)),
    validateValue: validateValue && ((value) => validateValue(name, value)),
  };
}

import React from 'react';
import { DesignPropertyMap } from '@minddrop/databases';
import {
  PropertiesSchema,
  PropertyMap,
  PropertySchema,
  PropertyValue,
} from '@minddrop/properties';

interface DesignPropertiesProviderData {
  /**
   * The property schemas for the database.
   */
  properties: PropertiesSchema;

  /**
   * Property name → property value map.
   */
  propertyValues: PropertyMap;

  /**
   * Design element ID → property name map.
   */
  propertyMap: DesignPropertyMap;

  /**
   * Callback to update a property value.
   */
  onUpdatePropertyValue?: (name: string, value: PropertyValue) => void;
}

export interface DesignPropertiesProviderProps
  extends DesignPropertiesProviderData {
  children: React.ReactNode;
}

// Use nullable context so renderers work without a provider
// (e.g. in the design studio or property mapping preview)
const DesignPropertiesContext =
  React.createContext<DesignPropertiesProviderData | null>(null);

/**
 * Returns the design properties context data.
 * Returns null when no DesignPropertiesProvider is present.
 */
export const useDesignProperties = (): DesignPropertiesProviderData | null => {
  return React.useContext(DesignPropertiesContext);
};

export const DesignPropertiesProvider = ({
  properties,
  propertyValues,
  propertyMap,
  onUpdatePropertyValue,
  children,
}: DesignPropertiesProviderProps) => {
  return (
    <DesignPropertiesContext.Provider
      value={{ properties, propertyValues, propertyMap, onUpdatePropertyValue }}
    >
      {children}
    </DesignPropertiesContext.Provider>
  );
};

/**
 * Returns the property schema, value, and update function
 * for a given property name. Returns null if the property
 * is not found in the schema or no provider is present.
 */
export const useProperty = (
  name: string,
): {
  schema: PropertySchema;
  value?: PropertyValue;
  updateValue: (value: PropertyValue) => void;
} | null => {
  const context = useDesignProperties();

  if (!context) {
    return null;
  }

  const { onUpdatePropertyValue, propertyValues, properties } = context;

  const value = propertyValues[name];
  const schema = properties.find((property) => property.name === name);

  const updateValue = (newValue: PropertyValue) =>
    onUpdatePropertyValue?.(name, newValue);

  if (!schema) {
    return null;
  }

  return {
    schema,
    value,
    updateValue,
  };
};

/**
 * Returns the property schema, value, and update function
 * for the property mapped to a given design element.
 * Returns null if the element has no mapped property or
 * no provider is present.
 */
export const useElementProperty = (
  elementId: string,
): {
  schema: PropertySchema;
  value?: PropertyValue;
  updateValue: (value: PropertyValue) => void;
} | null => {
  const context = useDesignProperties();

  if (!context) {
    return null;
  }

  const { propertyMap, properties, propertyValues, onUpdatePropertyValue } =
    context;

  // Look up the property name mapped to this element
  const propertyName = propertyMap[elementId];

  if (!propertyName) {
    return null;
  }

  // Find the property schema
  const schema = properties.find((property) => property.name === propertyName);

  if (!schema) {
    return null;
  }

  // Get the property value
  const value = propertyValues[propertyName];

  // Create update callback
  const updateValue = (newValue: PropertyValue) =>
    onUpdatePropertyValue?.(propertyName, newValue);

  return {
    schema,
    value,
    updateValue,
  };
};

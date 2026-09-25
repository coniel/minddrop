import { createContext } from 'react';
import {
  PropertiesSchema,
  PropertyMap,
  PropertyValue,
} from '@minddrop/properties';

export interface DesignPropertiesContextValue {
  /**
   * The schemas of the properties the design's elements map to.
   */
  properties: PropertiesSchema;

  /**
   * The property values the design's elements render, keyed by
   * property name.
   */
  values: PropertyMap;

  /**
   * Called with a property's name and new value when an element
   * changes it. Absent when the render is read only.
   */
  onValueChange?: (name: string, value: PropertyValue) => void;

  /**
   * Validates a property's new value before an element commits it.
   * Returns a translated error message when it is invalid.
   */
  validateValue?: (name: string, value: PropertyValue) => string | undefined;
}

/**
 * The properties a design's elements render the values of. Empty
 * outside a provider.
 */
export const DesignPropertiesContext =
  createContext<DesignPropertiesContextValue>({
    properties: [],
    values: {},
  });

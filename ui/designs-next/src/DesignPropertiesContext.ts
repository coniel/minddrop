import { createContext } from 'react';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';

export interface DesignPropertiesContextValue {
  /**
   * The property schemas of the database owning the design.
   */
  properties: PropertiesSchema;

  /**
   * The property values the design's elements render, keyed by
   * property name.
   */
  values: PropertyMap;
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

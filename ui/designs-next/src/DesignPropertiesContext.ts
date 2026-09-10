import { createContext } from 'react';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';

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

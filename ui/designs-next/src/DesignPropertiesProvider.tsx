import { useMemo } from 'react';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { DesignPropertiesContext } from './DesignPropertiesContext';

export interface DesignPropertiesProviderProps {
  /**
   * The property schemas of the database owning the design.
   */
  properties?: PropertiesSchema;

  /**
   * The property values the design's elements render, keyed by
   * property name.
   */
  values?: PropertyMap;

  /**
   * The design render the properties apply to.
   */
  children: React.ReactNode;
}

/**
 * Provides the properties a design's elements render the values of.
 * Wrap a design render to fill its mapped elements with an entry's
 * values.
 */
export const DesignPropertiesProvider: React.FC<
  DesignPropertiesProviderProps
> = ({ properties, values, children }) => {
  const value = useMemo(
    () => ({ properties: properties ?? [], values: values ?? {} }),
    [properties, values],
  );

  return (
    <DesignPropertiesContext.Provider value={value}>
      {children}
    </DesignPropertiesContext.Provider>
  );
};

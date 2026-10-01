import { useMemo } from 'react';
import {
  DesignPropertiesContext,
  DesignPropertiesContextValue,
} from './DesignPropertiesContext';

export interface DesignPropertiesProviderProps
  extends Partial<DesignPropertiesContextValue> {
  /**
   * The design render the properties apply to.
   */
  children: React.ReactNode;
}

/**
 * Provides the properties a design's elements render the values of,
 * and the callbacks updating them.
 */
export const DesignPropertiesProvider: React.FC<
  DesignPropertiesProviderProps
> = ({
  properties,
  values,
  onValueChange,
  validateValue,
  hasMappedMarkdownEditor,
  children,
}) => {
  // Build the context value
  const value = useMemo(
    () => ({
      properties: properties ?? [],
      values: values ?? {},
      onValueChange,
      validateValue,
      hasMappedMarkdownEditor,
    }),
    [properties, values, onValueChange, validateValue, hasMappedMarkdownEditor],
  );

  return (
    <DesignPropertiesContext.Provider value={value}>
      {children}
    </DesignPropertiesContext.Provider>
  );
};

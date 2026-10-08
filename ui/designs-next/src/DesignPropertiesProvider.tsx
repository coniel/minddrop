import { useMemo, useRef } from 'react';
import {
  DesignPropertiesContext,
  DesignPropertiesContextValue,
} from './DesignPropertiesContext';

export interface DesignPropertiesProviderProps
  extends Partial<Omit<DesignPropertiesContextValue, 'claimEditorAutoFocus'>> {
  /**
   * Whether the first editor to mount takes the focus.
   */
  autoFocusEditor?: boolean;

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
  autoFocusEditor = false,
  children,
}) => {
  // Whether an editor has claimed the focus
  const claimedRef = useRef(false);

  // Build the context value
  const value = useMemo(
    () => ({
      properties: properties ?? [],
      values: values ?? {},
      onValueChange,
      validateValue,
      hasMappedMarkdownEditor,
      claimEditorAutoFocus: () => {
        // Reject the claim when the flag is unset or the focus is
        // already claimed.
        if (!autoFocusEditor || claimedRef.current) {
          return false;
        }

        // Record the claim
        claimedRef.current = true;

        return true;
      },
    }),
    [
      properties,
      values,
      onValueChange,
      validateValue,
      hasMappedMarkdownEditor,
      autoFocusEditor,
    ],
  );

  return (
    <DesignPropertiesContext.Provider value={value}>
      {children}
    </DesignPropertiesContext.Provider>
  );
};

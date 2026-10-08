import { useContext, useState } from 'react';
import { DesignPropertiesContext } from '../DesignPropertiesContext';

/**
 * Returns whether the calling editor takes the focus. True for the
 * first editor to mount while the provider's `autoFocusEditor` is
 * set. Fixed on mount.
 *
 * @returns Whether the editor takes the focus.
 */
export function useEditorAutoFocus(): boolean {
  // Read the claim function from the context
  const { claimEditorAutoFocus } = useContext(DesignPropertiesContext);

  // Claim the focus once, on mount
  const [autoFocus] = useState(() => claimEditorAutoFocus?.() ?? false);

  return autoFocus;
}

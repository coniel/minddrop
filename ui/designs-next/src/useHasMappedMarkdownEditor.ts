import { useContext } from 'react';
import { DesignPropertiesContext } from './DesignPropertiesContext';

/**
 * Returns whether the rendered design has a markdown editor mapped to
 * a property, accepting changes.
 *
 * @returns Whether the design has a mapped markdown editor.
 */
export function useHasMappedMarkdownEditor(): boolean {
  return useContext(DesignPropertiesContext).hasMappedMarkdownEditor ?? false;
}

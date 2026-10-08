import { useContext } from 'react';
import { HoverMenuContext, HoverMenuContextValue } from './HoverMenuContext';

/**
 * Returns the hover menu the component is rendered within.
 *
 * @returns The hover menu context, or null outside of one.
 */
export function useHoverMenuContext(): HoverMenuContextValue | null {
  return useContext(HoverMenuContext);
}

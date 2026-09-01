import { useContext } from 'react';
import { MenuTargetContext, MenuTargetContextValue } from './MenuTargetContext';

/**
 * Returns the menu target the component is rendered within.
 *
 * @returns The menu target context, or null outside of one.
 */
export function useMenuTargetContext(): MenuTargetContextValue | null {
  return useContext(MenuTargetContext);
}

import { createContext, useContext } from 'react';

/**
 * Closes the popup the content is rendered in, for popup hosts
 * (menu and popover roots) to provide. Nested popups inherit their
 * root's closer, so an item in a submenu closes the root menu too.
 */
export const PopupCloseContext = createContext<VoidFunction | null>(null);

/**
 * Returns the function closing the surrounding popup, or null
 * outside a popup host.
 *
 * @returns The popup closer.
 */
export function usePopupClose(): VoidFunction | null {
  return useContext(PopupCloseContext);
}

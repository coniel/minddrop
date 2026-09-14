import { MutableRefObject, createContext, useContext } from 'react';

export interface DropdownSubmenuContextValue {
  /**
   * Opens or closes the submenu.
   */
  setOpen: (open: boolean) => void;

  /**
   * The ID the trigger item is registered with in a searchable
   * menu, which the submenu returns the highlight to when it
   * closes. Null in a menu without a search field.
   */
  triggerIdRef: MutableRefObject<string | null>;
}

export const DropdownSubmenuContext =
  createContext<DropdownSubmenuContextValue | null>(null);

/**
 * Returns the surrounding submenu, or null outside one.
 *
 * @returns The submenu context, or null.
 */
export function useDropdownSubmenu(): DropdownSubmenuContextValue | null {
  return useContext(DropdownSubmenuContext);
}

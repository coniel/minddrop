import { MutableRefObject } from 'react';
import { createContext } from '@minddrop/utils';
import { ActionMenuItemProps } from '../ActionMenuItem';
import { NavigableListItemProps } from '../hooks/useNavigableList';

/* --- MenuSearchContext ---
   Provides item registration and navigation for searchable menus.
   Items register their props on mount so the menu can filter them
   during search. Navigation props are provided so items can wire
   up highlighting and mouse interaction without Base UI. */

export interface MenuSearchRegistration {
  /**
   * Ref to the item's current props, always up to date.
   */
  propsRef: MutableRefObject<ActionMenuItemProps>;
}

export interface MenuSearchContextValue {
  /**
   * Register a menu item with the search context.
   */
  register: (id: string, registration: MenuSearchRegistration) => void;

  /**
   * Unregister a menu item by its ID.
   */
  unregister: (id: string) => void;

  /**
   * Returns navigable list props for the item with the given ID.
   * Returns null if the item is not in the current ordered list.
   */
  getItemNavProps: (id: string) => NavigableListItemProps | null;
}

const [useMenuSearchContext, MenuSearchContextProvider] =
  createContext<MenuSearchContextValue>();

export { useMenuSearchContext, MenuSearchContextProvider };

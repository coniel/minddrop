import { MutableRefObject, createContext, useContext } from 'react';
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

  /**
   * Called in place of selecting the item, for items which act on
   * the menu rather than closing it (a submenu trigger).
   */
  activate?: () => void;

  /**
   * Whether the search term is matched against the item.
   * @default true
   */
  searchable?: boolean;

  /**
   * The submenu the item belongs to, set by the scope it registers
   * from. Unset for the menu's own items.
   */
  scope?: string;
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

  /**
   * Registers an open submenu, whose items the menu navigates in
   * place of its own until the returned function unregisters it.
   * `close` closes that submenu, and `itemId` is the item it was
   * entered from, which the highlight returns to on closing.
   */
  registerScope: (
    scope: string,
    close: () => void,
    itemId: string | null,
  ) => () => void;
}

const MenuSearchContext = createContext<MenuSearchContextValue | null>(null);

export const MenuSearchContextProvider = MenuSearchContext.Provider;

/**
 * Returns the surrounding searchable menu's context.
 *
 * @returns The menu search context.
 * @throws Outside a searchable menu.
 */
export function useMenuSearchContext(): MenuSearchContextValue {
  const context = useContext(MenuSearchContext);

  if (!context) {
    throw new Error('useMenuSearchContext must be used within a menu');
  }

  return context;
}

/**
 * Returns the surrounding searchable menu's context, or null outside
 * one, for items which also render in menus without a search field.
 *
 * @returns The menu search context, or null.
 */
export function useOptionalMenuSearchContext(): MenuSearchContextValue | null {
  return useContext(MenuSearchContext);
}

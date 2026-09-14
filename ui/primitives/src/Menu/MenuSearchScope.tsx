import React, {
  FC,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import {
  MenuSearchContextProvider,
  MenuSearchContextValue,
  MenuSearchRegistration,
  useOptionalMenuSearchContext,
} from './MenuSearchContext';

export interface MenuSearchScopeProps {
  /**
   * Closes the submenu the scope belongs to.
   */
  close: () => void;

  /**
   * The ID of the item the submenu was entered from, which the menu
   * returns its highlight to when the submenu closes.
   */
  itemId?: string | null;

  /**
   * The submenu's items.
   */
  children?: React.ReactNode;
}

/**
 * Registers the items within it as an open submenu's own, which the
 * surrounding searchable menu navigates in place of its items while
 * the submenu is open. Renders its children unchanged outside a
 * searchable menu.
 */
export const MenuSearchScope: FC<MenuSearchScopeProps> = ({
  close,
  itemId,
  children,
}) => {
  const closeRef = useRef(close);
  const scope = useId();
  const menu = useOptionalMenuSearchContext();

  // Kept up to date so that the scope need not be registered anew
  // when the submenu re-renders.
  closeRef.current = close;

  const registerItem = menu?.register;
  const registerScope = menu?.registerScope;

  // Registration functions are stable, as items and scopes register
  // in effects which depend on them. Deriving them from the context
  // value, which the menu rebuilds on every render, would register
  // everything anew each time, which never settles.
  const register = useCallback(
    (id: string, registration: MenuSearchRegistration) =>
      registerItem?.(id, { ...registration, scope }),
    [registerItem, scope],
  );

  const scopedMenu = useMemo<MenuSearchContextValue | null>(
    () => menu && { ...menu, register },
    [menu, register],
  );

  useEffect(
    () => registerScope?.(scope, () => closeRef.current(), itemId ?? null),
    [registerScope, scope, itemId],
  );

  if (!scopedMenu) {
    return children;
  }

  return (
    <MenuSearchContextProvider value={scopedMenu}>
      {children}
    </MenuSearchContextProvider>
  );
};

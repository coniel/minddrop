import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

export interface MenuItemHoverContextValue {
  /**
   * Reports the pointer moving over one of the menu's items.
   */
  notify: () => void;

  /**
   * Registers a listener called on every item hover, returning the
   * function unregistering it.
   */
  subscribe: (listener: () => void) => () => void;
}

export const MenuItemHoverContext =
  createContext<MenuItemHoverContextValue | null>(null);

/**
 * Tracks the pointer moving over a menu's items, for the menu panel
 * to provide as the menu item hover context.
 *
 * @returns The menu item hover context value.
 */
export function useMenuItemHoverState(): MenuItemHoverContextValue {
  const listenersRef = useRef(new Set<() => void>());

  return useMemo(
    () => ({
      notify: () => {
        listenersRef.current.forEach((listener) => listener());
      },
      subscribe: (listener: () => void) => {
        listenersRef.current.add(listener);

        return () => {
          listenersRef.current.delete(listener);
        };
      },
    }),
    [],
  );
}

/**
 * Returns the callback reporting the pointer moving over the item to
 * the surrounding menu. No-op outside a menu.
 *
 * @returns The item hover callback.
 */
export function useNotifyMenuItemHover(): () => void {
  const notify = useContext(MenuItemHoverContext)?.notify;

  return useCallback(() => notify?.(), [notify]);
}

/**
 * Calls the listener whenever the pointer moves over an item of the
 * surrounding menu. No-op outside a menu.
 *
 * @param listener - Called on every item hover.
 */
export function useOnMenuItemHover(listener: () => void): void {
  const subscribe = useContext(MenuItemHoverContext)?.subscribe;
  const listenerRef = useRef(listener);

  // Kept up to date so that the subscription need not be renewed
  // when the listener changes.
  listenerRef.current = listener;

  useEffect(() => subscribe?.(() => listenerRef.current()), [subscribe]);
}

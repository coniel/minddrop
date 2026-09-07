import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

export interface MenuFocusContextValue {
  /**
   * Whether an item in the menu keeps the focus (e.g. a rename
   * field), so that the pointer moving over other items must not
   * take it.
   */
  keepsFocus: boolean;

  /**
   * Registers an item keeping the focus, returning the function
   * unregistering it.
   */
  register: () => () => void;
}

export const MenuFocusContext = createContext<MenuFocusContextValue | null>(
  null,
);

/**
 * Tracks the items keeping the focus within a menu, for the menu
 * root to provide as the menu focus context.
 *
 * @returns The menu focus context value.
 */
export function useMenuFocusState(): MenuFocusContextValue {
  const [keepers, setKeepers] = useState(0);

  const register = useCallback(() => {
    setKeepers((count) => count + 1);

    return () => setKeepers((count) => count - 1);
  }, []);

  return useMemo(
    () => ({ keepsFocus: keepers > 0, register }),
    [keepers, register],
  );
}

/**
 * Returns whether an item in the surrounding menu keeps the focus.
 * False outside a menu.
 *
 * @returns Whether the menu keeps its focus.
 */
export function useMenuKeepsFocus(): boolean {
  return useContext(MenuFocusContext)?.keepsFocus ?? false;
}

/**
 * Registers the calling item as keeping the focus within the
 * surrounding menu while it is mounted. No-op outside a menu.
 */
export function useKeepMenuFocus(): void {
  const register = useContext(MenuFocusContext)?.register;

  // Register before paint so that the menu adapts before the pointer
  // can reach an item.
  useLayoutEffect(() => register?.(), [register]);
}

import { createContext, useContext } from 'react';

const LayoutIdContext = createContext<string | null>(null);

/**
 * Provides the ID of the layout rendered by the surrounding
 * layout frame, scoping descendant element hooks to that
 * layout's elements.
 */
export const LayoutIdProvider = LayoutIdContext.Provider;

/**
 * Returns the ID of the layout containing the current element
 * tree, or null when used outside of a layout frame.
 */
export function useLayoutId(): string | null {
  return useContext(LayoutIdContext);
}

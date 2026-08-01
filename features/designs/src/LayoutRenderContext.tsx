import { createContext, useContext } from 'react';

const LayoutRenderContext = createContext<string | null>(null);

/**
 * Provides the context in which the surrounding layout is rendered
 * (e.g. `page`, `dialog`), scoping descendant runtime UI state such
 * as panel widths to that context.
 */
export const LayoutRenderContextProvider = LayoutRenderContext.Provider;

/**
 * Returns the context in which the current layout is rendered, or
 * null when rendered outside a known context.
 */
export function useLayoutRenderContext(): string | null {
  return useContext(LayoutRenderContext);
}

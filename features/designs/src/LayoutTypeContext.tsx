import { createContext, useContext } from 'react';
import { LayoutType } from '@minddrop/designs';

/**
 * The type of the layout the surrounding elements belong to, which
 * context-adapting role styles resolve against. Null outside of a
 * layout tree.
 */
const LayoutTypeContext = createContext<LayoutType | null>(null);

export const LayoutTypeProvider = LayoutTypeContext.Provider;

/**
 * Returns the type of the layout the surrounding elements belong
 * to, or null outside of a layout tree.
 */
export function useLayoutType(): LayoutType | null {
  return useContext(LayoutTypeContext);
}

import { createContext, useContext } from 'react';

/**
 * Whether the surrounding element renders inside a property chrome
 * wrapper, which takes over the element's margins.
 */
const PropertyChromeContext = createContext(false);

export const PropertyChromeProvider = PropertyChromeContext.Provider;

/**
 * Returns whether the surrounding element renders inside a
 * property chrome wrapper.
 */
export function useInsidePropertyChrome(): boolean {
  return useContext(PropertyChromeContext);
}

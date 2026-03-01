import { createContext, useContext, useMemo } from 'react';
import {
  DesignElement as DesignElementType,
  DesignElementType as ElementType,
} from '@minddrop/designs';

/**
 * A function that wraps a rendered design element with additional
 * behaviour (e.g. drop targets for property mapping).
 */
export type ElementWrapperFn = (
  element: DesignElementType,
  children: React.ReactNode,
) => React.ReactNode;

interface ElementWrapperConfig {
  /** The wrapper function to apply. */
  wrapper: ElementWrapperFn;

  /** Element types to exclude from wrapping. */
  excludeTypes: ElementType[];
}

const DesignElementWrapperContext = createContext<ElementWrapperConfig | null>(
  null,
);

export interface DesignElementWrapperProviderProps {
  /**
   * The wrapper function to apply to each design element.
   */
  wrapper: ElementWrapperFn;

  /**
   * Element types to exclude from wrapping.
   */
  excludeTypes?: ElementType[];

  children: React.ReactNode;
}

/**
 * Provides an element wrapper function to all descendant
 * design element renderers. When set, the DesignElement
 * dispatcher wraps each rendered element with this function,
 * except for types listed in `excludeTypes`.
 */
export const DesignElementWrapperProvider: React.FC<
  DesignElementWrapperProviderProps
> = ({ wrapper, excludeTypes = [], children }) => {
  // Memoize the config to avoid unnecessary re-renders
  const config = useMemo(
    () => ({ wrapper, excludeTypes }),
    [wrapper, excludeTypes],
  );

  return (
    <DesignElementWrapperContext.Provider value={config}>
      {children}
    </DesignElementWrapperContext.Provider>
  );
};

/**
 * Returns the current element wrapper config, or null if none is set.
 */
export function useDesignElementWrapper(): ElementWrapperConfig | null {
  return useContext(DesignElementWrapperContext);
}

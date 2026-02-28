import { createContext, useContext } from 'react';

export interface FlexDropContainerContextValue {
  /**
   * Expand the gap at the given index.
   * Called by child elements when they detect a before/after
   * drag position.
   */
  expandGap: (index: number) => void;

  /**
   * Collapse any currently expanded gap.
   * Called when dragging leaves an element.
   */
  collapseGap: () => void;
}

export const FlexDropContainerContext =
  createContext<FlexDropContainerContextValue | null>(null);

/**
 * Returns the FlexDropContainer context for communicating
 * gap expansion from child elements.
 */
export function useFlexDropContainer(): FlexDropContainerContextValue | null {
  return useContext(FlexDropContainerContext);
}

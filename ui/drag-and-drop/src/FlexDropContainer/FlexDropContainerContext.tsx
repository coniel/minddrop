import { createContext, useContext } from 'react';

export interface FlexDropContainerContextValue {
  /**
   * Activate the gap at the given index, showing its drop line.
   * Called by child elements when they detect a before/after
   * drag position.
   */
  activateGap: (index: number) => void;

  /**
   * Deactivate any currently active gap.
   * Called when dragging leaves an element.
   */
  deactivateGap: () => void;
}

export const FlexDropContainerContext =
  createContext<FlexDropContainerContextValue | null>(null);

/**
 * Returns the FlexDropContainer context for communicating
 * gap activation from child elements.
 */
export function useFlexDropContainer(): FlexDropContainerContextValue | null {
  return useContext(FlexDropContainerContext);
}

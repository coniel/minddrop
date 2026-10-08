import React from 'react';

export interface HoverMenuContextValue {
  /**
   * Locks the menu open until the pointer next enters it. A locked
   * menu closes on a press outside it or the escape key alone.
   */
  lock: () => void;
}

/**
 * The hover menu a component is rendered within. Null outside one.
 */
export const HoverMenuContext =
  React.createContext<HoverMenuContextValue | null>(null);

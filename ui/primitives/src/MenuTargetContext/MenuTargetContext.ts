import React from 'react';

export interface MenuTargetContextValue {
  /**
   * Takes a hold keeping the target's actions visible and the
   * target highlighted, returning a release function. It stays
   * held while any hold is active, so overlapping popups (a
   * dropdown handing over to a popover) read as one interaction.
   */
  holdActionsVisible: () => VoidFunction;
}

/**
 * The element a menu was opened from (a menu item, a group label),
 * which stays highlighted for as long as the menu, or a popover it
 * led to, is open.
 */
export const MenuTargetContext =
  React.createContext<MenuTargetContextValue | null>(null);

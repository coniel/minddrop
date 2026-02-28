import { Menu } from '@base-ui/react/menu';
import React from 'react';
import { DropdownMenuRoot, DropdownMenuRootProps } from '../DropdownMenu';
import { useMenuItemContext } from './MenuItem';

/**
 * DropdownMenu root for use inside a MenuItem. Keeps the parent
 * item's action buttons visible while the dropdown is open so
 * the menu doesn't lose its anchor point.
 */
export const MenuItemDropdownMenu: React.FC<DropdownMenuRootProps> = (
  props,
) => {
  const { setForceActionsVisible } = useMenuItemContext();

  function handleOpenChange(
    open: boolean,
    eventDetails: Menu.Root.ChangeEventDetails,
  ) {
    if (props.onOpenChange) {
      props.onOpenChange(open, eventDetails);
    }

    // Force the menu item actions to remain visible while the dropdown
    // is open so it doesn't lose its anchor point.
    if (open) {
      setForceActionsVisible(true);
    } else {
      // Wait for the menu to close before hiding actions to prevent
      // the menu from repositioning itself.
      setTimeout(() => setForceActionsVisible(false), 100);
    }
  }

  return <DropdownMenuRoot {...props} onOpenChange={handleOpenChange} />;
};

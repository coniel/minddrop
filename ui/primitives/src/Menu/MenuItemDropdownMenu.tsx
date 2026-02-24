import { MenuRoot } from '@base-ui/react/menu/root/MenuRoot';
import React from 'react';
import { DropdownMenu, DropdownMenuProps } from '../DropdownMenu';
import { useMenuItemContext } from './MenuItem';

export const MenuItemDropdownMenu: React.FC<DropdownMenuProps> = (props) => {
  const { setForceActionsVisible } = useMenuItemContext();

  function handleOpenChange(
    open: boolean,
    eventDetails: MenuRoot.ChangeEventDetails,
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

  return <DropdownMenu {...props} onOpenChange={handleOpenChange} />;
};

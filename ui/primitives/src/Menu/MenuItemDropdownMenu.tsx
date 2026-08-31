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
  const { holdActionsVisible } = useMenuItemContext();
  const releaseHoldRef = React.useRef<VoidFunction | null>(null);

  function handleOpenChange(
    open: boolean,
    eventDetails: Menu.Root.ChangeEventDetails,
  ) {
    if (props.onOpenChange) {
      props.onOpenChange(open, eventDetails);
    }

    // Hold the menu item actions visible while the dropdown is
    // open so it doesn't lose its anchor point
    if (open) {
      releaseHoldRef.current = holdActionsVisible();
    } else {
      releaseHoldRef.current?.();
      releaseHoldRef.current = null;
    }
  }

  return <DropdownMenuRoot {...props} onOpenChange={handleOpenChange} />;
};

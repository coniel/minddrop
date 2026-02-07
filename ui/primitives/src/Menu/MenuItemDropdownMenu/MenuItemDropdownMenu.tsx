import { MenuRoot } from '@base-ui-components/react/menu/root/MenuRoot';
import { DropdownMenu, DropdownMenuProps } from '../../DropdownMenu';
import { useMenuItemContext } from '../MenuItem';

export const MenuItemDropdownMenu: React.FC<DropdownMenuProps> = (props) => {
  const { setForceActionsVisible } = useMenuItemContext();

  function handleOpenChange(
    open: boolean,
    eventDetails: MenuRoot.ChangeEventDetails,
  ) {
    if (props.onOpenChange) {
      props.onOpenChange(open, eventDetails);
    }

    // Force the menu item actions to be remain visible when the dropdown menu
    // is open so the dropdown menu doesn't lose its anchor.
    if (open) {
      setForceActionsVisible(true);
    } else {
      // Wait for the menu to close before hiding the actions
      // to prevent menu from repositioning itself.
      setTimeout(() => setForceActionsVisible(false), 100);
    }
  }

  return <DropdownMenu {...props} onOpenChange={handleOpenChange} />;
};

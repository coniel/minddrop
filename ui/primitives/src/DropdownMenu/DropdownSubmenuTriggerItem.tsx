import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC } from 'react';
import { IconProp } from '../IconRenderer';
import { MenuItem } from '../Menu/MenuItem';

/* --- DropdownSubmenuTriggerItem ---
   The trigger item that opens a nested submenu. */

export interface DropdownSubmenuTriggerItemProps
  extends Omit<MenuPrimitive.SubmenuTrigger.Props, 'children' | 'label'> {
  label?: string;
  icon?: IconProp;
  disabled?: boolean;
}

export const DropdownSubmenuTriggerItem: FC<
  DropdownSubmenuTriggerItemProps
> = ({ label, icon, disabled, ...other }) => (
  <MenuPrimitive.SubmenuTrigger
    render={
      <MenuItem hasSubmenu label={label} icon={icon} disabled={disabled} />
    }
    disabled={disabled}
    {...other}
  />
);

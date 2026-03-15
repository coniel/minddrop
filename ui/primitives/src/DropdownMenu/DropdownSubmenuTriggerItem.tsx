import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC } from 'react';
import { IconProp } from '../IconRenderer';
import { MenuItem } from '../Menu/MenuItem';
import { TranslatableNode } from '../types';

/* --- DropdownSubmenuTriggerItem ---
   The trigger item that opens a nested submenu. */

export interface DropdownSubmenuTriggerItemProps
  extends Omit<MenuPrimitive.SubmenuTrigger.Props, 'children' | 'label'> {
  label?: TranslatableNode;
  icon?: IconProp;
  disabled?: boolean;
  trailingIcon?: React.ReactNode;
}

export const DropdownSubmenuTriggerItem: FC<
  DropdownSubmenuTriggerItemProps
> = ({ label, icon, disabled, trailingIcon, ...other }) => (
  <MenuPrimitive.SubmenuTrigger
    render={
      <MenuItem
        hasSubmenu
        label={label}
        icon={icon}
        disabled={disabled}
        trailingIcon={trailingIcon}
      />
    }
    disabled={disabled}
    {...other}
  />
);

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import React, { FC } from 'react';
import { IconProp } from '../IconRenderer';
import { MenuItem } from '../Menu/MenuItem';
import { TranslatableNode } from '../types';

/* --- ContextSubmenuTriggerItem ---
   The trigger item that opens a nested submenu. */

export interface ContextSubmenuTriggerItemProps
  extends Omit<
    ContextMenuPrimitive.SubmenuTrigger.Props,
    'children' | 'label'
  > {
  label?: TranslatableNode;
  icon?: IconProp;
  disabled?: boolean;
  trailingIcon?: React.ReactNode;
}

export const ContextSubmenuTriggerItem: FC<ContextSubmenuTriggerItemProps> = ({
  label,
  icon,
  disabled,
  trailingIcon,
  ...other
}) => (
  <ContextMenuPrimitive.SubmenuTrigger
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

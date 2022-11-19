import React, { FC } from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { MenuItem } from '../Menu';
import { MenuTriggerItemProps } from '../types';

export interface DropdownMenuTriggerItemProps
  extends Omit<DropdownMenuPrimitives.DropdownMenuTriggerItemProps, 'children'>,
    Omit<MenuTriggerItemProps, 'onSelect'> {}

export const DropdownMenuTriggerItem: FC<DropdownMenuTriggerItemProps> = ({
  label,
  icon,
  disabled,
  ...other
}) => (
  <DropdownMenuPrimitives.TriggerItem asChild disabled={disabled} {...other}>
    <MenuItem hasSubmenu label={label} icon={icon} disabled={disabled} />
  </DropdownMenuPrimitives.TriggerItem>
);

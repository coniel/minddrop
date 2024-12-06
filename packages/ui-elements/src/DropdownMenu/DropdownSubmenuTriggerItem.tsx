import { FC } from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { MenuItem } from '../Menu';
import { SubmenuTriggerItemProps } from '../types';

export interface DropdownSubmenuTriggerItemProps
  extends Omit<DropdownMenuPrimitives.DropdownMenuSubTriggerProps, 'children'>,
    Omit<SubmenuTriggerItemProps, 'onSelect'> {}

export const DropdownSubmenuTriggerItem: FC<
  DropdownSubmenuTriggerItemProps
> = ({ label, icon, disabled, ...other }) => (
  <DropdownMenuPrimitives.SubTrigger asChild disabled={disabled} {...other}>
    <MenuItem hasSubmenu label={label} icon={icon} disabled={disabled} />
  </DropdownMenuPrimitives.SubTrigger>
);

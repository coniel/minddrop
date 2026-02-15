import { Menu as DropdownMenuPrimitives } from '@base-ui/react/menu';
import { FC } from 'react';
import { MenuItem } from '../Menu';
import { SubmenuTriggerItemProps } from '../types';

export interface DropdownSubmenuTriggerItemProps
  extends Omit<
      DropdownMenuPrimitives.SubmenuTrigger.Props,
      'children' | 'label'
    >,
    Omit<SubmenuTriggerItemProps, 'onSelect'> {}

export const DropdownSubmenuTriggerItem: FC<
  DropdownSubmenuTriggerItemProps
> = ({ label, icon, disabled, ...other }) => (
  <DropdownMenuPrimitives.SubmenuTrigger {...other}>
    <MenuItem hasSubmenu label={label} icon={icon} disabled={disabled} />
  </DropdownMenuPrimitives.SubmenuTrigger>
);

import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import React, { FC } from 'react';
import { MenuLabel } from '../Menu';

export type DropdownMenuLabelProps =
  DropdownMenuPrimitives.DropdownMenuLabelProps;

export const DropdownMenuLabel: FC<DropdownMenuLabelProps> = ({
  children,
  ...other
}) => (
  <DropdownMenuPrimitives.Label asChild {...other}>
    <MenuLabel>{children}</MenuLabel>
  </DropdownMenuPrimitives.Label>
);

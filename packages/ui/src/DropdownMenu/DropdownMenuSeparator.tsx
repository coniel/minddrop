import React, { FC } from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { MenuSeparator } from '../Menu';

export type DropdownMenuSeparatorProps =
  DropdownMenuPrimitives.DropdownMenuSeparatorProps;

export const DropdownMenuSeparator: FC<DropdownMenuSeparatorProps> = ({
  children,
  ...other
}) => (
  <DropdownMenuPrimitives.Separator asChild {...other}>
    <MenuSeparator />
  </DropdownMenuPrimitives.Separator>
);

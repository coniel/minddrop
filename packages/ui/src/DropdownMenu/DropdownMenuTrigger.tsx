import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import React, { FC } from 'react';

export type DropdownMenuTriggerProps =
  DropdownMenuPrimitives.DropdownMenuTriggerProps;

export const DropdownMenuTrigger: FC<DropdownMenuTriggerProps> = ({
  children,
  ...other
}) => (
  <DropdownMenuPrimitives.Trigger asChild {...other}>
    {children}
  </DropdownMenuPrimitives.Trigger>
);

import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import React, { FC } from 'react';
import { MenuLabel } from '../Menu';

export type ContextMenuLabelProps = ContextMenuPrimitives.ContextMenuLabelProps;

export const ContextMenuLabel: FC<ContextMenuLabelProps> = ({
  children,
  ...other
}) => (
  <ContextMenuPrimitives.Label asChild {...other}>
    <MenuLabel>{children}</MenuLabel>
  </ContextMenuPrimitives.Label>
);

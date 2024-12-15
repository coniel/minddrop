import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import React, { FC } from 'react';
import { MenuSeparator } from '../Menu';

export type ContextMenuSeparatorProps =
  ContextMenuPrimitives.ContextMenuSeparatorProps;

export const ContextMenuSeparator: FC<ContextMenuSeparatorProps> = ({
  children,
  ...other
}) => (
  <ContextMenuPrimitives.Separator asChild {...other}>
    <MenuSeparator />
  </ContextMenuPrimitives.Separator>
);

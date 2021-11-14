import React, { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { MenuSeparator } from '../Menu';

export type ContextMenuSeparatorProps =
  ContextMenuPrimitives.ContextMenuSeparatorProps;

export const ContextMenuSeparator: FC<ContextMenuSeparatorProps> = ({
  children,
  ...other
}) => {
  return (
    <ContextMenuPrimitives.Separator asChild {...other}>
      <MenuSeparator />
    </ContextMenuPrimitives.Separator>
  );
};

import React, { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { MenuLabel } from '../Menu';

export type ContextMenuLabelProps = ContextMenuPrimitives.ContextMenuLabelProps;

export const ContextMenuLabel: FC<ContextMenuLabelProps> = ({
  children,
  ...other
}) => {
  return (
    <ContextMenuPrimitives.Label asChild {...other}>
      <MenuLabel>{children}</MenuLabel>
    </ContextMenuPrimitives.Label>
  );
};

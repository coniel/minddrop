import React, { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import {
  InteractiveMenuItem,
  InteractiveMenuItemProps,
} from '../InteractiveMenuItem';

export type ContextMenuItemProps = Omit<
  InteractiveMenuItemProps,
  'MenuItemComponent'
>;

export const ContextMenuItem: FC<ContextMenuItemProps> = (props) => (
  <InteractiveMenuItem
    MenuItemComponent={ContextMenuPrimitives.Item}
    {...props}
  />
);

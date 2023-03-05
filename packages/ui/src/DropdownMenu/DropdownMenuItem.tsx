import { FC } from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import {
  InteractiveMenuItem,
  InteractiveMenuItemProps,
} from '../InteractiveMenuItem';

export type DropdownMenuItemProps = Omit<
  InteractiveMenuItemProps,
  'MenuItemComponent'
>;

export const DropdownMenuItem: FC<DropdownMenuItemProps> = (props) => (
  <InteractiveMenuItem
    MenuItemComponent={DropdownMenuPrimitives.Item}
    {...props}
  />
);

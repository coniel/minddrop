import { Menu as DropdownMenuPrimitives } from '@base-ui/react/menu';
import { FC } from 'react';
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

import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC } from 'react';
import { MenuSeparator } from '../Menu/MenuSeparator';

/* --- DropdownMenuSeparator ---
   Renders a visual divider between menu items. */

export type DropdownMenuSeparatorProps = MenuPrimitive.Separator.Props;

export const DropdownMenuSeparator: FC<DropdownMenuSeparatorProps> = (
  props,
) => <MenuPrimitive.Separator render={<MenuSeparator />} {...props} />;

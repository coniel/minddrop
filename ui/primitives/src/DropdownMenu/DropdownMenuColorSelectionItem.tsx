import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC } from 'react';
import {
  ColorSelectionMenuItem,
  ColorSelectionMenuItemProps,
} from '../Menu/ColorSelectionMenuItem';

/* --- DropdownMenuColorSelectionItem ---
   Color swatch item for dropdown menus.
   Wraps ColorSelectionMenuItem with Base UI's Menu.Item. */

export interface DropdownMenuColorSelectionItemProps
  extends Omit<ColorSelectionMenuItemProps, 'onSelect'> {
  onClick?: MenuPrimitive.Item.Props['onClick'];
  disabled?: boolean;
}

export const DropdownMenuColorSelectionItem: FC<
  DropdownMenuColorSelectionItemProps
> = ({ disabled, color, onClick, ...other }) => (
  <MenuPrimitive.Item
    disabled={disabled}
    onClick={onClick}
    render={<ColorSelectionMenuItem disabled={disabled} color={color} />}
    {...other}
  />
);

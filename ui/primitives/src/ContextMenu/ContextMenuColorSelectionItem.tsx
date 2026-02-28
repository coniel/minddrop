import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { FC } from 'react';
import {
  ColorSelectionMenuItem,
  ColorSelectionMenuItemProps,
} from '../Menu/ColorSelectionMenuItem';

/* --- ContextMenuColorSelectionItem ---
   Color swatch item for context menus.
   Wraps ColorSelectionMenuItem with Base UI's ContextMenu.Item. */

export interface ContextMenuColorSelectionItemProps
  extends Omit<ColorSelectionMenuItemProps, 'onSelect'> {
  onClick?: ContextMenuPrimitive.Item.Props['onClick'];
  disabled?: boolean;
}

export const ContextMenuColorSelectionItem: FC<
  ContextMenuColorSelectionItemProps
> = ({ disabled, color, onClick, ...other }) => (
  <ContextMenuPrimitive.Item
    disabled={disabled}
    onClick={onClick}
    render={<ColorSelectionMenuItem disabled={disabled} color={color} />}
    {...other}
  />
);

import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC } from 'react';
import { useMenuKeepsFocus } from '../Menu/MenuFocusContext';

/* --- DropdownSubmenu ---
   Base UI's Menu.SubmenuRoot for nesting menus. Follows the parent
   menu's focus context: while an item of the parent keeps the
   focus, hovering the submenu's items does not highlight them.
   Setting `highlightItemOnHover` overrides this. */

export type DropdownSubmenuProps = MenuPrimitive.SubmenuRoot.Props;

export const DropdownSubmenu: FC<DropdownSubmenuProps> = ({
  highlightItemOnHover,
  ...other
}) => {
  const keepsFocus = useMenuKeepsFocus();

  return (
    <MenuPrimitive.SubmenuRoot
      highlightItemOnHover={highlightItemOnHover ?? !keepsFocus}
      {...other}
    />
  );
};

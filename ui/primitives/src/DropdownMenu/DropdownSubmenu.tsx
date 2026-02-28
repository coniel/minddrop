import { Menu as MenuPrimitive } from '@base-ui/react/menu';

/* --- DropdownSubmenu ---
   Re-export of Base UI's Menu.SubmenuRoot for nesting menus. */

export type DropdownSubmenuProps = MenuPrimitive.SubmenuRoot.Props;

export const DropdownSubmenu = MenuPrimitive.SubmenuRoot;

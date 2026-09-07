import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { FC } from 'react';
import { useMenuKeepsFocus } from '../Menu/MenuFocusContext';

/* --- ContextSubmenu ---
   Base UI's ContextMenu.SubmenuRoot for nesting menus. Follows the
   parent menu's focus context: while an item of the parent keeps
   the focus, hovering the submenu's items does not highlight them.
   Setting `highlightItemOnHover` overrides this. */

export type ContextSubmenuProps = ContextMenuPrimitive.SubmenuRoot.Props;

export const ContextSubmenu: FC<ContextSubmenuProps> = ({
  highlightItemOnHover,
  ...other
}) => {
  const keepsFocus = useMenuKeepsFocus();

  return (
    <ContextMenuPrimitive.SubmenuRoot
      highlightItemOnHover={highlightItemOnHover ?? !keepsFocus}
      {...other}
    />
  );
};

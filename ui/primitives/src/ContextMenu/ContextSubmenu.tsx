import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';

/* --- ContextSubmenu ---
   Re-export of Base UI's ContextMenu.SubmenuRoot for nesting menus. */

export type ContextSubmenuProps = ContextMenuPrimitive.SubmenuRoot.Props;

export const ContextSubmenu = ContextMenuPrimitive.SubmenuRoot;

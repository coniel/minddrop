import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { FC } from 'react';
import { MenuSeparator } from '../Menu/MenuSeparator';

/* --- ContextMenuSeparator ---
   Renders a visual divider between menu items. */

export type ContextMenuSeparatorProps = ContextMenuPrimitive.Separator.Props;

export const ContextMenuSeparator: FC<ContextMenuSeparatorProps> = (props) => (
  <ContextMenuPrimitive.Separator render={<MenuSeparator />} {...props} />
);

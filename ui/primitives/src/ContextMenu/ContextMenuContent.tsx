import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import React, { useMemo } from 'react';
import { Menu } from '../Menu';
import { MenuItemRenderer } from '../MenuItemRenderer';
import { MenuContents } from '../types';
import { generateMenu } from '../utils';
import { ContextMenuColorSelectionItem } from './ContextMenuColorSelectionItem';
import { ContextMenuLabel } from './ContextMenuLabel';
import { ContextMenuSeparator } from './ContextMenuSeparator';
import { ContextSubmenu } from './ContextSubmenu';
import { ContextSubmenuContent } from './ContextSubmenuContent';
import { ContextSubmenuTriggerItem } from './ContextSubmenuTriggerItem';

/* --- ContextMenuContent ---
   Renders the styled Menu panel inside ContextMenu.Popup.
   Optionally generates items from a declarative content array. */

export interface ContextMenuContentProps
  extends Omit<ContextMenuPrimitive.Popup.Props, 'content'> {
  /*
   * Declarative item descriptors. When provided, menu items
   * are generated automatically alongside any JSX children.
   */
  content?: MenuContents;

  /*
   * Minimum width of the menu panel in pixels.
   */
  minWidth?: number;

  /*
   * Class name applied to the Menu panel.
   */
  className?: string;
}

export const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(({ children, content = [], minWidth, className, ...other }, ref) => {
  // Generate menu items from the declarative content array
  const generatedItems = useMemo(
    () =>
      generateMenu(
        {
          Item: MenuItemRenderer,
          Label: ContextMenuLabel,
          Separator: ContextMenuSeparator,
          Submenu: ContextSubmenu,
          SubmenuTriggerItem: ContextSubmenuTriggerItem,
          SubmenuContent: ContextSubmenuContent,
          ColorSelectionItem: ContextMenuColorSelectionItem,
        },
        content,
      ),
    [content],
  );

  return (
    <ContextMenuPrimitive.Popup
      ref={ref}
      render={
        <Menu style={{ minWidth }} className={className}>
          {generatedItems}
          {children}
        </Menu>
      }
      {...other}
    />
  );
});

ContextMenuContent.displayName = 'ContextMenuContent';

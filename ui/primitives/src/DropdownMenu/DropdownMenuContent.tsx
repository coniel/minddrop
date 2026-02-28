import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { useMemo } from 'react';
import { Menu } from '../Menu';
import { MenuItemRenderer } from '../MenuItemRenderer';
import { MenuContents } from '../types';
import { generateMenu } from '../utils';
import { DropdownMenuColorSelectionItem } from './DropdownMenuColorSelectionItem';
import { DropdownMenuLabel } from './DropdownMenuLabel';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';
import { DropdownSubmenu } from './DropdownSubmenu';
import { DropdownSubmenuContent } from './DropdownSubmenuContent';
import { DropdownSubmenuTriggerItem } from './DropdownSubmenuTriggerItem';

/* --- DropdownMenuContent ---
   Renders the styled Menu panel inside Menu.Popup.
   Optionally generates items from a declarative content array. */

export interface DropdownMenuContentProps
  extends Omit<MenuPrimitive.Popup.Props, 'content'> {
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

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ children, content = [], minWidth, className, ...other }, ref) => {
  // Generate menu items from the declarative content array
  const generatedItems = useMemo(
    () =>
      generateMenu(
        {
          Item: MenuItemRenderer,
          Label: DropdownMenuLabel,
          Separator: DropdownMenuSeparator,
          Submenu: DropdownSubmenu,
          SubmenuTriggerItem: DropdownSubmenuTriggerItem,
          SubmenuContent: DropdownSubmenuContent,
          ColorSelectionItem: DropdownMenuColorSelectionItem,
        },
        content,
      ),
    [content],
  );

  return (
    <MenuPrimitive.Popup
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

DropdownMenuContent.displayName = 'DropdownMenuContent';

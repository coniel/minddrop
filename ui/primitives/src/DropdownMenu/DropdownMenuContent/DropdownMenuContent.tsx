import { Menu as DropdownMenuPrimitives } from '@base-ui-components/react/menu';
import React, { useMemo } from 'react';
import { Menu } from '../../Menu';
import { MenuContents } from '../../types';
import { generateMenu } from '../../utils';
import { DropdownMenuColorSelectionItem } from '../DropdownMenuColorSelectionItem';
import { DropdownMenuItem } from '../DropdownMenuItem';
import { DropdownMenuLabel } from '../DropdownMenuLabel';
import { DropdownMenuSeparator } from '../DropdownMenuSeparator';
import { DropdownSubmenu } from '../DropdownSubmenu';
import { DropdownSubmenuContent } from '../DropdownSubmenuContent';
import { DropdownSubmenuTriggerItem } from '../DropdownSubmenuTriggerItem';

export interface DropdownMenuContentProps
  extends Omit<DropdownMenuPrimitives.Popup.Props, 'content'> {
  /**
   * Used to automatically generate a context menu based on the provided
   * item descriptors.
   */
  content?: MenuContents;

  /**
   * The minimum width (in pixels) of the menu content.
   */
  minWidth?: number;
}

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ children, content = [], minWidth, ...other }, ref) => {
  const items = useMemo(
    () =>
      generateMenu(
        {
          Item: DropdownMenuItem,
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
    <DropdownMenuPrimitives.Popup ref={ref} {...other}>
      <Menu style={{ minWidth }}>
        {items}
        {children}
      </Menu>
    </DropdownMenuPrimitives.Popup>
  );
});

DropdownMenuContent.displayName = 'DropdownMenuContent';

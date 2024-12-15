import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import React, { useMemo } from 'react';
import { Menu } from '../../Menu';
import { MenuContents } from '../../types';
import { generateMenu } from '../../utils';
import { ContextMenuColorSelectionItem } from '../ContextMenuColorSelectionItem';
import { ContextMenuItem } from '../ContextMenuItem';
import { ContextMenuLabel } from '../ContextMenuLabel';
import { ContextMenuSeparator } from '../ContextMenuSeparator';
import { ContextMenuTopicSelectionItem } from '../ContextMenuTopicSelectionItem';
import { ContextSubmenu } from '../ContextSubmenu';
import { ContextSubmenuContent } from '../ContextSubmenuContent';
import { ContextSubmenuTriggerItem } from '../ContextSubmenuTriggerItem';

export interface ContextMenuContentProps
  extends Omit<ContextMenuPrimitives.ContextMenuContentProps, 'content'> {
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

export const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(({ children, content = [], minWidth, ...other }, ref) => {
  const items = useMemo(
    () =>
      generateMenu(
        {
          Item: ContextMenuItem,
          Label: ContextMenuLabel,
          Separator: ContextMenuSeparator,
          Submenu: ContextSubmenu,
          SubmenuTriggerItem: ContextSubmenuTriggerItem,
          SubmenuContent: ContextSubmenuContent,
          TopicSelectionItem: ContextMenuTopicSelectionItem,
          ColorSelectionItem: ContextMenuColorSelectionItem,
        },
        content,
      ),
    [content],
  );

  return (
    <ContextMenuPrimitives.Content asChild ref={ref} {...other}>
      <Menu style={{ minWidth }}>
        {items}
        {children}
      </Menu>
    </ContextMenuPrimitives.Content>
  );
});

ContextMenuContent.displayName = 'ContextMenuItem';

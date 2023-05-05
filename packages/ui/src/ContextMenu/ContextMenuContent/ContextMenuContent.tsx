import { FC, useMemo } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { Menu } from '../../Menu';
import { MenuContents } from '../../types';
import { generateMenu } from '../../utils';
import { ContextMenuItem } from '../ContextMenuItem';
import { ContextMenuLabel } from '../ContextMenuLabel';
import { ContextMenuSeparator } from '../ContextMenuSeparator';
import { ContextMenuTopicSelectionItem } from '../ContextMenuTopicSelectionItem';
import { ContextMenuColorSelectionItem } from '../ContextMenuColorSelectionItem';
import { ContextSubmenu } from '../ContextSubmenu';
import { ContextSubmenuTriggerItem } from '../ContextSubmenuTriggerItem';
import { ContextSubmenuContent } from '../ContextSubmenuContent';

export interface ContextMenuContentProps
  extends Omit<ContextMenuPrimitives.ContextMenuContentProps, 'content'> {
  /**
   * Used to automatically generate a context menu based on the provided
   * item descriptors.
   */
  content?: MenuContents;
}

export const ContextMenuContent: FC<ContextMenuContentProps> = ({
  children,
  content = [],
  ...other
}) => {
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
    <ContextMenuPrimitives.Content asChild {...other}>
      <Menu>
        {items}
        {children}
      </Menu>
    </ContextMenuPrimitives.Content>
  );
};

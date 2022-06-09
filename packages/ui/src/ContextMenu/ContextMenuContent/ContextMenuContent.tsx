import React, { FC, useMemo } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { Menu } from '../../Menu';
import { MenuContents } from '../../types';
import { generateMenu } from '../../utils';
import { ContextMenuItem } from '../ContextMenuItem';
import { ContextMenuTriggerItem } from '../ContextMenuTriggerItem';
import { ContextMenuLabel } from '../ContextMenuLabel';
import { ContextMenuSeparator } from '../ContextMenuSeparator';
import { ContextMenu } from '../ContextMenu';
import { ContextMenuTopicSelectionItem } from '../ContextMenuTopicSelectionItem';
import { ContextMenuColorSelectionItem } from '../ContextMenuColorSelectionItem';

export interface ContextMenuContentProps
  extends ContextMenuPrimitives.ContextMenuContentProps {
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
          TriggerItem: ContextMenuTriggerItem,
          Label: ContextMenuLabel,
          Separator: ContextMenuSeparator,
          Menu: ContextMenu,
          MenuContent: ContextMenuContent,
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

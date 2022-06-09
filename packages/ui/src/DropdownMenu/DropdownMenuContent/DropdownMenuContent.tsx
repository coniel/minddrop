import React, { FC, useMemo } from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { Menu } from '../../Menu';
import { MenuContents } from '../../types';
import { generateMenu } from '../../utils';
import { DropdownMenuItem } from '../DropdownMenuItem';
import { DropdownMenuTriggerItem } from '../DropdownMenuTriggerItem';
import { DropdownMenuLabel } from '../DropdownMenuLabel';
import { DropdownMenuSeparator } from '../DropdownMenuSeparator';
import { DropdownMenu } from '../DropdownMenu';
import { DropdownMenuTopicSelectionItem } from '../DropdownMenuTopicSelectionItem';
import { DropdownMenuColorSelectionItem } from '../DropdownMenuColorSelectionItem';

export interface DropdownMenuContentProps
  extends DropdownMenuPrimitives.DropdownMenuContentProps {
  /**
   * Used to automatically generate a context menu based on the provided
   * item descriptors.
   */
  content?: MenuContents;
}

export const DropdownMenuContent: FC<DropdownMenuContentProps> = ({
  children,
  content = [],
  ...other
}) => {
  const items = useMemo(
    () =>
      generateMenu(
        {
          Item: DropdownMenuItem,
          TriggerItem: DropdownMenuTriggerItem,
          Label: DropdownMenuLabel,
          Separator: DropdownMenuSeparator,
          Menu: DropdownMenu,
          MenuContent: DropdownMenuContent,
          TopicSelectionItem: DropdownMenuTopicSelectionItem,
          ColorSelectionItem: DropdownMenuColorSelectionItem,
        },
        content,
      ),
    [content],
  );

  return (
    <DropdownMenuPrimitives.Content asChild {...other}>
      <Menu>
        {items}
        {children}
      </Menu>
    </DropdownMenuPrimitives.Content>
  );
};

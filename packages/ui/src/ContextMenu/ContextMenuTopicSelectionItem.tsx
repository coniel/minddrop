import { ContextMenuItem } from '@radix-ui/react-context-menu';
import React from 'react';
import {
  TopicSelectionMenuItem,
  TopicSelectionMenuItemProps,
} from '../TopicSelectionMenuItem';

export type ContextMenuTopicSelectionItemProps = Omit<
  TopicSelectionMenuItemProps,
  'MenuItemComponent'
>;

export const ContextMenuTopicSelectionItem: React.FC<ContextMenuTopicSelectionItemProps> =
  (props) => (
    <TopicSelectionMenuItem {...props} MenuItemComponent={ContextMenuItem} />
  );

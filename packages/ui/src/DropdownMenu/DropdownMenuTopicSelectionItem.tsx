import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import React from 'react';
import {
  TopicSelectionMenuItem,
  TopicSelectionMenuItemProps,
} from '../Menu/TopicSelectionMenuItem';

export type DropdownMenuTopicSelectionItemProps = Omit<
  TopicSelectionMenuItemProps,
  'MenuItemComponent'
>;

export const DropdownMenuTopicSelectionItem: React.FC<DropdownMenuTopicSelectionItemProps> =
  (props) => (
    <TopicSelectionMenuItem {...props} MenuItemComponent={DropdownMenuItem} />
  );

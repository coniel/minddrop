import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuTopicSelectionItem,
} from '@minddrop/ui';
import { TopicSelectionMenu } from './TopicSelectionMenu';

export default {
  title: 'app-ui/TopicSelectionMenu',
  component: TopicSelectionMenu,
};

export const Default: React.FC = () => (
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button type="button">trigger</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <TopicSelectionMenu
          MenuItemComponent={DropdownMenuTopicSelectionItem}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

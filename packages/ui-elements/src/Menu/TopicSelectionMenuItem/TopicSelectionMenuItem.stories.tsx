import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import React from 'react';
import { Button } from '../../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../DropdownMenu';
import {
  TopicSelectionMenuItem as TopicSelectionMenuItemPrimitive,
  TopicSelectionMenuItemProps,
} from './TopicSelectionMenuItem';

const TopicSelectionMenuItem: React.FC<
  Omit<TopicSelectionMenuItemProps, 'MenuItemComponent'>
> = (props) => (
  <TopicSelectionMenuItemPrimitive
    {...props}
    MenuItemComponent={DropdownMenuItem}
  />
);

export default {
  title: 'ui/TopicSelectionMenuItem',
  component: TopicSelectionMenuItemPrimitive,
};

export const Default: React.FC = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button>Select topic</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent style={{ width: 240 }}>
      <TopicSelectionMenuItem label="Sailing">
        <TopicSelectionMenuItem label="Navigation">
          <TopicSelectionMenuItem label="Coastal navigation" />
          <TopicSelectionMenuItem label="Offshore navigation" />
        </TopicSelectionMenuItem>
        <TopicSelectionMenuItem label="Anchoring" />
        <TopicSelectionMenuItem label="Sailboats" />
      </TopicSelectionMenuItem>
      <TopicSelectionMenuItem label="Home" />
      <TopicSelectionMenuItem label="Tea" />
      <TopicSelectionMenuItem label="Work" />
      <TopicSelectionMenuItem label="Japanese" />
    </DropdownMenuContent>
  </DropdownMenu>
);

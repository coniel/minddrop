import React, { FC, ComponentType } from 'react';
import {
  DropdownMenuTopicSelectionItemProps,
  ContextMenuTopicSelectionItemProps,
  MenuTopicSelectionItemConfig,
} from '@minddrop/ui';
import { useRootTopics } from '@minddrop/app';
import { generateTopicSelectionMenu } from '../utils';
import './TopicSelectionMenu.css';

export interface TopicSelectionMenuProps {
  /**
   * The component to use as the topic selection menu item.
   * Either a `DropdownMenuTopicSelectionItem` or a
   * `ContextMenuTopicSelectionItem`.
   */
  MenuItemComponent: ComponentType<
    DropdownMenuTopicSelectionItemProps | ContextMenuTopicSelectionItemProps
  >;

  /**
   * Callback fired when a topic is selected.
   */
  onSelect?(event: Event, topicId: string): void;

  /**
   * The  IDs of the topics to use as the root level topics.
   * Defaultsto app root level topics.
   */
  rootTopicIds?: string[];

  /**
   * The IDs of topics to exclude from all levels of the menu.
   */
  excludeTopicIds?: string[];
}

interface TopicSelectionMenuItemProps
  extends Pick<TopicSelectionMenuProps, 'MenuItemComponent'> {
  item: MenuTopicSelectionItemConfig;
  level?: number;
}

const TopicSelectionMenuItem: React.FC<TopicSelectionMenuItemProps> = ({
  MenuItemComponent,
  item,
  level = 0,
}) => (
  <MenuItemComponent label={item.label} onSelect={item.onSelect} level={level}>
    {item.subtopics.map((subtopicItem) => (
      <TopicSelectionMenuItem
        key={subtopicItem.id}
        MenuItemComponent={MenuItemComponent}
        item={subtopicItem}
        level={level + 1}
      />
    ))}
  </MenuItemComponent>
);

export const TopicSelectionMenu: FC<TopicSelectionMenuProps> = ({
  MenuItemComponent,
  rootTopicIds,
  excludeTopicIds = [],
  onSelect,
}) => {
  const rootTopics = useRootTopics();

  const topicIds = rootTopicIds || rootTopics.map((topic) => topic.id);

  return (
    <div className="topic-selection-menu">
      {generateTopicSelectionMenu(topicIds, onSelect, excludeTopicIds).map(
        (topicItem) => (
          <TopicSelectionMenuItem
            key={topicItem.id}
            MenuItemComponent={MenuItemComponent}
            item={topicItem}
          />
        ),
      )}
    </div>
  );
};

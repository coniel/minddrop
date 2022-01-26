import React, { FC } from 'react';
import {
  TopicNavItem as TopicNavItemPrimitive,
  TopicNavItemProps as TopicNavItemPrimitiveProps,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
} from '@minddrop/ui';
import { useTopic } from '@minddrop/topics';
import { generateTopicMenu } from '../../menus';
import { useAppCore } from '../../utils';

export interface TopicNavItemProps
  extends Omit<TopicNavItemPrimitiveProps, 'label'> {
  /**
   * The ID of the topic.
   */
  id: string;
}

export const TopicNavItem: FC<TopicNavItemProps> = ({ id, ...other }) => {
  const core = useAppCore();
  const topic = useTopic(id);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TopicNavItemPrimitive label={topic.title} {...other}>
          {topic.subtopics.map((subtopicId) => (
            <TopicNavItem key={subtopicId} id={subtopicId} />
          ))}
        </TopicNavItemPrimitive>
      </ContextMenuTrigger>
      <ContextMenuContent
        className="topic-menu-content"
        content={generateTopicMenu(core, topic)}
      />
    </ContextMenu>
  );
};

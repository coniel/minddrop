import React, { FC } from 'react';
import {
  TopicNavItem as TopicNavItemPrimitive,
  TopicNavItemProps as TopicNavItemPrimitiveProps,
} from '@minddrop/ui';
import { useTopic } from '@minddrop/topics';

export interface TopicNavItemProps
  extends Omit<TopicNavItemPrimitiveProps, 'label'> {
  /**
   * The ID of the topic.
   */
  id: string;
}

export const TopicNavItem: FC<TopicNavItemProps> = ({ id, ...other }) => {
  const topic = useTopic(id);

  return (
    <TopicNavItemPrimitive label={topic.title} {...other}>
      {topic.subtopics.map((subtopicId) => (
        <TopicNavItem key={subtopicId} id={subtopicId} />
      ))}
    </TopicNavItemPrimitive>
  );
};

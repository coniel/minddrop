import React, { FC, useCallback, useMemo } from 'react';
import { Topic } from '@minddrop/topics';
import { App, useAppCore } from '@minddrop/app';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuProps,
  DropdownMenuTrigger,
  IconButton,
} from '@minddrop/ui';
import { TopicMenu } from '../TopicMenu';

export interface TopicViewOptionsMenuProps extends DropdownMenuProps {
  /**
   * The trail of topic IDs leading up to and including the active one.
   */
  trail: string[];
}

export const TopicViewOptionsMenu: FC<TopicViewOptionsMenuProps> = ({
  trail,
  ...other
}) => {
  const core = useAppCore();

  const onAddSubtopic = useCallback(
    (subtopic: Topic) => {
      App.openTopicView(core, [...trail, subtopic.id]);
    },
    [trail],
  );

  const onDelete = useCallback(() => {
    if (trail.length > 1) {
      // If the topic has a parent, open the parent topic view
      App.openTopicView(core, trail.slice(0, -1));
    } else {
      const rootTopics = App.getRootTopics();

      if (rootTopics.length > 1) {
        // If the topic has no parent, open the first root topic view
        // if there is one.
        App.openTopicView(core, [rootTopics[0].id]);
      }
    }
  }, [trail]);

  return (
    <DropdownMenu {...other}>
      <DropdownMenuTrigger>
        <IconButton icon="more-vertical" label="Topic  options" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="topic-menu-content">
        <TopicMenu
          menuType="dropdown"
          trail={trail}
          onAddSubtopic={onAddSubtopic}
          onDelete={onDelete}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

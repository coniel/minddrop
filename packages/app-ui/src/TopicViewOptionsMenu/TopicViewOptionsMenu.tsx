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
import { useTranslation } from '@minddrop/i18n';
import { generateTopicMenu } from '../menus';
import { PersistentStore } from '@minddrop/persistent-store';

export interface TopicViewOptionsMenuProps extends DropdownMenuProps {
  /**
   * The topic.
   */
  topic: Topic;

  /**
   * The trail of topic IDs leading up to and including the active one.
   */
  trail: string[];
}

export const TopicViewOptionsMenu: FC<TopicViewOptionsMenuProps> = ({
  topic,
  trail,
  ...other
}) => {
  const core = useAppCore();

  const onAddSubtopic = useCallback(
    (t: Topic, subtopic: Topic) => {
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

  const dropdownMenu = useMemo(
    () =>
      generateTopicMenu(core, trail, {
        onAddSubtopic,
        onDelete,
      }),
    [core, topic, onAddSubtopic],
  );

  return (
    <DropdownMenu {...other}>
      <DropdownMenuTrigger>
        <IconButton icon="more-vertical" label="Topic  options" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="topic-menu-content"
        content={dropdownMenu}
      />
    </DropdownMenu>
  );
};

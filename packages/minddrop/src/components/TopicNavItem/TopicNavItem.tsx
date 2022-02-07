import React, { FC, useCallback, useState } from 'react';
import {
  TopicNavItem as TopicNavItemPrimitive,
  TopicNavItemProps as TopicNavItemPrimitiveProps,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  Popover,
  PopoverAnchor,
} from '@minddrop/ui';
import { Topic, useTopic } from '@minddrop/topics';
import { generateTopicMenu } from '../../menus';
import { useAppCore } from '@minddrop/app';
import {
  PersistentStore,
  useLocalPersistentStoreValue,
} from '@minddrop/persistent-store';
import { FieldValue } from '@minddrop/utils';
import { RenameTopicPopover } from '../RenameTopicPopover';
import { App } from '@minddrop/app';

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
  const expandedTopics = useLocalPersistentStoreValue<string[]>(
    core,
    'expandedTopics',
  );
  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);

  const handleExpandedChange = useCallback(
    (expanded) => {
      PersistentStore.setLocalValue(
        core,
        'expandedTopics',
        expanded ? FieldValue.arrayUnion(id) : FieldValue.arrayRemove(id),
      );
    },
    [id],
  );

  function openTopicView(topicId: string) {
    App.openTopicView(core, topicId);
  }

  function onAddSubtopic(t: Topic, subtopic: Topic) {
    handleExpandedChange(true);
    openTopicView(subtopic.id);
  }

  function openRenamePopover() {
    setRenamePopoverOpen(true);
  }

  function closeRenamePopover() {
    setRenamePopoverOpen(false);
  }

  return (
    <Popover open={renamePopoverOpen} onOpenChange={null}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <PopoverAnchor asChild>
            <TopicNavItemPrimitive
              label={topic.title}
              expanded={expandedTopics.includes(id)}
              onExpandedChange={handleExpandedChange}
              onClick={() => openTopicView(id)}
              {...other}
            >
              {topic.subtopics.map((subtopicId) => (
                <TopicNavItem key={subtopicId} id={subtopicId} />
              ))}
            </TopicNavItemPrimitive>
          </PopoverAnchor>
        </ContextMenuTrigger>
        <ContextMenuContent
          className="topic-menu-content"
          content={generateTopicMenu(core, topic, {
            onRename: openRenamePopover,
            onAddSubtopic,
          })}
        />
      </ContextMenu>
      <RenameTopicPopover topic={topic} onClose={closeRenamePopover} />
    </Popover>
  );
};

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
import { useTopic } from '@minddrop/topics';
import { generateTopicMenu } from '../../menus';
import { useAppCore } from '../../utils';
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

  function expand() {
    handleExpandedChange(true);
  }

  function openRenamePopover() {
    setRenamePopoverOpen(true);
  }

  function closeRenamePopover() {
    setRenamePopoverOpen(false);
  }

  function openTopicView() {
    App.openView(core, {
      id: 'topic',
      title: topic.title,
      resource: { id: topic.id, type: 'topic' },
    });
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
              onClick={openTopicView}
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
            onAddSubtopic: expand,
          })}
        />
      </ContextMenu>
      <RenameTopicPopover topic={topic} onClose={closeRenamePopover} />
    </Popover>
  );
};

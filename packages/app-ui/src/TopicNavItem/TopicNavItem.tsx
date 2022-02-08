import React, { FC, useCallback, useMemo, useState } from 'react';
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
import { generateTopicMenu } from '../menus';
import { useAppCore, useCurrentView, TopicViewInstance } from '@minddrop/app';
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
   * The IDs of the topics leading up to and including the topic.
   */
  trail: string[];
}

export const TopicNavItem: FC<TopicNavItemProps> = ({ trail, ...other }) => {
  const core = useAppCore();
  // The topic ID is the last ID in the trail
  const topicId = useMemo(() => trail.slice(-1)[0], trail);
  const topic = useTopic(topicId);
  const { instance } = useCurrentView<TopicViewInstance>();
  const expandedTopics = useLocalPersistentStoreValue<string[]>(
    core,
    'expandedTopics',
  );
  const isActive = useMemo(() => {
    if (!instance) {
      return false;
    }

    return instance.topicId === topicId;
  }, [instance, topicId]);
  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);

  const handleExpandedChange = useCallback(
    (expanded) => {
      PersistentStore.setLocalValue(
        core,
        'expandedTopics',
        expanded
          ? FieldValue.arrayUnion(topicId)
          : FieldValue.arrayRemove(topicId),
      );
    },
    [topicId],
  );

  function openTopicView(topicTrail: string[]) {
    App.openTopicView(core, topicTrail);
  }

  function onAddSubtopic(t: Topic, subtopic: Topic) {
    handleExpandedChange(true);
    openTopicView([...trail, subtopic.id]);
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
              active={isActive}
              expanded={expandedTopics.includes(topicId)}
              onExpandedChange={handleExpandedChange}
              onClick={() => openTopicView(trail)}
              {...other}
            >
              {topic.subtopics.map((subtopicId) => (
                <TopicNavItem key={subtopicId} trail={[...trail, subtopicId]} />
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

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  TopicNavItem as TopicNavItemPrimitive,
  TopicNavItemProps as TopicNavItemPrimitiveProps,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  Popover,
  PopoverAnchor,
} from '@minddrop/ui';
import { App } from '@minddrop/app';
import { Topic, useTopic, TopicViewInstanceData } from '@minddrop/topics';
import { useAppCore, useCurrentView } from '@minddrop/app';
import {
  useDraggable,
  useSelectionContains,
  useIsDragging,
} from '@minddrop/selection';
import {
  LocalPersistentStore,
  useLocalPersistentStoreValue,
} from '@minddrop/persistent-store';
import { FieldValue, mapPropsToClasses } from '@minddrop/utils';
import { RenameTopicPopover } from '../RenameTopicPopover';
import { TopicMenu } from '../TopicMenu';
import './TopicNavItem.css';

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
  const topicId = useMemo(() => trail.slice(-1)[0], [trail]);
  const topic = useTopic(topicId);
  const [dragOver, setDragOver] = useState<'top' | 'topic' | null>(null);
  const { onDragStart, onDragEnd } = useDraggable({
    id: topicId,
    resource: 'topics:topic',
  });
  const isDragging = useIsDragging();
  const selectionContainsTopics = useSelectionContains('topics:topic');
  const { instance } = useCurrentView<TopicViewInstanceData>();
  const expandedTopics = useLocalPersistentStoreValue<string[]>(
    core,
    'expandedTopics',
    [],
  );
  const isActive = useMemo(() => {
    if (!instance) {
      return false;
    }

    return instance.topic === topicId;
  }, [instance, topicId]);
  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);

  useEffect(() => {
    if (!isDragging || !selectionContainsTopics) {
      setDragOver(null);
    }
  }, [isDragging, selectionContainsTopics]);

  const handleExpandedChange = useCallback(
    (expanded) => {
      LocalPersistentStore.set(
        core,
        'expandedTopics',
        expanded
          ? FieldValue.arrayUnion(topicId)
          : FieldValue.arrayRemove(topicId),
      );
    },
    [topicId, core],
  );

  function openTopicView(topicTrail: string[]) {
    App.openTopicView(core, topicTrail);
  }

  function onAddSubtopic(subtopic: Topic) {
    handleExpandedChange(true);
    openTopicView([...trail, subtopic.id]);
  }

  function openRenamePopover() {
    setRenamePopoverOpen(true);
  }

  function closeRenamePopover() {
    setRenamePopoverOpen(false);
  }

  const handleDragEnterTopTarget = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragOver('top');
    },
    [],
  );

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="topic-nav-item-container">
      <div
        className={mapPropsToClasses(
          {
            over: dragOver === 'top',
            displayed: isDragging && selectionContainsTopics,
          },
          'top-drop-target',
        )}
        onDragEnter={handleDragEnterTopTarget}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      />
      <Popover open={renamePopoverOpen} onOpenChange={null}>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <PopoverAnchor asChild>
              <TopicNavItemPrimitive
                draggable
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                label={topic.title}
                active={isActive}
                expanded={expandedTopics.includes(topicId)}
                onExpandedChange={handleExpandedChange}
                onClick={() => openTopicView(trail)}
                {...other}
              >
                {topic.subtopics.map((subtopicId) => (
                  <TopicNavItem
                    key={subtopicId}
                    trail={[...trail, subtopicId]}
                  />
                ))}
              </TopicNavItemPrimitive>
            </PopoverAnchor>
          </ContextMenuTrigger>
          <ContextMenuContent className="topic-menu-content">
            <TopicMenu
              menuType="context"
              trail={trail}
              onRename={openRenamePopover}
              onAddSubtopic={onAddSubtopic}
            />
          </ContextMenuContent>
        </ContextMenu>
        <RenameTopicPopover topic={topic} onClose={closeRenamePopover} />
      </Popover>
    </div>
  );
};

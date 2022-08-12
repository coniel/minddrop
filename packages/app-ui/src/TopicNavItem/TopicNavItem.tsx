import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  TopicNavItem as TopicNavItemPrimitive,
  TopicNavItemProps as TopicNavItemPrimitiveProps,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  Popover,
  PopoverAnchor,
  Text,
} from '@minddrop/ui';
import { useTranslation } from '@minddrop/i18n';
import { App } from '@minddrop/app';
import {
  Selection,
  SelectionItem,
  useSelection,
  useDraggable,
  useIsDragging,
} from '@minddrop/selection';
import {
  Topic,
  Topics,
  useTopic,
  TopicViewInstanceData,
} from '@minddrop/topics';
import { useAppCore, useCurrentView } from '@minddrop/app';
import {
  LocalPersistentStore,
  useLocalPersistentStoreValue,
} from '@minddrop/persistent-store';
import {
  FieldValue,
  mapPropsToClasses,
  createDataInsertFromDataTransfer,
} from '@minddrop/utils';
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

export const TopicNavItem: FC<TopicNavItemProps> = ({
  trail,
  level = 0,
  ...other
}) => {
  const core = useAppCore();
  const { t } = useTranslation();
  // The topic ID is the last ID in the trail
  const topicId = useMemo(() => trail.slice(-1)[0], [trail]);
  // Get the topic
  const topic = useTopic(topicId);
  // Check whether topics are being dragged
  const isDraggingTopics = useIsDragging('topics:topic', true);
  // Get selected topics
  const selection = useSelection('topics:topic');
  // Get the current view instance
  const { instance } = useCurrentView<TopicViewInstanceData>();
  // Initialize drag and drop callbacks
  const { onDragStart, onDragEnd } = useDraggable({
    id: topicId,
    resource: 'topics:topic',
    parent:
      trail.length > 1
        ? {
            resource: 'topics:topic',
            id: trail.slice(-2)[0],
          }
        : undefined,
  });
  // The location at which a topic selection is
  // being dragged over this topic.
  const [dragOver, setDragOver] = useState<'top' | 'topic' | null>(null);
  // The open state of the renaming popover
  const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);
  // Get the list of expanded topics from the local
  // persistent store.
  const expandedTopics = useLocalPersistentStoreValue<string[]>(
    core,
    'expandedTopics',
    [],
  );
  // Whether or not a view for this topic is currently open
  const isActive = useMemo(() => {
    if (!instance) {
      // There is no view instance open
      return false;
    }

    // Check whether the open view instance's topic ID is
    // that of this topic.
    return instance.topic === topicId;
  }, [instance, topicId]);
  // Whether or not the topic itself is being dragged
  const isDraggingSelf = !!selection.find((item) => item.id === topicId);
  // Whether the dragged topics includes a parent of this topic
  const isDraggingParent = Topics.isDescendant(
    topicId,
    selection.map((item) => item.id),
  );

  useEffect(() => {
    if (isDraggingTopics) {
      // Reset the drag over location state when drag ends
      setDragOver(null);
    }
  }, [isDraggingTopics]);

  const handleExpandedChange = useCallback(
    (expanded) => {
      // Save the expanded state to the local persistent store
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

  const removeDraggedSubtopicsFromParents = (
    draggedTopics: SelectionItem[],
  ): string[] => {
    // The IDs of the subtopics which were removed
    // from their parent.
    const affectedTopics: string[] = [];

    // Group subtopics by parent topic
    const parentSubtopics = draggedTopics.reduce((map, topicItem) => {
      // If the topic has not parent or the parent is not
      // another topic, ignore it.
      if (!topicItem.parent || topicItem.parent.resource !== 'topics:topic') {
        return map;
      }

      // Add the topic ID to the list of affected topics
      affectedTopics.push(topicItem.id);

      const existingGroup = map[topicItem.parent.id];

      return {
        ...map,
        [topicItem.parent.id]: existingGroup
          ? [...existingGroup, topicItem.id]
          : [topicItem.id],
      };
    }, {});

    // Remove the subtopics from each parent topic
    Object.keys(parentSubtopics).forEach((parentId) => {
      Topics.removeSubtopics(core, parentId, parentSubtopics[parentId]);
    });

    return affectedTopics;
  };

  const handleRootTopicDropTopTarget = (draggedTopics: SelectionItem[]) => {
    // Get the topic IDs
    const draggedTopicIds = draggedTopics.map((item) => item.id);

    // Get the root topic IDs
    const rootTopicIds = App.getRootTopics().map((topic) => topic.id);

    // Check if the drag was initiated from the root level
    // or from within a parent topic.
    const containsOnlyRootTopics = draggedTopics.reduce(
      (rootOnly, draggedTopic) => (!draggedTopic.parent ? rootOnly : false),
      true,
    );

    // Drag event contains only root level topics
    if (containsOnlyRootTopics) {
      // Remove the dragged topics from the list of root topics
      const sorted = rootTopicIds.filter((id) => !draggedTopicIds.includes(id));
      // Add the dragged topics back in to the list of root topics
      // above the dropped location.
      sorted.splice(sorted.indexOf(topicId), 0, ...draggedTopicIds);
      // Save the sorted root topics
      App.sortRootTopics(core, sorted);
      // Stop here
      return;
    }

    // Remove the dragged subtopics from their parent topics
    const moveToRoot = removeDraggedSubtopicsFromParents(draggedTopics);

    // Add the topics to the root level
    App.addRootTopics(core, moveToRoot, rootTopicIds.indexOf(topicId));
  };

  const handleSubtopicDropTopTarget = (draggedTopics: SelectionItem[]) => {
    // Get the parent topic ID
    const parentId = trail.slice(-2)[0];
    // Get the parent topic
    const parent = Topics.get(parentId);
    // Get the topic IDs
    const draggedTopicIds = draggedTopics.map((item) => item.id);

    // Check if the drag was initiated from within the topic's
    // subtopics.
    const containsOnlySubtopics = draggedTopics.reduce(
      (subtopicOnly, draggedTopic) =>
        // Has a parent
        draggedTopic.parent &&
        // Parent is a topic
        draggedTopic.parent.resource === 'topics:topic' &&
        // Parent ID is equal to target parent ID
        draggedTopic.parent.id === parentId
          ? subtopicOnly
          : false,
      true,
    );

    // Drag event contains only this topic's subtopics
    if (containsOnlySubtopics) {
      // Remove the dragged topics from the list of subtopics
      const sorted = parent.subtopics.filter(
        (id) => !draggedTopicIds.includes(id),
      );
      // Add the dragged topics back in to the list of subtopics
      // above the dropped location.
      sorted.splice(sorted.indexOf(topicId), 0, ...draggedTopicIds);
      // Save the sorted subtopics
      Topics.sortSubtopics(core, parentId, sorted);
      // Stop here
      return;
    }

    // Remove the dragged subtopics from their parent topics
    const moveToParent = removeDraggedSubtopicsFromParents(draggedTopics);

    // Add the dragged topics to the parent topic
    Topics.addSubtopics(
      core,
      parentId,
      moveToParent,
      parent.subtopics.indexOf(topicId),
    );

    // Get dragged root level topic IDs
    const draggedRootTopics = draggedTopics
      .filter((item) => !item.parent)
      .map((item) => item.id);

    App.moveRootTopicsToParentTopic(
      core,
      parentId,
      draggedRootTopics,
      parent.subtopics.indexOf(topicId),
    );
  };

  const handleDropTopTarget = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(null);

    // Get selection from the event data transfer
    const selection = Selection.getFromDataInsert(
      createDataInsertFromDataTransfer(event.dataTransfer),
    );
    // Get topics from the selection
    const draggedTopics = Selection.filter(selection, 'topics:topic');

    if (selection.length !== draggedTopics.length) {
      // If the selection is not exclusively topics, stop here
      return;
    }

    if (trail.length === 1) {
      // Topic is a root level topic
      handleRootTopicDropTopTarget(draggedTopics);
    } else {
      handleSubtopicDropTopTarget(draggedTopics);
    }
  };

  return (
    <div className="topic-nav-item-container">
      <div
        className={mapPropsToClasses(
          {
            over: dragOver === 'top',
            displayed: isDraggingTopics && !isDraggingSelf && !isDraggingParent,
          },
          'top-drop-target',
        )}
        onDragEnter={handleDragEnterTopTarget}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropTopTarget}
        data-testid="top-drop-target"
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
                {topic.subtopics.length === 0 && (
                  <Text
                    as="div"
                    color="light"
                    className="helper-text"
                    style={{ paddingLeft: level * 16 }}
                  >
                    {t('noSubtopics')}
                  </Text>
                )}
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

import React from 'react';
import { setDataTransferData } from '@minddrop/utils';
import { getSelectedTopics } from '../getSelectedTopics';
import { useSelectableTopic } from '../useSelectableTopic';
import { useAppStore } from '../useAppStore';

export interface TopicDragging {
  /**
   * Indicates whether or not the topic is currently
   * being dragged.
   */
  isBeingDragged: boolean;

  /**
   * Callback fired when dragging starts.
   */
  onDragStart(event: React.DragEvent): void;
}

/**
 * Provides utilities for handling topic dragging behaviour.
 */
export function useDraggableTopic(topicId: string): TopicDragging {
  const { draggedData } = useAppStore();
  const { isSelected, select } = useSelectableTopic(topicId);

  return {
    isBeingDragged: draggedData.topics.includes(topicId),
    onDragStart: (event) => {
      // Select the topic
      if (!isSelected) {
        select();
      }

      setDataTransferData(event, {
        action: 'sort',
        topics: getSelectedTopics(),
      });
    },
  };
}

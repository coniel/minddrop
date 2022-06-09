import React from 'react';
import { useAppCore } from '../utils';
import { selectTopics } from '../selectTopics';
import { useSelectedTopics } from '../useSelectedTopics';
import { unselectTopics } from '../unselectTopics';
import { clearSelectedTopics } from '../clearSelectedTopics';

export interface TopicSelection {
  /**
   * Indicates whether the topic is currently selected.
   */
  isSelected: boolean;

  /**
   * Selects the topic.
   */
  select(): void;

  /**
   * Unselects the topic.
   */
  unselect(): void;

  /**
   * onClick callback for handling selection.
   * - selects the topic if not currently selected
   * - toggles selection if Shift modifier is active
   */
  onClick(event: React.MouseEvent): void;
}

/**
 * Provides topic selection utilities.
 *
 * @param topicId The ID of the topic.
 * @returns Topic selection utilities.
 */
export function useSelectableTopic(topicId: string): TopicSelection {
  const core = useAppCore();
  const selectedTopics = useSelectedTopics();
  const isSelected = !!selectedTopics[topicId];

  function handleClick(event: React.MouseEvent) {
    // Stop propagation to prevent document click listener
    // which clears topic selection.
    event.stopPropagation();

    // If not a shift click, unselect all topics and
    // select this one.
    if (!event.shiftKey) {
      clearSelectedTopics(core);
      selectTopics(core, [topicId]);
    } else if (!isSelected) {
      // Shift clicked topic which is not selcted,
      // select the topic.
      selectTopics(core, [topicId]);
    } else {
      // Shift clicked topic which is selcted,
      // unselect the topic.
      unselectTopics(core, [topicId]);
    }
  }

  return {
    isSelected,
    select: () => selectTopics(core, [topicId]),
    unselect: () => unselectTopics(core, [topicId]),
    onClick: handleClick,
  };
}

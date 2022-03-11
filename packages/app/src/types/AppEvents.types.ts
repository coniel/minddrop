import { EventListenerCallback } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { Topic, TopicMap } from '@minddrop/topics';
import { View, ViewInstance } from '@minddrop/views';

export type OpenViewEvent = 'app:open-view';
export type AddRootTopicsEvent = 'app:add-root-topics';
export type RemoveRootTopicsEvent = 'app:remove-root-topics';
export type MoveSubtopicsToRootEvent = 'app:move-subtopics-root';
export type ArchiveRootTopicsEvent = 'app:archive-root-topics';
export type UnarchiveRootTopicsEvent = 'app:unarchive-root-topics';
export type SelectDropsEvent = 'app:select-drops';
export type UnselectDropsEvent = 'app:unselect-drops';
export type ClearSelectedDropsEvent = 'app:clear-selected-drops';

export type AddRootTopicsEventData = TopicMap;
export type RemoveRootTopicsEventData = TopicMap;
export type ArchiveRootTopicsEventData = TopicMap;
export type UnarchiveRootTopicsEventData = TopicMap;
export type SelectDropsEventData = DropMap;
export type UnselectDropsEventData = DropMap;

export interface OpenViewEventData {
  view: View;
  instance: ViewInstance | null;
}

export interface MoveSubtopicsToRootEventData {
  /**
   * The topic from which the subtopics were moved.
   */
  fromTopic: Topic;

  /**
   * The moved subtopics.
   */
  subtopics: TopicMap;
}

export type OpenViewEventCallback = EventListenerCallback<
  OpenViewEvent,
  OpenViewEventData
>;
export type AddRootTopicsEventCallback = EventListenerCallback<
  AddRootTopicsEvent,
  AddRootTopicsEventData
>;
export type RemoveRootTopicsEventCallback = EventListenerCallback<
  RemoveRootTopicsEvent,
  RemoveRootTopicsEventData
>;
export type MoveSubtopicsToRootEventCallback = EventListenerCallback<
  MoveSubtopicsToRootEvent,
  RemoveRootTopicsEventData
>;
export type ArchiveRootTopicsEventCallback = EventListenerCallback<
  ArchiveRootTopicsEvent,
  RemoveRootTopicsEventData
>;
export type UnarchiveRootTopicsEventCallback = EventListenerCallback<
  UnarchiveRootTopicsEvent,
  UnarchiveRootTopicsEventData
>;
export type SelectDropsEventCallback = EventListenerCallback<
  SelectDropsEvent,
  SelectDropsEventData
>;
export type UnselectDropsEventCallback = EventListenerCallback<
  UnselectDropsEvent,
  UnselectDropsEventData
>;
export type ClearSelectedDropsEventCallback =
  EventListenerCallback<ClearSelectedDropsEvent>;

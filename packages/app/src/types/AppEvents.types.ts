import { EventListenerCallback } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { Topic, TopicMap } from '@minddrop/topics';
import { ViewConfig, ViewInstance } from '@minddrop/views';

export type OpenViewEvent = 'app:view:open';
export type AddRootTopicsEvent = 'app:root-topics:add';
export type RemoveRootTopicsEvent = 'app:root-topics:remove';
export type MoveRootTopicsEvent = 'app:root-topics:move';
export type ArchiveRootTopicsEvent = 'app:root-topics:archive';
export type UnarchiveRootTopicsEvent = 'app:root-topics:unarchive';
export type SelectDropsEvent = 'app:selection:select-drops';
export type UnselectDropsEvent = 'app:selection:unselect-drops';
export type ClearSelectedDropsEvent = 'app:clear-selected-drops';

export type AddRootTopicsEventData = TopicMap;
export type RemoveRootTopicsEventData = TopicMap;
export type ArchiveRootTopicsEventData = TopicMap;
export type UnarchiveRootTopicsEventData = TopicMap;
export type SelectDropsEventData = DropMap;
export type UnselectDropsEventData = DropMap;

export interface OpenViewEventData {
  view: ViewConfig;
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

export interface MoveRootTopicsEventData {
  /**
   * The topic into which the topics were moved.
   */
  toTopic: Topic;

  /**
   * The moved topics.
   */
  topics: TopicMap;
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
export type MoveRootTopicsEventCallback = EventListenerCallback<
  MoveRootTopicsEvent,
  MoveRootTopicsEventData
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

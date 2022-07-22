import { EventListenerCallback } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { Topic, TopicMap } from '@minddrop/topics';
import { ViewConfig, ViewInstance } from '@minddrop/views';

// View events
export type OpenViewEvent = 'app:view:open';
// Root topic events
export type AddRootTopicsEvent = 'app:root-topics:add';
export type RemoveRootTopicsEvent = 'app:root-topics:remove';
export type MoveRootTopicsEvent = 'app:root-topics:move';
export type ArchiveRootTopicsEvent = 'app:root-topics:archive';
export type UnarchiveRootTopicsEvent = 'app:root-topics:unarchive';
// Selection events
export type SelectDropsEvent = 'app:selection:select-drops';
export type UnselectDropsEvent = 'app:selection:unselect-drops';
export type SelectTopicsEvent = 'app:selection:select-topics';
export type UnselectTopicsEvent = 'app:selection:unselect-topics';
export type ClearSelectionEvent = 'app:selection:clear';

// View event data
export interface OpenViewEventData {
  view: ViewConfig;
  instance: ViewInstance | null;
}
// Root topic event data
export type AddRootTopicsEventData = TopicMap;
export type RemoveRootTopicsEventData = TopicMap;
export type ArchiveRootTopicsEventData = TopicMap;
export type UnarchiveRootTopicsEventData = TopicMap;
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
// Selection event data
export type SelectDropsEventData = DropMap;
export type UnselectDropsEventData = DropMap;
export type SelectTopicsEventData = TopicMap;
export type UnselectTopicsEventData = TopicMap;

// View event callbacks
export type OpenViewEventCallback = EventListenerCallback<
  OpenViewEvent,
  OpenViewEventData
>;
// Root topic event callbacks
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
// Selection event callbacks
export type SelectDropsEventCallback = EventListenerCallback<
  SelectDropsEvent,
  SelectDropsEventData
>;
export type UnselectDropsEventCallback = EventListenerCallback<
  UnselectDropsEvent,
  UnselectDropsEventData
>;
export type SelectTopicsEventCallback = EventListenerCallback<
  SelectTopicsEvent,
  SelectTopicsEventData
>;
export type UnselectTopicsEventCallback = EventListenerCallback<
  UnselectTopicsEvent,
  UnselectTopicsEventData
>;
export type ClearSelectionEventCallback =
  EventListenerCallback<ClearSelectionEvent>;

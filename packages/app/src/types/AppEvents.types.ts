import { EventListenerCallback } from '@minddrop/core';
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

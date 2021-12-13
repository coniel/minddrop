import { Drop } from '@minddrop/drops';
import { Tag } from '@minddrop/tags';
import { DataInsert, EventListenerCallback } from '@minddrop/core';
import { Topic, TopicChanges } from './Topic.types';

export type CreateTopicEvent = 'topics:create';
export type UpdateTopicEvent = 'topics:update';
export type AddSubtopicsEvent = 'topics:add-subtopics';
export type RemoveSubtopicsEvent = 'topics:remove-subtopics';
export type AddDropsEvent = 'topics:add-drops';
export type RemoveDropsEvent = 'topics:remove-drops';
export type AddTagsEvent = 'topics:add-tags';
export type RemoveTagsEvent = 'topics:remove-tags';
export type ArchiveTopicEvent = 'topics:archive';
export type UnarchiveTopicEvent = 'topics:unarchive';
export type DeleteTopicEvent = 'topics:delete';
export type RestoreTopicEvent = 'topics:restore';
export type PermanentlyDeleteTopicEvent = 'topics:delete-permanently';
export type LoadTopicsEvent = 'topics:load';
export type ClearTopicsEvent = 'topics:clear';
export type InsertDataEvent = 'topics:insert-data';

export type CreateTopicEventData = Topic;
export type ArchiveTopicEventData = Topic;
export type UnarchiveTopicEventData = Topic;
export type DeleteTopicEventData = Topic;
export type RestoreTopicEventData = Topic;
export type PermanentlyDeleteTopicEventData = Topic;
export type LoadTopicsEventData = Topic[];

export interface UpdateTopicEventData {
  /**
   * The topic data prior to being updated.
   */
  before: Topic;

  /**
   * The updated topic data.
   */
  after: Topic;

  /**
   * The changes made to the topic data.
   */
  changes: TopicChanges;
}

export interface AddSubtopicsEventData {
  /**
   * The topic to which the subtopics were added.
   */
  topic: Topic;

  /**
   * The subtopics which were added to the topic.
   */
  subtopics: Topic[];
}

export interface RemoveSubtopicsEventData {
  /**
   * The topic from which the subtopics were removed.
   */
  topic: Topic;

  /**
   * The subtopics which were removed from the topic.
   */
  subtopics: Topic[];
}

export interface AddDropsEventData {
  /**
   * The topic to which the drops were added.
   */
  topic: Topic;

  /**
   * The drops which were added to the topic.
   */
  drops: Drop[];
}

export interface RemoveDropsEventData {
  /**
   * The topic from which the drops were removed.
   */
  topic: Topic;

  /**
   * The drops which were removed from the topic.
   */
  drops: Drop[];
}

export interface AddTagsEventData {
  /**
   * The topic to which the tags were added.
   */
  topic: Topic;

  /**
   * The tags which were added to the topic.
   */
  tags: Tag[];
}

export interface RemoveTagsEventData {
  /**
   * The topic from which the tags were removed.
   */
  topic: Topic;

  /**
   * The tags which were removed from the topic.
   */
  tags: Tag[];
}

export interface InsertDataEventData {
  /**
   * The topic into which the data was inserted.
   */
  topic: Topic;

  /**
   * The inserted data.
   */
  data: DataInsert;
}

export type CreateTopicEventCallback = EventListenerCallback<
  CreateTopicEvent,
  CreateTopicEventData
>;
export type UpdateTopicEventCallback = EventListenerCallback<
  UpdateTopicEvent,
  UpdateTopicEventData
>;
export type AddSubtopicsEventCallback = EventListenerCallback<
  AddSubtopicsEvent,
  AddSubtopicsEventData
>;
export type RemoveSubtopicsEventCallback = EventListenerCallback<
  RemoveSubtopicsEvent,
  RemoveSubtopicsEventData
>;
export type AddDropsEventCallback = EventListenerCallback<
  AddDropsEvent,
  AddDropsEventData
>;
export type RemoveDropsEventCallback = EventListenerCallback<
  RemoveDropsEvent,
  RemoveDropsEventData
>;
export type AddTagsEventCallback = EventListenerCallback<
  AddTagsEvent,
  AddTagsEventData
>;
export type RemoveTagsEventCallback = EventListenerCallback<
  RemoveTagsEvent,
  RemoveTagsEventData
>;
export type ArchiveTopicEventCallback = EventListenerCallback<
  ArchiveTopicEvent,
  ArchiveTopicEventData
>;
export type UnarchiveTopicEventCallback = EventListenerCallback<
  UnarchiveTopicEvent,
  UnarchiveTopicEventData
>;
export type DeleteTopicEventCallback = EventListenerCallback<
  DeleteTopicEvent,
  DeleteTopicEventData
>;
export type RestoreTopicEventCallback = EventListenerCallback<
  RestoreTopicEvent,
  RestoreTopicEventData
>;
export type PermanentlyDeleteTopicEventCallback = EventListenerCallback<
  PermanentlyDeleteTopicEvent,
  PermanentlyDeleteTopicEventData
>;
export type InsertDataEventCallback = EventListenerCallback<
  InsertDataEvent,
  InsertDataEventData
>;
export type LoadTopicsEventCallback = EventListenerCallback<
  LoadTopicsEvent,
  LoadTopicsEventData
>;
export type ClearTopicsEventCallback = EventListenerCallback<ClearTopicsEvent>;

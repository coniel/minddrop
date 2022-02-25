import { DropMap } from '@minddrop/drops';
import { TagMap } from '@minddrop/tags';
import { DataInsert, EventListenerCallback } from '@minddrop/core';
import { Topic, TopicChanges, TopicMap } from './Topic.types';
import { TopicView } from './TopicView.types';
import { TopicViewInstance } from './TopicViewInstance.types';

export type CreateTopicEvent = 'topics:create';
export type UpdateTopicEvent = 'topics:update';
export type AddSubtopicsEvent = 'topics:add-subtopics';
export type ArchiveSubtopicsEvent = 'topics:archive-subtopics';
export type UnarchiveSubtopicsEvent = 'topics:unarchive-subtopics';
export type RemoveSubtopicsEvent = 'topics:remove-subtopics';
export type AddDropsEvent = 'topics:add-drops';
export type ArchiveDropsEvent = 'topics:archive-drops';
export type UnarchiveDropsEvent = 'topics:unarchive-drops';
export type RemoveDropsEvent = 'topics:remove-drops';
export type AddTagsEvent = 'topics:add-tags';
export type RemoveTagsEvent = 'topics:remove-tags';
export type DeleteTopicEvent = 'topics:delete';
export type RestoreTopicEvent = 'topics:restore';
export type PermanentlyDeleteTopicEvent = 'topics:delete-permanently';
export type RegisterViewEvent = 'topics:register-view';
export type UnregisterViewEvent = 'topics:unregsiter-view';
export type CreateViewInstanceEvent = 'topics:create-view-instance';
export type DeleteViewInstanceEvent = 'topics:delete-view-instance';
export type LoadTopicsEvent = 'topics:load';
export type ClearTopicsEvent = 'topics:clear';
export type InsertDataEvent = 'topics:insert-data';

export type CreateTopicEventData = Topic;
export type DeleteTopicEventData = Topic;
export type RestoreTopicEventData = Topic;
export type PermanentlyDeleteTopicEventData = Topic;
export type RegisterViewEventData = TopicView;
export type UnregisterViewEventData = TopicView;
export type CreateViewInstanceData = TopicViewInstance;
export type DeleteViewInstanceData = TopicViewInstance;
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
  subtopics: TopicMap;
}

export interface ArchiveSubtopicsEventData {
  /**
   * The topic in which the subtopics were archived.
   */
  topic: Topic;

  /**
   * The subtopics which were archvied.
   */
  subtopics: TopicMap;
}

export interface UnarchiveSubtopicsEventData {
  /**
   * The topic in which the subtopics were unarchived.
   */
  topic: Topic;

  /**
   * The subtopics which were unarchvied.
   */
  subtopics: TopicMap;
}

export interface RemoveSubtopicsEventData {
  /**
   * The topic from which the subtopics were removed.
   */
  topic: Topic;

  /**
   * The subtopics which were removed from the topic.
   */
  subtopics: TopicMap;
}

export interface AddDropsEventData {
  /**
   * The topic to which the drops were added.
   */
  topic: Topic;

  /**
   * The drops which were added to the topic.
   */
  drops: DropMap;
}

export interface ArchiveDropsEventData {
  /**
   * The topic in which the drops were archived.
   */
  topic: Topic;

  /**
   * The drops which were archvied.
   */
  drops: DropMap;
}

export interface UnarchiveDropsEventData {
  /**
   * The topic in which the drops were unarchived.
   */
  topic: Topic;

  /**
   * The drops which were unarchvied.
   */
  drops: DropMap;
}

export interface RemoveDropsEventData {
  /**
   * The topic from which the drops were removed.
   */
  topic: Topic;

  /**
   * The drops which were removed from the topic.
   */
  drops: DropMap;
}

export interface AddTagsEventData {
  /**
   * The topic to which the tags were added.
   */
  topic: Topic;

  /**
   * The tags which were added to the topic.
   */
  tags: TagMap;
}

export interface RemoveTagsEventData {
  /**
   * The topic from which the tags were removed.
   */
  topic: Topic;

  /**
   * The tags which were removed from the topic.
   */
  tags: TagMap;
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
export type ArchiveDropsEventCallback = EventListenerCallback<
  ArchiveDropsEvent,
  ArchiveDropsEventData
>;
export type UnarchiveDropsEventCallback = EventListenerCallback<
  UnarchiveDropsEvent,
  UnarchiveDropsEventData
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
export type RegisterViewEventCallback = EventListenerCallback<
  RegisterViewEvent,
  RegisterViewEventData
>;
export type UnregisterViewEventCallback = EventListenerCallback<
  UnregisterViewEvent,
  UnregisterViewEventData
>;
export type CreateViewInstanceEventCallback = EventListenerCallback<
  CreateViewInstanceEvent,
  CreateViewInstanceData
>;
export type DeleteViewInstanceEventCallback = EventListenerCallback<
  DeleteViewInstanceEvent,
  DeleteViewInstanceData
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

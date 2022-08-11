import { DropMap } from '@minddrop/drops';
import { TagMap } from '@minddrop/tags';
import { ResourceReference } from '@minddrop/resources';
import { DataInsert, EventListenerCallback } from '@minddrop/core';
import { Topic, TopicChanges, TopicMap } from './Topic.types';
import { TopicViewConfig } from './TopicViewConfig.types';
import { TopicViewInstance } from './TopicViewInstance.types';

export type CreateTopicEvent = 'topics:topic:create';
export type UpdateTopicEvent = 'topics:topic:update';
export type AddSubtopicsEvent = 'topics:topic:add-subtopics';
export type ArchiveSubtopicsEvent = 'topics:topic:archive-subtopics';
export type UnarchiveSubtopicsEvent = 'topics:topic:unarchive-subtopics';
export type RemoveSubtopicsEvent = 'topics:topic:remove-subtopics';
export type MoveSubtopicsEvent = 'topics:topic:move-subtopics';
export type SortSubtopicsEvent = 'topics:topic:sort-subtopics';
export type AddDropsEvent = 'topics:topic:add-drops';
export type ArchiveDropsEvent = 'topics:topic:archive-drops';
export type UnarchiveDropsEvent = 'topics:topic:unarchive-drops';
export type RemoveDropsEvent = 'topics:topic:remove-drops';
export type MoveDropsEvent = 'topics:topic:move-drops';
export type AddParentsEvent = 'topics:topic:add-parents';
export type RemoveParentsEvent = 'topics:topic:remove-parents';
export type AddTagsEvent = 'topics:topic:add-tags';
export type RemoveTagsEvent = 'topics:topic:remove-tags';
export type DeleteTopicEvent = 'topics:topic:delete';
export type RestoreTopicEvent = 'topics:topic:restore';
export type PermanentlyDeleteTopicEvent = 'topics:topic:delete-permanently';
export type RegisterViewEvent = 'topics:view:register';
export type UnregisterViewEvent = 'topics:view:unregsiter';
export type CreateViewInstanceEvent = 'topics:view:create-instance';
export type DeleteViewInstanceEvent = 'topics:view:delete-instance';
export type LoadTopicsEvent = 'topics:topic:load';
export type InsertDataEvent = 'topics:topic:insert-data';

export type CreateTopicEventData = Topic;
export type DeleteTopicEventData = Topic;
export type RestoreTopicEventData = Topic;
export type PermanentlyDeleteTopicEventData = Topic;
export type SortSubtopicsEventData = Topic;
export type RegisterViewEventData = TopicViewConfig;
export type UnregisterViewEventData = TopicViewConfig;
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

export interface MoveSubtopicsEventData {
  /**
   * The topic from which the subtopics were removed.
   */
  fromTopic: Topic;

  /**
   * The topic to which the subtopics were added.
   */
  toTopic: Topic;

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

export interface MoveDropsEventData {
  /**
   * The topic from which the drops were removed.
   */
  fromTopic: Topic;

  /**
   * The topic to which the drops were added.
   */
  toTopic: Topic;

  /**
   * The drops which were moved.
   */
  drops: DropMap;
}

export interface AddParentsEventData {
  /**
   * The topic to which the prants were added.
   */
  topic: Topic;

  /**
   * The references of the parents added to the topic.
   */
  parents: ResourceReference[];
}

export interface RemoveParentsEventData {
  /**
   * The topic from which the parents were removed.
   */
  topic: Topic;

  /**
   * The references of the parents which were removed from the topic.
   */
  parents: ResourceReference[];
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
export type MoveSubtopicsEventCallback = EventListenerCallback<
  MoveSubtopicsEvent,
  MoveSubtopicsEventData
>;
export type SortSubtopicsEventCallback = EventListenerCallback<
  SortSubtopicsEvent,
  SortSubtopicsEventData
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
export type MoveDropsEventCallback = EventListenerCallback<
  MoveDropsEvent,
  MoveDropsEventData
>;
export type AddParentsEventCallback = EventListenerCallback<
  AddParentsEvent,
  AddParentsEventData
>;
export type RemoveParentsEventCallback = EventListenerCallback<
  RemoveParentsEvent,
  RemoveParentsEventData
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

import { FieldValueArrayRemove, FieldValueArrayUnion } from '@minddrop/utils';
import { ResourceDocument } from '@minddrop/resources';

export interface TopicData {
  /**
   * The topic title.
   */
  title: string;

  /**
   * The IDs of the (active) subtopics inside to the topic.
   */
  subtopics: string[];

  /**
   * The IDs of the archived subtopics inside to the topic.
   */
  archivedSubtopics: string[];

  /**
   * The IDs of the views belonging to the topic.
   */
  views: string[];

  /**
   * The IDs of the (active) drops inside the topic.
   */
  drops: string[];

  /**
   * The IDs of the archived drops inside the topic.
   */
  archivedDrops: string[];

  /**
   * The IDs of the tags belonging to the topic.
   */
  tags: string[];
}

export type Topic = ResourceDocument<TopicData>;

export interface CreateTopicData {
  title?: string;
  views?: string[];
}

export interface UpdateTopicData {
  title?: string;
  views?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  subtopics?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  archivedSubtopics?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  drops?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  archivedDrops?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  tags?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
}

export interface TopicChanges {
  title?: string;
  subtopics?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  archivedSubtopics?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  views?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  drops?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  archivedDrops?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  tags?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
}

/**
 * A [id]: Topic map.
 */
export type TopicMap = Record<string, Topic>;

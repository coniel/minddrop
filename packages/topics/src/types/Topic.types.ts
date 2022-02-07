import {
  FieldValueArrayRemove,
  FieldValueArrayUnion,
  FieldValueDelete,
} from '@minddrop/utils';

export interface Topic {
  /**
   * Universally unique ID.
   */
  id: string;

  /**
   * The topic title.
   */
  title: string;

  /**
   * The IDs of the subtopics inside to the topic.
   */
  subtopics: string[];

  /**
   * The IDs of the views belonging to the topic.
   */
  views: string[];

  /**
   * The IDs of the drops inside the topic.
   */
  drops: string[];

  /**
   * The IDs of the tags belonging to the topic.
   */
  tags: string[];

  /**
   * Timestamp at which the topic was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the topic was last updated.
   */
  updatedAt: Date;

  /**
   * If `true`, the topic is archived.
   */
  archived?: boolean;

  /**
   * Timestamp at which the topic was archived.
   */
  archivedAt?: Date;

  /**
   * If `true`, the topic is deleted.
   */
  deleted?: boolean;

  /**
   * Timestamp at which the topic was deleted.
   */
  deletedAt?: Date;

  /**
   * If `true`, the topic is hidden.
   */
  hidden?: boolean;
}

export interface CreateTopicData {
  title?: string;
  hidden?: true;
  views?: string[];
}

export interface UpdateTopicData {
  title?: string;
}

export interface TopicChanges {
  updatedAt: Date;
  title?: string;
  subtopics?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  drops?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  tags?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  archived?: true | FieldValueDelete;
  archivedAt?: Date | FieldValueDelete;
  deleted?: true | FieldValueDelete;
  deletedAt?: Date | FieldValueDelete;
  hidden?: true | FieldValueDelete;
}

/**
 * A [id]: Topic map.
 */
export type TopicMap = Record<string, Topic>;

import {
  FieldValueArrayFilter,
  FieldValueArrayRemove,
  FieldValueArrayUnion,
  FieldValueDelete,
} from '@minddrop/utils';

export type TopicParentReference = {
  /**
   * The type of parent, typically 'topic'.
   */
  type: string;

  /**
   * The ID of the parent.
   */
  id: string;
};

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
   * The parents to which this topic belongs.
   */
  parents: TopicParentReference[];

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

  /**
   * Timestamp at which the topic was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the topic was last updated.
   */
  updatedAt: Date;

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
  id?: string;
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
  parents?:
    | TopicParentReference[]
    | FieldValueArrayUnion
    | FieldValueArrayFilter;
  subtopics?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  archivedSubtopics?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  views?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  drops?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  archivedDrops?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  tags?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  deleted?: true | FieldValueDelete;
  deletedAt?: Date | FieldValueDelete;
  hidden?: true | FieldValueDelete;
}

/**
 * A [id]: Topic map.
 */
export type TopicMap = Record<string, Topic>;

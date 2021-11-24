import { Unset } from '@minddrop/utils';

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
   * `true` if the topic appears at the root level.
   */
  root: boolean;

  /**
   * The IDs of the parent topics of which the topic is a subtopic.
   */
  parents: string[];

  /**
   * The IDs of the topics inside the topic.
   */
  subtopics: string[];

  /**
   * Timestamp at which the topic was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the topic was last updated.
   */
  updatedAt: Date;

  /**
   * `true` when the topic is archived.
   */
  archived?: boolean;

  /**
   * Timestamp at which the topic was archived.
   */
  archivedAt?: Date;

  /**
   * `true` if the topic is  in the trash.
   */
  deleted?: boolean;

  /**
   * Timestamp at which the topic was deleted.
   */
  deleteAt?: boolean;
}

export interface CreateTopicData {
  title?: string;
}

export interface UpdateTopicData {
  title?: string;
  root?: true | Unset;
  parents?: string[];
  subtopics?: string[];
  archived?: true | Unset;
  archivedAt?: Date | Unset;
  deleted?: true | Unset;
  deletedAt?: Date | Unset;
}

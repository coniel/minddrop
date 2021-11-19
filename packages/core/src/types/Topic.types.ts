import { Tag } from './Tag.types';

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
   * The IDs of the drops inside the topic.
   */
  drops: string[];

  /**
   * The IDs of the topics inside the topic.
   */
  subtopics: string[];

  /**
   * IDs of the tags applied to the topic.
   */
  tags?: string[];

  /**
   * Tags belonging to the topic.
   */
  ownedTags: Tag[];

  /**
   * The IDs of extensions enabled for the topic.
   */
  extensions: string[];

  /**
   * Timestamp at which the drop was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the drop was last updated.
   */
  updatedAt: Date;

  /**
   * `true` when the drop is archived.
   */
  archived?: boolean;

  /**
   * Timestamp at which the drop was archived.
   */
  archivedAt?: Date;

  /**
   * `true` if the drop is  in the trash.
   */
  deleted?: boolean;

  /**
   * Timestamp at which the drop was deleted.
   */
  deleteAt?: boolean;
}

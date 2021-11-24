import { Topic } from './Topic.types';

export type CreateTopicEvent = 'create-topic';
export type UpdateTopicEvent = 'update-topic';
export type MoveTopicEvent = 'move-topic';
export type AddTopicEvent = 'add-topic';
export type ArchiveTopicEvent = 'archive-topic';
export type UnarchiveTopicEvent = 'unarchive-topic';
export type DeleteTopicEvent = 'delete-topic';
export type RestoreTopicEvent = 'restore-topic';

export type CreateTopicEventData = Topic;
export type ArchiveTopicEventData = Topic;
export type UnarchiveTopicEventData = Topic;
export type DeleteTopicEventData = Topic;
export type RestoreTopicEventData = Topic;

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
  changes: Partial<Topic>;
}

// Move refers to moving an existing topic into a new
// location and removing it from its current location.
export interface MoveTopicEventData {
  /**
   * The topic ID from which the topic was moved.
   * `null` if the topic was moved from the root level.
   */
  from: string | null;

  /**
   * The topic ID to which the topic is being moved.
   * `null` if topic is being moved to the root level.
   */
  to: string | null;

  /**
   * The topic being moved.
   */
  topic: Topic;
}

// Add refers to adding an existing topic into a new
// location without removing it from its current location.
export interface AddTopicEventData {
  /**
   * The topic ID to which the topic is being added.
   * `null` if topic is being added to the root level.
   */
  to: string | null;

  /**
   * The topic being added.
   */
  topic: Topic;
}

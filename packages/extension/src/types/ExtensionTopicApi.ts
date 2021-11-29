import { EventListenerCallback } from '@minddrop/core';
import {
  AddTopicEvent,
  AddTopicEventData,
  ArchiveTopicEvent,
  ArchiveTopicEventData,
  CreateTopicData,
  CreateTopicEvent,
  CreateTopicEventData,
  DeleteTopicEvent,
  DeleteTopicEventData,
  MoveTopicEvent,
  MoveTopicEventData,
  RestoreTopicEvent,
  RestoreTopicEventData,
  Topic,
  UnarchiveTopicEvent,
  UnarchiveTopicEventData,
  UpdateTopicData,
  UpdateTopicEvent,
  UpdateTopicEventData,
} from '@minddrop/topic';

export interface ExtensionTopicApi {
  /**
   * Creates a new topic, returing the topic.
   *
   * @param data The topic data.
   * @param parent The ID of the parent topic. If ommited the topic will be created at the root level.
   *
   * @returns The newly created topic.
   */
  createTopic(data?: CreateTopicData, parent?: string): Topic;

  /**
   * Updates a topic, returning the updated topic.
   *
   * @param id The ID of the topic being updated.
   * @param data Updates to be applied to the topic.
   *
   * @returns The updated topic.
   */
  updateTopic(id: string, data: UpdateTopicData): Topic;

  /**
   * Adds an existing topic into another topic, or to the root level. The topic is *not* removed from its current parent.
   *
   * @param id The ID of the topic to add.
   * @param to The ID of the parent topic into which to add the topic. `null` if adding to the root level.
   */
  addTopic(id: string, to: string | null): void;

  /**
   * Moves a topic into another topic or the root level. The topic *is* removed from its current parent.
   *
   * @param id The ID of the moved topic.
   * @param from The ID of the parent topic from which the topic is being moved, `null` if moving from root level.
   * @param to The ID of the parent topic into which the topic is being moved, `null` if moving to root level.
   */
  moveTopic(id: string, from: string | null, to: string | null): void;

  /**
   * Archives a topic.
   *
   * @param id The ID of the topic to archive.
   */
  archiveTopic(id: string): void;

  /**
   * Deletes a topic. Deleted topics can still be
   * recovered from the trash.
   *
   * @param id The ID of the topic to delete.
   */
  deleteTopic(id: string): void;

  // Event listeners
  // Create topic
  addEventListener(
    type: CreateTopicEvent,
    callback: EventListenerCallback<CreateTopicEvent, CreateTopicEventData>,
  ): void;

  // Update topic
  addEventListener(
    type: UpdateTopicEvent,
    callback: EventListenerCallback<UpdateTopicEvent, UpdateTopicEventData>,
  ): void;

  // Move topic into another topic
  addEventListener(
    type: MoveTopicEvent,
    callback: EventListenerCallback<MoveTopicEvent, MoveTopicEventData>,
  ): void;

  // Add topic to another topic
  addEventListener(
    type: AddTopicEvent,
    callback: EventListenerCallback<AddTopicEvent, AddTopicEventData>,
  ): void;

  // Archive topic
  addEventListener(
    type: ArchiveTopicEvent,
    callback: EventListenerCallback<ArchiveTopicEvent, ArchiveTopicEventData>,
  ): void;

  // Unarchive topic
  addEventListener(
    type: UnarchiveTopicEvent,
    callback: EventListenerCallback<
      UnarchiveTopicEvent,
      UnarchiveTopicEventData
    >,
  ): void;

  // Delete topic
  addEventListener(
    type: DeleteTopicEvent,
    callback: EventListenerCallback<DeleteTopicEvent, DeleteTopicEventData>,
  ): void;

  // Restore topic
  addEventListener(
    type: RestoreTopicEvent,
    callback: EventListenerCallback<RestoreTopicEvent, RestoreTopicEventData>,
  ): void;
}

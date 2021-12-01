import { EventListenerCallback } from '@minddrop/core';
import {
  CreateTagData,
  CreateTagEvent,
  CreateTagEventData,
  DeleteTagEvent,
  DeleteTagEventData,
  Tag,
  UpdateTagData,
  UpdateTagEvent,
  UpdateTagEventData,
} from '@minddrop/tags';

export interface ExtensionTagApi {
  /**
   * Creates a new tag, returing the tag.
   *
   * @param data The tag data.
   * @param topic The ID of the parent topic. If ommited the tag will be created at the root level.
   *
   * @returns The newly created tag.
   */
  createTag(data?: CreateTagData, topic?: string): Tag;

  /**
   * Updates a tag, returning the updated tag.
   *
   * @param id The ID of the tag being updated.
   * @param data Updates to be applied to the tag.
   *
   * @returns The updated tag.
   */
  updateTag(id: string, data: UpdateTagData): Tag;

  /**
   * Deletes a tag. Deleted tags can still be
   * recovered from the trash.
   *
   * @param id The ID of the tag to delete.
   */
  deleteTag(id: string): void;

  /**
   * Adds a tag to a topic.
   *
   * @param topicId The ID of the topic to tag.
   * @param tagId The ID of the tag to add to the topic.
   */
  tagTopic(topicId: string, tagId: string): void;

  /**
   * Removes a tag from a topic.
   *
   * @param topicId The ID of the topic to untag.
   * @param tagId The ID of the tag to remove from the topic.
   */
  untagTopic(topicId: string, tagId: string): void;

  /**
   * Adds a tag to a drop.
   *
   * @param dropId The ID of the drop to tag.
   * @param tagId The ID of the tag to add to the drop.
   */
  tagDrop(dropId: string, tagId: string): void;

  /**
   * Removes a tag from a drop.
   *
   * @param dropId The ID of the drop to untag.
   * @param tagId The ID of the tag to remove from the drop.
   */
  untagDrop(dropId: string, tagId: string): void;

  // Event listeners
  // Create tag
  addEventListener(
    type: CreateTagEvent,
    callback: EventListenerCallback<CreateTagEvent, CreateTagEventData>,
  ): void;

  // Update tag
  addEventListener(
    type: UpdateTagEvent,
    callback: EventListenerCallback<UpdateTagEvent, UpdateTagEventData>,
  ): void;

  // Delete tag
  addEventListener(
    type: DeleteTagEvent,
    callback: EventListenerCallback<DeleteTagEvent, DeleteTagEventData>,
  ): void;
}

import { Core } from '@minddrop/core';
import { ResourceApi } from '@minddrop/resources';
import {
  TagData,
  CreateTagData,
  UpdateTagData,
  Tag,
  TagMap,
} from './Tag.types';
import {
  CreateTagEvent,
  CreateTagEventCallback,
  DeleteTagEvent,
  DeleteTagEventCallback,
  UpdateTagEvent,
  UpdateTagEventCallback,
  LoadTagsEvent,
  LoadTagsEventCallback,
} from './TagEvents.types';

export interface TagsApi {
  /**
   * Retrieves a tag by ID.
   *
   * @param tagId - The ID of the tag to retrieve.
   * @returns The requested tag.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the requested tag does not exist.
   */
  get(tagId: string): Tag;

  /**
   * Retrieves multiple tags by ID, returning a `{ [id]: Tag }` map.
   *
   * @param tagIds - The IDs of the tag to retrieve.
   * @returns The requested tags as a `{ [id]: Tag }` map.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if any of the requested tags do not exist.
   */
  get(tagIds: string[]): TagMap;

  /**
   * Retrieves all tags as a `{ [id]: Tag }` map.
   *
   * @returns All tags as a `{ [id]: Tag }` map.
   */
  getAll(): TagMap;

  /**
   * Creates a new tag and dispatches a `tags:tag:create` event.
   * Returns the new tag.
   *
   * @param core - A MindDrop core instance.
   * @param data - The tag property values.
   * @returns The newly created tag.
   *
   * @throws ResourceValidationError
   * Thrown if the provided data is invalid.
   */
  create(core: Core, data: CreateTagData): Tag;

  /**
   * Updates a tag and dispatches a `tags:tag:update` event.
   * Returns the updated tag.
   *
   * @param core - A MindDrop core instance.
   * @param id - The ID of the tag to update.
   * @param data - The changes to apply to the tag.
   * @returns The updated tag.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the tag does not exist.
   *
   * @throws ResourceValidationError
   * Thrown if the provided data is invalid.
   */
  update(core: Core, id: string, data: UpdateTagData): Tag;

  /**
   * Soft deletes a tag and dispatches a `tags:tag:delete` event.
   * Returns the deleted tag.
   *
   * Soft deleted tags can be restored using the `restore` method.
   *
   * @param core - A MindDrop core instance.
   * @param tagId - The ID of the tag to delete.
   * @returns The deleted tag.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the tag does not exist.
   */
  delete(core: Core, id: string): Tag;

  /**
   * Rstores a soft deleted a tag and dispatches a
   * `tags:tag:restore` event. Returns the restored tag.
   *
   * @param core - A MindDrop core instance.
   * @param tagId - The ID of the tag to restore.
   * @returns The restored tag.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the tag does not exist.
   */
  restore(core: Core, id: string): Tag;

  /**
   * Permanently deletes a tag and dispatches a
   * `tags:tag:delete` event. Returns the deleted tag.
   *
   * Permanently deleted tags cannot be restored.
   *
   * @param core - A MindDrop core instance.
   * @param tagId - The ID of the tag to delete.
   * @returns The deleted tag.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the tag does not exist.
   */
  deletePermanently(core: Core, id: string): Tag;

  /**
   * The tags document store
   */
  store: ResourceApi<TagData, CreateTagData, UpdateTagData>['store'];

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'tags:tag:create' event listener
  addEventListener(
    core: Core,
    type: CreateTagEvent,
    callback: CreateTagEventCallback,
  ): void;

  // Add 'tags:tag:update' event listener
  addEventListener(
    core: Core,
    type: UpdateTagEvent,
    callback: UpdateTagEventCallback,
  ): void;

  // Add 'tags:tag:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteTagEvent,
    callback: DeleteTagEventCallback,
  ): void;

  // Add 'tags:tag:load' event listener
  addEventListener(
    core: Core,
    type: LoadTagsEvent,
    callback: LoadTagsEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'tags:tag:create' event listener
  removeEventListener(
    core: Core,
    type: CreateTagEvent,
    callback: CreateTagEventCallback,
  ): void;

  // Remove 'tags:tag:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateTagEvent,
    callback: UpdateTagEventCallback,
  ): void;

  // Remove 'tags:tag:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteTagEvent,
    callback: DeleteTagEventCallback,
  ): void;

  // Remove 'tags:tag:load' event listener
  removeEventListener(
    core: Core,
    type: LoadTagsEvent,
    callback: LoadTagsEventCallback,
  ): void;
}

import { Core } from '@minddrop/core';
import { CreateTagData, UpdateTagData, Tag, TagMap } from './Tag.types';
import {
  CreateTagEvent,
  CreateTagEventCallback,
  DeleteTagEvent,
  DeleteTagEventCallback,
  UpdateTagEvent,
  UpdateTagEventCallback,
  ClearTagsEvent,
  ClearTagsEventCallback,
  LoadTagsEvent,
  LoadTagsEventCallback,
} from './TagEvents.types';

export interface TagsApi {
  /**
   * Retrieves one or more tags by ID.
   *
   * If provided a single ID string, returns the tag.
   *
   * If provided an array of IDs, returns a `{ [id]: Tag }` map of the corresponding tags.
   *
   * @param ids An array of tag IDs to retrieve.
   * @returns The requested tag(s).
   */
  get(tagId: string): Tag | null;
  get(tagIds: string[]): TagMap;

  /**
   * Retrieves all tags from the tags store as a `{ [id]: Tag }` map.
   *
   * @returns A `{ [id]: Tag }` map.
   */
  getAll(): TagMap;

  /**
   * Creates a new tag and dispatches a `tags:create` event.
   * Returns the new tag.
   *
   * @param core A MindDrop core instance.
   * @param data The tag property values.
   * @returns The newly created tag.
   */
  create(core: Core, data: CreateTagData): Tag;

  /**
   * Applies data changes to a tag and dispatches a
   * `tags:update` event. Returns the updated tag.
   *
   * @param core A MindDrop core instance.
   * @param id The ID of the tag to update.
   * @param data The changes to apply to the tag.
   * @returns The updated tag.
   */
  update(core: Core, id: string, data: UpdateTagData): Tag;

  /**
   * Permanently deletes a tag and dispatches a
   * `tags:delete` event. Returns the deleted tag.
   *
   * @param core A MindDrop core instance.
   * @param tagId The ID of the tag to delete.
   * @returns The deleted tag.
   */
  delete(core: Core, id: string): Tag;

  /**
   * Loads tags into the store and dispatches a `tags:load` event.
   *
   * @param core A MindDrop core instance.
   * @param tags The tags to load.
   */
  load(core: Core, tags: Tag[]): void;

  /**
   * Clears tags from the store and dispatches a `tags:clear` event.
   *
   * @param core A MindDrop core instance.
   */
  clear(core: Core): void;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'tags:create' event listener
  addEventListener(
    core: Core,
    type: CreateTagEvent,
    callback: CreateTagEventCallback,
  ): void;

  // Add 'tags:update' event listener
  addEventListener(
    core: Core,
    type: UpdateTagEvent,
    callback: UpdateTagEventCallback,
  ): void;

  // Add 'tags:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteTagEvent,
    callback: DeleteTagEventCallback,
  ): void;

  // Add 'tags:load' event listener
  addEventListener(
    core: Core,
    type: LoadTagsEvent,
    callback: LoadTagsEventCallback,
  ): void;

  // Add 'tags:delete' event listener
  addEventListener(
    core: Core,
    type: ClearTagsEvent,
    callback: ClearTagsEventCallback,
  ): void;

  /* ********************************** */
  /* *** removeEventListener overloads *** */
  /* ********************************** */

  // Add 'tags:create' event listener
  removeEventListener(
    core: Core,
    type: CreateTagEvent,
    callback: CreateTagEventCallback,
  ): void;

  // Add 'tags:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateTagEvent,
    callback: UpdateTagEventCallback,
  ): void;

  // Add 'tags:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteTagEvent,
    callback: DeleteTagEventCallback,
  ): void;

  // Add 'tags:load' event listener
  removeEventListener(
    core: Core,
    type: LoadTagsEvent,
    callback: LoadTagsEventCallback,
  ): void;

  // Add 'tags:delete' event listener
  removeEventListener(
    core: Core,
    type: ClearTagsEvent,
    callback: ClearTagsEventCallback,
  ): void;
}

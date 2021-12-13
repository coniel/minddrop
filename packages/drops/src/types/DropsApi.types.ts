import { Core } from '@minddrop/core';
import { CreateDropData, Drop, DropMap, UpdateDropData } from './Drop.types';
import {
  CreateDropEvent,
  UpdateDropEvent,
  ArchiveDropEvent,
  DeleteDropEvent,
  RestoreDropEvent,
  CreateDropEventCallback,
  AddTagsEvent,
  AddTagsEventCallback,
  RemoveTagsEvent,
  RemoveTagsEventCallback,
  ArchiveDropEventCallback,
  ClearDropsEvent,
  ClearDropsEventCallback,
  DeleteDropEventCallback,
  LoadDropsEvent,
  LoadDropsEventCallback,
  RestoreDropEventCallback,
  UpdateDropEventCallback,
  PermanentlyDeleteDropEvent,
  PermanentlyDeleteDropEventCallback,
  AddFilesEvent,
  AddFilesEventCallback,
  RemoveFilesEvent,
  RemoveFilesEventCallback,
  ReplaceFilesEvent,
  ReplaceFilesEventCallback,
} from './DropEvents.types';
import { DropFilters } from './DropFilters.types';

export interface DropsApi {
  /**
   * Retrieves one or more drops by ID.
   *
   * If provided a single ID string, returns the drop.
   *
   * If provided an array of IDs, returns a `{ [id]: Drop }` map of the corresponding drops.
   * Drops can be filtered by passing in DropFilters. Filtering is not supported when getting a single drop.
   *
   * @param ids An array of drop IDs to retrieve.
   * @param filters Filters to filter to the drops by, only supported when getting multiple drops.
   * @returns The requested drop(s).
   */
  get(dropId: string): Drop | null;
  get(dropIds: string[], filters?: DropFilters): DropMap;

  /**
   * Retrieves all drops from the drops store as a `{ [id]: Drop }` map.
   * Drops can be filtered by passing in DropFilters.
   *
   * @param filters Filters to filter to the drops by.
   * @returns A `{ [id]: Drop }` map.
   */
  getAll(filters?: DropFilters): DropMap;

  /**
   * Retrieves a drop's parent drops, returning an array of drops.
   * By default, only active drops are returned.
   */
  // dropParents(dropId: string): Drop[];

  /**
   * Creates a new drop and dispatches a `drops:create` event.
   * Returns the new drop.
   *
   * @param core A MindDrop core instance.
   * @param data The default drop property values.
   * @returns The newly created drop.
   */
  create(core: Core, data?: CreateDropData): Drop;

  /**
   * Updates a drop and dispatches a `drops:update` event.
   * Returns the updated drop.
   *
   * @param core A MindDrop core instance.
   * @param id The ID of the drop to update.
   * @param data The changes to apply to the drop.
   * @returns The updated drop.
   */
  update(core: Core, id: string, data: UpdateDropData): Drop;

  /**
   * Archives a drop and dispatches a `drops:archive`
   * event and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop to archive.
   * @returns The archived drop.
   */
  archive(core: Core, dropId: string): Drop;

  /**
   * Deletes a drop and dispatches a `drops:delete`
   * event and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop to delete.
   * @returns The deleted drop.
   */
  delete(core: Core, dropId: string): Drop;

  /**
   * Restores an archived or deleted drop and dispatches
   * a `drops:restore` event and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop to restore.
   * @returns The restored drop.
   */
  restore(core: Core, dropId: string): Drop;

  /**
   * Permanently deletes a drop and dispatches a
   * `drops:delete-permanently` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop to delete permanently.
   */
  deletePermanently(core: Core, dropId: string): void;

  /**
   * Adds tags to a drop and dispatches a `drops:add-tags` event
   * and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop to which to add the tags.
   * @param tagIds The IDs of the tags to add to the drop.
   * @returns The updated drop.
   */
  addTags(core: Core, dropId: string, tagIds: string[]): void;

  /**
   * Removes tags from a drop and dispatches a `drops:remove-tags` event
   * and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop from which to remove the tags.
   * @param tagIds The IDs of the tags to remove.
   * @returns The updated drop.
   */
  removeTags(core: Core, dropId: string, tagIds: string[]): void;

  /**
   * Adds files to a drop and dispatches a `drops:add-files` event
   * and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop to which to add the files.
   * @param fileIds The IDs of the files to add to the drop.
   * @returns The updated drop.
   */
  addFiles(core: Core, dropId: string, fileIds: string[]): Drop;

  /**
   * Removes files from a drop and dispatches a `drops:add-files` event
   * and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop from which to remove the files.
   * @param fileIds The IDs of the files to remove.
   * @returns The updated drop.
   */
  removeFiles(core: Core, dropId: string, fileIds: string[]): Drop;

  /**
   * Replaces a drop's files, removing the current ones and
   * adding the new ones. Dispatches a `drops:replace-files` event
   * and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop in which to replace the files.
   * @param fileIds The IDs of the files to add to the drop.
   * @returns The updated drop.
   */
  replaceFiles(core: Core, dropId: string, fileIds: string[]): Drop;

  /**
   * Loads drops into the store by dispatching a `drops:load` event.
   *
   * @param core A MindDrop core instance.
   * @param drops The drops to load.
   */
  load(core: Core, drops: Drop[]): void;

  /**
   * Clears drops from the store by dispatching a `drops:clear` event.
   *
   * @param core A MindDrop core instance.
   */
  clear(core: Core);

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add drops:create event listener
  addEventListener(
    core: Core,
    type: CreateDropEvent,
    callback: CreateDropEventCallback,
  ): void;

  // Add drops:update event listener
  addEventListener(
    core: Core,
    type: UpdateDropEvent,
    callback: UpdateDropEventCallback,
  ): void;

  // Add drops:archive event listener
  addEventListener(
    core: Core,
    type: ArchiveDropEvent,
    callback: ArchiveDropEventCallback,
  ): void;

  // Add drops:delete event listener
  addEventListener(
    core: Core,
    type: DeleteDropEvent,
    callback: DeleteDropEventCallback,
  ): void;

  // Add drops:restore event listener
  addEventListener(
    core: Core,
    type: RestoreDropEvent,
    callback: RestoreDropEventCallback,
  ): void;

  // Add drops:deletepermanently event listener
  addEventListener(
    core: Core,
    type: PermanentlyDeleteDropEvent,
    callback: PermanentlyDeleteDropEventCallback,
  ): void;

  // Add drops:add-tags event listener
  addEventListener(
    core: Core,
    type: AddTagsEvent,
    callback: AddTagsEventCallback,
  );

  // Add drops:remove-tags event listener
  addEventListener(
    core: Core,
    type: RemoveTagsEvent,
    callback: RemoveTagsEventCallback,
  );

  // Add drops:add-files event listener
  addEventListener(
    core: Core,
    type: AddFilesEvent,
    callback: AddFilesEventCallback,
  );

  // Add drops:remove-files event listener
  addEventListener(
    core: Core,
    type: RemoveFilesEvent,
    callback: RemoveFilesEventCallback,
  );

  // Add drops:replace-files event listener
  addEventListener(
    core: Core,
    type: ReplaceFilesEvent,
    callback: ReplaceFilesEventCallback,
  );

  // Add drops:load event listener
  addEventListener(
    core: Core,
    type: LoadDropsEvent,
    callback: LoadDropsEventCallback,
  );

  // Add drops:clear event listener
  addEventListener(
    core: Core,
    type: ClearDropsEvent,
    callback: ClearDropsEventCallback,
  );

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove drops:create event listener
  removeEventListener(
    core: Core,
    type: CreateDropEvent,
    callback: CreateDropEventCallback,
  ): void;

  // Remove drops:update event listener
  removeEventListener(
    core: Core,
    type: UpdateDropEvent,
    callback: UpdateDropEventCallback,
  ): void;

  // Remove drops:archive event listener
  removeEventListener(
    core: Core,
    type: ArchiveDropEvent,
    callback: ArchiveDropEventCallback,
  ): void;

  // Remove drops:delete-permanently event listener
  removeEventListener(
    core: Core,
    type: DeleteDropEvent,
    callback: DeleteDropEventCallback,
  ): void;

  // Remove drops:restore event listener
  removeEventListener(
    core: Core,
    type: RestoreDropEvent,
    callback: RestoreDropEventCallback,
  ): void;

  // Remove drops:delete-permanently event listener
  removeEventListener(
    core: Core,
    type: PermanentlyDeleteDropEvent,
    callback: PermanentlyDeleteDropEventCallback,
  ): void;

  // Remove drops:add-tags event listener
  removeEventListener(
    core: Core,
    type: AddTagsEvent,
    callback: AddTagsEventCallback,
  );

  // Remove drops:remove-tags event listener
  removeEventListener(
    core: Core,
    type: RemoveTagsEvent,
    callback: RemoveTagsEventCallback,
  );

  // Remove drops:load event listener
  removeEventListener(
    core: Core,
    type: LoadDropsEvent,
    callback: LoadDropsEventCallback,
  );

  // Remove drops:clear event listener
  removeEventListener(
    core: Core,
    type: ClearDropsEvent,
    callback: ClearDropsEventCallback,
  );
}

import { Core, DataInsert } from '@minddrop/core';
import { CreateDropData, Drop, DropMap, UpdateDropData } from './Drop.types';
import { DropConfig } from './DropConfig.types';
import {
  RegisterDropTypeEvent,
  RegisterDropTypeEventCallback,
  UnregisterDropTypeEvent,
  UnregisterDropTypeEventCallback,
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
  ClearRegisteredDropTypesEvent,
  ClearRegisteredDropTypesEventCallback,
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
   * Filters drops by type, active, archived, and deleted states.
   * If no filters are set, returns active drops.
   * If either archived or deleted filters are `true`, active
   * drops are not included unless specifically set to `true`.
   *
   * @param drops The drops to filter.
   * @param filters The filters by which to filter the drops.
   * @returns The filtered drops.
   */
  filter(drops: DropMap, filters: DropFilters): DropMap;

  /**
   * Registers a new drop type and dispatches a `drops:register`
   * event.
   *
   * @param core A MindDrop core instance.
   * @param config The configartion of the drop type to register.
   */
  register(core: Core, config: DropConfig): void;

  /**
   * Unregisters a drop type and dispatches a `drops:unregister` event.
   *
   * @param core A MindDrop core instance.
   * @param type The type of drop to unregister.
   */
  unregister(core: Core, type: string): void;

  /**
   * Creates a new drop and dispatches a `drops:create` event.
   * Returns the new drop.
   *
   * If the drop is created with attached files, the file references
   * of the attached files will be automatically updated, adding the
   * drop as a attached resource.
   *
   * @param core A MindDrop core instance.
   * @param data The default drop property values.
   * @returns The newly created drop.
   */
  create(core: Core, data?: CreateDropData): Drop;

  /**
   * Creates a drop of the specified type and dispatches
   * a `drops:create` event.
   *
   * @param core A MindDrop core instance.
   * @param type The type of drop to create.
   * @param data The data from which to create the drop.
   * @returns A promise which resolves to the new drop.
   */
  createOfType(core: Core, type: string, data?: DataInsert): Promise<Drop>;

  /**
   * Creates drops of the appropriate type given a `DataInsert` object
   * and an array of `DropConfig` objects. Returns a promise resolving
   * to a `{ [id]: Drop }` map of the created drops. Dispatches a
   * `drops:create` event for each created drop.
   *
   * @param core A MindDrop core instance.
   * @param data The data from which to create the drops.
   * @param configs The drop configs from which to create the drops.
   */
  createFromDataInsert(
    core: Core,
    dataInsert: DataInsert,
    configs: DropConfig[],
  ): Promise<DropMap>;

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
   * Inserts data into a drop.
   * Does nothing if the drop type is not configured to accept
   * data inserts. Returns a promise which resolves to the updated
   * drop (or original drop if it was not updated).
   *
   * If the drop is updated as a result of the insert, dispatches a
   * `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop into which to insert the data.
   * @param data The data to be inserted into the drop.
   * @returns A promise resolving to the updated drop.
   */
  insertData(core: Core, dropId: string, data: DataInsert): Promise<Drop>;

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
   * @returns The deleted drop.
   */
  deletePermanently(core: Core, dropId: string): Drop;

  /**
   * Adds tags to a drop and dispatches a `drops:add-tags` event
   * and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop to which to add the tags.
   * @param tagIds The IDs of the tags to add to the drop.
   * @returns The updated drop.
   */
  addTags(core: Core, dropId: string, tagIds: string[]): Drop;

  /**
   * Removes tags from a drop and dispatches a `drops:remove-tags` event
   * and a `drops:update` event.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop from which to remove the tags.
   * @param tagIds The IDs of the tags to remove.
   * @returns The updated drop.
   */
  removeTags(core: Core, dropId: string, tagIds: string[]): Drop;

  /**
   * Adds files to a drop and dispatches a `drops:add-files` event
   * and a `drops:update` event.
   *
   * The file references of the attached files will be automatically
   * updated to include the drop ID in their `attachedTo` value.
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
   * The file references of the removed files will be automatically updated
   * to remove the drop ID from their `attachedTo` value, and deleted if the
   * drop was their only attachment.
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
   * The file references of the added files will be automatically
   * updated to include the drop ID in their `attachedTo` value.
   *
   * The file references of the removed files will be automatically
   * updated to remove the drop ID from their `attachedTo` value, and
   * deleted if the drop was their only attachment.
   *
   * @param core A MindDrop core instance.
   * @param dropId The ID of the drop in which to replace the files.
   * @param fileIds The IDs of the files to add to the drop.
   * @returns The updated drop.
   */
  replaceFiles(core: Core, dropId: string, fileIds: string[]): Drop;

  /**
   * Loads drops into the store and dispatches a `drops:load` event.
   *
   * @param core A MindDrop core instance.
   * @param drops The drops to load.
   */
  load(core: Core, drops: Drop[]): void;

  /**
   * Clears drops from the store and dispatches a `drops:clear-drops` event.
   *
   * @param core A MindDrop core instance.
   */
  clearDrops(core: Core): void;

  /**
   * Clears registered drop types from the store and dispatches a `drops:clear-register` event.
   *
   * @param core A MindDrop core instance.
   */
  clearRegisteredDropTypes(core: Core): void;

  /**
   * Returns registered drop type configs, optionally filtered by drop type.
   *
   * @param types An array of drop types by which to filter the configs.
   * @returns Registered drop type configs.
   */
  getRegisteredDropTypes(types?: string[]): DropConfig[];

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add drops:register event listener
  addEventListener(
    core: Core,
    type: RegisterDropTypeEvent,
    callback: RegisterDropTypeEventCallback,
  ): void;

  // Add drops:unregister event listener
  addEventListener(
    core: Core,
    type: UnregisterDropTypeEvent,
    callback: UnregisterDropTypeEventCallback,
  ): void;

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

  // Add drops:clear-drops event listener
  addEventListener(
    core: Core,
    type: ClearDropsEvent,
    callback: ClearDropsEventCallback,
  );

  // Add drops:clear-register event listener
  addEventListener(
    core: Core,
    type: ClearRegisteredDropTypesEvent,
    callback: ClearRegisteredDropTypesEventCallback,
  );

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove drops:register event listener
  removeEventListener(
    core: Core,
    type: RegisterDropTypeEvent,
    callback: RegisterDropTypeEventCallback,
  ): void;

  // Remove drops:unregister event listener
  removeEventListener(
    core: Core,
    type: UnregisterDropTypeEvent,
    callback: UnregisterDropTypeEventCallback,
  ): void;

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

  // Remove drops:delete event listener
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

  // Remove drops:add-files event listener
  removeEventListener(
    core: Core,
    type: AddFilesEvent,
    callback: AddFilesEventCallback,
  );

  // Remove drops:remove-files event listener
  removeEventListener(
    core: Core,
    type: RemoveFilesEvent,
    callback: RemoveFilesEventCallback,
  );

  // Remove drops:replace-files event listener
  removeEventListener(
    core: Core,
    type: ReplaceFilesEvent,
    callback: ReplaceFilesEventCallback,
  );

  // Remove drops:load event listener
  removeEventListener(
    core: Core,
    type: LoadDropsEvent,
    callback: LoadDropsEventCallback,
  );

  // Remove drops:clear-drops event listener
  removeEventListener(
    core: Core,
    type: ClearDropsEvent,
    callback: ClearDropsEventCallback,
  );

  // Remove drops:clear-register event listener
  removeEventListener(
    core: Core,
    type: ClearRegisteredDropTypesEvent,
    callback: ClearRegisteredDropTypesEventCallback,
  );
}

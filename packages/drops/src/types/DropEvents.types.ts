import { EventListenerCallback } from '@minddrop/core';
import { TagMap } from '@minddrop/tags';
import { FileReferenceMap } from '@minddrop/files';
import { Drop, DropChanges } from './Drop.types';
import { DropConfig } from './DropConfig.types';

export type RegisterDropTypeEvent = 'drops:register';
export type UnregisterDropTypeEvent = 'drops:unregister';
export type CreateDropEvent = 'drops:create';
export type UpdateDropEvent = 'drops:update';
export type DeleteDropEvent = 'drops:delete';
export type RestoreDropEvent = 'drops:restore';
export type PermanentlyDeleteDropEvent = 'drops:delete-permanently';
export type AddTagsEvent = 'drops:add-tags';
export type RemoveTagsEvent = 'drops:remove-tags';
export type AddFilesEvent = 'drops:add-files';
export type RemoveFilesEvent = 'drops:remove-files';
export type ReplaceFilesEvent = 'drops:replace-files';
export type LoadDropsEvent = 'drops:load';
export type ClearDropsEvent = 'drops:clear-drops';
export type ClearRegisteredDropTypesEvent = 'drops:clear-register';

export type RegisterDropTypeEventData = DropConfig;
export type UnregisterDropTypeEventData = DropConfig;
export type CreateDropEventData = Drop;
export type DeleteDropEventData = Drop;
export type RestoreDropEventData = Drop;
export type PermanentlyDeleteDropEventData = Drop;
export type LoadDropsEventData = Drop[];

export interface UpdateDropEventData {
  /**
   * The drop data prior to being updated.
   */
  before: Drop;

  /**
   * The updated drop data.
   */
  after: Drop;

  /**
   * The changes made to the drop data.
   */
  changes: DropChanges;

  /**
   * The drop's files. Only set if files were added to the drop during the update.
   */
  files?: File[];
}

export interface AddTagsEventData {
  /**
   * The drop to which the tags were added.
   */
  drop: Drop;

  /**
   * The tags which were added to the drop.
   */
  tags: TagMap;
}

export interface RemoveTagsEventData {
  /**
   * The drop from which the tags were removed.
   */
  drop: Drop;

  /**
   * The tags which were removed from the drop.
   */
  tags: TagMap;
}

export interface AddFilesEventData {
  /**
   * The drop to which the files were added.
   */
  drop: Drop;

  /**
   * The files which were added to the drop.
   */
  file: FileReferenceMap;
}

export interface RemoveFilesEventData {
  /**
   * The drop from which the files were removed.
   */
  drop: Drop;

  /**
   * The files which were removed from the drop.
   */
  files: FileReferenceMap;
}

export interface ReplaceFilesEventData {
  /**
   * The drop in which the files were replaced.
   */
  drop: Drop;

  /**
   * The drop's old files which were removed.
   */
  oldFiles: FileReferenceMap;

  /**
   * The drop's new files which were added.
   */
  newFiles: FileReferenceMap;
}

export type RegisterDropTypeEventCallback = EventListenerCallback<
  RegisterDropTypeEvent,
  RegisterDropTypeEventData
>;
export type UnregisterDropTypeEventCallback = EventListenerCallback<
  UnregisterDropTypeEvent,
  UnregisterDropTypeEventData
>;
export type CreateDropEventCallback = EventListenerCallback<
  CreateDropEvent,
  CreateDropEventData
>;
export type UpdateDropEventCallback = EventListenerCallback<
  UpdateDropEvent,
  UpdateDropEventData
>;
export type DeleteDropEventCallback = EventListenerCallback<
  DeleteDropEvent,
  DeleteDropEventData
>;
export type RestoreDropEventCallback = EventListenerCallback<
  RestoreDropEvent,
  RestoreDropEventData
>;
export type PermanentlyDeleteDropEventCallback = EventListenerCallback<
  PermanentlyDeleteDropEvent,
  PermanentlyDeleteDropEventData
>;
export type AddTagsEventCallback = EventListenerCallback<
  AddTagsEvent,
  AddTagsEventData
>;
export type RemoveTagsEventCallback = EventListenerCallback<
  RemoveTagsEvent,
  RemoveTagsEventData
>;
export type AddFilesEventCallback = EventListenerCallback<
  AddFilesEvent,
  AddFilesEventData
>;
export type RemoveFilesEventCallback = EventListenerCallback<
  RemoveFilesEvent,
  RemoveFilesEventData
>;
export type ReplaceFilesEventCallback = EventListenerCallback<
  ReplaceFilesEvent,
  ReplaceFilesEventData
>;
export type LoadDropsEventCallback = EventListenerCallback<
  LoadDropsEvent,
  LoadDropsEventData
>;
export type ClearDropsEventCallback = EventListenerCallback<ClearDropsEvent>;
export type ClearRegisteredDropTypesEventCallback =
  EventListenerCallback<ClearRegisteredDropTypesEvent>;

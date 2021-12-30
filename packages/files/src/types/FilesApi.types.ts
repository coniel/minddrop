import { Core } from '@minddrop/core';
import { FileReference, FileReferenceMap } from './FileReference.types';
import {
  CreateFileReferenceEvent,
  CreateFileReferenceEventCallback,
  DeleteFileReferenceEvent,
  DeleteFileReferenceEventCallback,
  ClearFileReferencesEvent,
  ClearFileReferencesEventCallback,
  LoadFileReferencesEvent,
  LoadFileReferencesEventCallback,
  RemoveAttachmentsEventCallback,
  RemoveAttachmentsEvent,
  ReplaceAttachmentsEvent,
  ReplaceAttachmentsEventCallback,
} from './FileEvents.types';
import {
  AddAttachmentsEvent,
  AddAttachmentsEventCallback,
  UpdateFileReferenceEvent,
  UpdateFileReferenceEventCallback,
} from '.';

export interface FilesApi {
  /**
   * Retrieves one or more file references by ID.
   *
   * If provided a single file ID string, returns the its file reference.
   *
   * If provided an array of file IDs, returns a `{ [id]: FileReference }` map of the corresponding files.
   *
   * @param ids An array of file IDs to retrieve.
   * @returns The requested file reference(s).
   */
  get(fileId: string): FileReference | null;
  get(fileIds: string[]): FileReferenceMap;

  /**
   * Retrieves all file references from the file references store as a `{ [id]: FileReference }` map.
   *
   * @returns A `{ [id]: FileReference }` map.
   */
  getAll(): FileReferenceMap;

  /**
   * Creates a new file reference and dispatches a `files:create` event.
   * Returns a promise which resolves to the newly created file reference.
   *
   * @param core A MindDrop core instance.
   * @param file A file object.
   * @param attachedTo The IDs of the resources to which this file is attached.
   * @returns A promise which resolves to the newly created file reference.
   */
  create(core: Core, file: File, attachedTo?: string[]): Promise<FileReference>;

  /**
   * Permanently deletes a file and removes its file reference from the store.
   * Alos dispatches a `files:delete` event.
   *
   * @param core A MindDrop core instance.
   * @param fileId The ID of the file to delete.
   * @retuns The reference of the deleted file.
   */
  delete(core: Core, id: string): FileReference;

  /**
   * Adds resource IDs to a file reference's `attachedTo` value and
   * dispatches a `files:add-attachments` event as well as a
   * `files:update-file-reference` event.
   * Returns the updated file reference.
   *
   * @param core A MindDrop core instance.
   * @param fileId The ID of the file to which to add the attachments.
   * @param resourceIds The IDs of the resources attached to the file.
   * @returns The updated file reference.
   */
  addAttachments(
    core: Core,
    fileId: string,
    resourceIds: string[],
  ): FileReference;

  /**
   * Removes resource IDs from a file reference's `attachedTo` value.
   *
   * If the file reference's `attachedTo` value becomes empty, the
   * files is deleted.
   *
   * Dispatches a `files:replace-attachments` event as well as
   * a `files:update-file-reference` event unless the file was
   * deleted, in which case a `files:delete` event is dispatched.
   *
   * Returns the updated file reference.
   *
   * @param core A MindDrop core instance.
   * @param fileId The ID of the file from which to remove the attachments.
   * @param resourceIds The IDs of the resources to remove from the attachedTo value.
   * @returns The updated file reference.
   */
  removeAttachments(
    core: Core,
    fileId: string,
    resourceIds: string[],
  ): FileReference;

  /**
   * Replaces the resource IDs (removing the current ones and
   * adding the given ones) in file reference's `attachedTo` value.
   *
   * If `resourceIds` is an empty array, the file will be deleted.
   *
   * Dispatches a `files:replace-attachments` event as well as
   * a `files:update-file-reference` event unless the file was
   * deleted, in which case a `files:delete` event is dispatched.
   *
   * Returns the updated file reference.
   *
   * @param core A MindDrop core instance.
   * @param fileId The ID of the file for which to replace the attachments.
   * @param resourceIds The IDs of the resources to which the file was attached.
   * @returns The updated file reference.
   */
  replaceAttachments(
    core: Core,
    fileId: string,
    resourceIds: string[],
  ): FileReference;

  /**
   * Loads file references into the store and dispatches a `files:load` event.
   *
   * @param core A MindDrop core instance.
   * @param files The file references to load.
   */
  load(core: Core, files: FileReference[]): void;

  /**
   * Clears file references from the store and dispatches a `files:clear` event.
   *
   * @param core A MindDrop core instance.
   */
  clear(core: Core): void;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'files:create' event listener
  addEventListener(
    core: Core,
    type: CreateFileReferenceEvent,
    callback: CreateFileReferenceEventCallback,
  ): void;

  // Add 'files:update-file-reference' event listener
  addEventListener(
    core: Core,
    type: UpdateFileReferenceEvent,
    callback: UpdateFileReferenceEventCallback,
  ): void;

  // Add 'files:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteFileReferenceEvent,
    callback: DeleteFileReferenceEventCallback,
  ): void;

  // Add 'files:add-attachments' event listener
  addEventListener(
    core: Core,
    type: AddAttachmentsEvent,
    callback: AddAttachmentsEventCallback,
  ): void;

  // Add 'files:remove-attachments' event listener
  addEventListener(
    core: Core,
    type: RemoveAttachmentsEvent,
    callback: RemoveAttachmentsEventCallback,
  ): void;

  // Add 'files:replace-attachments' event listener
  addEventListener(
    core: Core,
    type: ReplaceAttachmentsEvent,
    callback: ReplaceAttachmentsEventCallback,
  ): void;

  // Add 'files:load' event listener
  addEventListener(
    core: Core,
    type: LoadFileReferencesEvent,
    callback: LoadFileReferencesEventCallback,
  ): void;

  // Add 'files:clear' event listener
  addEventListener(
    core: Core,
    type: ClearFileReferencesEvent,
    callback: ClearFileReferencesEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Add 'files:create' event listener
  removeEventListener(
    core: Core,
    type: CreateFileReferenceEvent,
    callback: CreateFileReferenceEventCallback,
  ): void;

  // Remove 'files:update-file-reference' event listener
  removeEventListener(
    core: Core,
    type: UpdateFileReferenceEvent,
    callback: UpdateFileReferenceEventCallback,
  ): void;

  // Remove 'files:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteFileReferenceEvent,
    callback: DeleteFileReferenceEventCallback,
  ): void;

  // Remove 'files:add-attachments' event listener
  removeEventListener(
    core: Core,
    type: AddAttachmentsEvent,
    callback: AddAttachmentsEventCallback,
  ): void;

  // Remove 'files:remove-attachments' event listener
  removeEventListener(
    core: Core,
    type: RemoveAttachmentsEvent,
    callback: RemoveAttachmentsEventCallback,
  ): void;

  // Remove 'files:replace-attachments' event listener
  removeEventListener(
    core: Core,
    type: ReplaceAttachmentsEvent,
    callback: ReplaceAttachmentsEventCallback,
  ): void;

  // Add 'files:load' event listener
  removeEventListener(
    core: Core,
    type: LoadFileReferencesEvent,
    callback: LoadFileReferencesEventCallback,
  ): void;

  // Add 'files:clear' event listener
  removeEventListener(
    core: Core,
    type: ClearFileReferencesEvent,
    callback: ClearFileReferencesEventCallback,
  ): void;
}

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
} from './FileEvents.types';

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
   * @param data The file property values.
   * @returns A promise which resolves to the newly created file reference.
   */
  create(core: Core, file: File): Promise<FileReference>;

  /**
   * Permanently deletes a file and removes its file reference from the store.
   * Alos dispatches a `files:delete` event.
   *
   * @param core A MindDrop core instance.
   * @param fileId The ID of the file to delete.
   */
  delete(core: Core, id: string): FileReference;

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

  // Add 'files:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteFileReferenceEvent,
    callback: DeleteFileReferenceEventCallback,
  ): void;

  // Add 'files:load' event listener
  addEventListener(
    core: Core,
    type: LoadFileReferencesEvent,
    callback: LoadFileReferencesEventCallback,
  ): void;

  // Add 'files:delete' event listener
  addEventListener(
    core: Core,
    type: ClearFileReferencesEvent,
    callback: ClearFileReferencesEventCallback,
  ): void;

  /* ********************************** */
  /* *** removeEventListener overloads *** */
  /* ********************************** */

  // Add 'files:create' event listener
  removeEventListener(
    core: Core,
    type: CreateFileReferenceEvent,
    callback: CreateFileReferenceEventCallback,
  ): void;

  // Add 'files:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteFileReferenceEvent,
    callback: DeleteFileReferenceEventCallback,
  ): void;

  // Add 'files:load' event listener
  removeEventListener(
    core: Core,
    type: LoadFileReferencesEvent,
    callback: LoadFileReferencesEventCallback,
  ): void;

  // Add 'files:delete' event listener
  removeEventListener(
    core: Core,
    type: ClearFileReferencesEvent,
    callback: ClearFileReferencesEventCallback,
  ): void;
}

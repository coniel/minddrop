import { Core } from '@minddrop/core';
import { ResourceApi, ResourceReference } from '@minddrop/resources';
import { FileReference, FileReferenceMap } from './FileReference.types';
import {
  DeleteFileEvent,
  DeleteFileEventCallback,
  SaveFileEvent,
  SaveFileEventCallback,
  CreateFileReferenceEvent,
  CreateFileReferenceEventCallback,
  DeleteFileReferenceEvent,
  DeleteFileReferenceEventCallback,
  LoadFileReferencesEvent,
  LoadFileReferencesEventCallback,
  UpdateFileReferenceEvent,
  UpdateFileReferenceEventCallback,
} from './FileEvents.types';

export interface FilesApi {
  /**
   * Returns a file reference by ID.
   *
   * @param id - The ID of the file reference to retrieve.
   * @returns The requested file reference.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the file reference does not exist.
   */
  get(fileId: string): FileReference;

  /**
   * Returns a `{ [id]: FileReference }` map of file
   * references by ID.
   *
   * @param ids - The IDs of the file references to retrieve.
   * @returns The requested file references as a `{ [id]: FileReference }` map.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if any of the file references do not exist.
   */
  get(fileIds: string[]): FileReferenceMap;

  /**
   * Retrieves all file references from the file references
   * as a `{ [id]: FileReference }` map.
   *
   * @returns A `{ [id]: FileReference }` map.
   */
  getAll(): FileReferenceMap;

  /**
   * Saves a file and creates a new file reference.
   * Dispatches a `files:file:save` event.
   *
   * Returns a new file reference.
   *
   * @param core - A MindDrop core instance.
   * @param file - A file object.
   * @returns A file reference.
   */
  save(core: Core, file: File): FileReference;

  /**
   * Adds parent resource references to a file reference.
   *
   * @param core - A MindDrop core instance.
   * @param fileReferenceId - The ID of the file reference.
   * @param parentReferences - The resource references of the parent documents to add.
   * @returns The updated file reference.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the file reference does not exist.
   *
   * @throws ResourceValidationError
   * Thrown if one of the parent references is invalid or a
   * parent document does not exist.
   */
  addParents(
    core: Core,
    fileReferenceId: string,
    parentReferences: ResourceReference[],
  ): FileReference;

  /**
   * Removes parent resource references from a resource document.
   *
   * File references with no remaining parents are automatically
   * deleted.
   *
   * @param core - A MindDrop core instance.
   * @param fileReferenceId - The ID of the file reference.
   * @param parentReferences - The resource references of the parent documents to remove.
   * @returns The updated file reference.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the file reference does not exist.
   */
  removeParents(
    core: Core,
    fileId: string,
    parentReferences: ResourceReference[],
  ): FileReference;

  /*
   * The file references resource store.
   */
  store: ResourceApi['store'];

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'files:file:save' event listener
  addEventListener(
    core: Core,
    type: SaveFileEvent,
    callback: SaveFileEventCallback,
  ): void;

  // Add 'files:file:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteFileEvent,
    callback: DeleteFileEventCallback,
  ): void;

  // Add 'files:file-reference:create' event listener
  addEventListener(
    core: Core,
    type: CreateFileReferenceEvent,
    callback: CreateFileReferenceEventCallback,
  ): void;

  // Add 'files:file-reference:update' event listener
  addEventListener(
    core: Core,
    type: UpdateFileReferenceEvent,
    callback: UpdateFileReferenceEventCallback,
  ): void;

  // Add 'files:file-reference:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteFileReferenceEvent,
    callback: DeleteFileReferenceEventCallback,
  ): void;

  // Add 'files:file-reference:load' event listener
  addEventListener(
    core: Core,
    type: LoadFileReferencesEvent,
    callback: LoadFileReferencesEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'files:file:save' event listener
  removeEventListener(
    core: Core,
    type: SaveFileEvent,
    callback: SaveFileEventCallback,
  ): void;

  // Remove 'files:file:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteFileEvent,
    callback: DeleteFileEventCallback,
  ): void;

  // Remove 'files:file-reference:create' event listener
  removeEventListener(
    core: Core,
    type: CreateFileReferenceEvent,
    callback: CreateFileReferenceEventCallback,
  ): void;

  // Remove 'files:file-reference:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateFileReferenceEvent,
    callback: UpdateFileReferenceEventCallback,
  ): void;

  // Remove 'files:file-reference:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteFileReferenceEvent,
    callback: DeleteFileReferenceEventCallback,
  ): void;

  // Remove 'files:file-reference:load' event listener
  removeEventListener(
    core: Core,
    type: LoadFileReferencesEvent,
    callback: LoadFileReferencesEventCallback,
  ): void;
}

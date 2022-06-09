import { Core } from '@minddrop/core';
import { ResourceApi } from '@minddrop/resources';
import {
  CreateRTDocumentData,
  RTDocument,
  RTDocumentMap,
  RTDocumentData,
  UpdateRTDocumentData,
} from './RTDocument.types';
import {
  CreateRTDocumentEvent,
  CreateRTDocumentEventCallback,
  DeleteRTDocumentEvent,
  DeleteRTDocumentEventCallback,
  LoadRTDocumentsEvent,
  LoadRTDocumentsEventCallback,
  PermanentlyDeleteRTDocumentEvent,
  PermanentlyDeleteRTDocumentEventCallback,
  RestoreRTDocumentEvent,
  RestoreRTDocumentEventCallback,
  UpdateRTDocumentEvent,
  UpdateRTDocumentEventCallback,
} from './RTEvents.types';

export interface RTDocumentsApi
  extends ResourceApi<
    RTDocumentData,
    CreateRTDocumentData,
    UpdateRTDocumentData,
    RTDocument
  > {
  /**
   * Retrieves a rich text document by ID.
   *
   * @param documentId - The ID of the document to retrieve.
   * @returns The requested document.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the rich text document does not exist.
   */
  get(documentId: string): RTDocument;

  /**
   * Retrieves multiple rich text documents by ID.
   *
   * @param documentIds - The IDs of the documents to retrieve.
   * @returns A `{ [id]: RichTextDocument }` map of the requested rich text documents.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if any of the rich text documents do not exist.
   */
  get(documentIds: string[]): RTDocumentMap;

  /**
   * Retrurns all rich text documents from the store as a
   * `{ [id]: RTDocument }` map.
   *
   * @returns A `{ [id]: RichTextDocument }` map of all rich text documents.
   */
  getAll(): RTDocumentMap;

  /**
   * Creates a new rich text document. Dispatches a
   * `rich-text:document:create' event.
   *
   * Returns the newly created document.
   *
   * @param core - A MindDrop core instance.
   * @param data - The document data.
   * @returns The newly created rich text document.
   *
   * @throws ResourceValidationError
   * Thrown if the data is invalid.
   */
  create(core: Core, data?: CreateRTDocumentData): RTDocument;

  /**
   * Soft-deletes a rich text document. Dispatches a
   * `rich-text:document:delete` event.
   *
   * Returns the updated document.
   *
   * Soft-deleted documents can be restored using the
   * `restore` method.
   *
   * @param core - A MindDrop core instance.
   * @param documentId - The ID of the document to delete.
   * @returns The deleted document.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the rich text document does not exist.
   */
  delete(core: Core, documentId: string): RTDocument;

  /**
   * Restores a deleted rich text document. Dispatches a
   * `rich-text:document:restore` event.
   *
   * Returns the restored document.
   *
   * @param core - A MindDrop core instance.
   * @param documentId - The ID of the rich text document to restore.
   * @returns The restored document.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the rich text document does not exist.
   */
  restore(core: Core, documentId: string): RTDocument;

  /**
   * Permanently deletes a rich text document. Dispatches a
   * `rich-text:document:delete-permanently` event.
   *
   * Returns the deleted document.
   *
   * @param core - A MindDrop core instance.
   * @param documentId - The ID of the docuemnt to permanently delete.
   * @returns The deleted document.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if the rich text document does not exist.
   */
  deletePermanently(core: Core, documentId: string): RTDocument;

  /**
   * Converts a rich text document to a plain text string.
   *
   * @param document The rich text document.
   * @returns The plain text.
   *
   * @throws ResourceDocumentNotFoundError
   * Thrown if any of the document's child rich text
   * elements do not exist.
   */
  toPlainText(document: RTDocument): string;

  /* ************************** */
  /* addEventListener overloads */
  /* ************************** */

  // Add 'rich-text:document:create' event listener
  addEventListener(
    core: Core,
    type: CreateRTDocumentEvent,
    callback: CreateRTDocumentEventCallback,
  ): void;

  // Add 'rich-text:document:update' event listener
  addEventListener(
    core: Core,
    type: UpdateRTDocumentEvent,
    callback: UpdateRTDocumentEventCallback,
  ): void;

  // Add 'rich-text:document:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteRTDocumentEvent,
    callback: DeleteRTDocumentEventCallback,
  ): void;

  // Add 'rich-text:document:restore' event listener
  addEventListener(
    core: Core,
    type: RestoreRTDocumentEvent,
    callback: RestoreRTDocumentEventCallback,
  ): void;

  // Add 'rich-text:document:delete-permanently' event listener
  addEventListener(
    core: Core,
    type: PermanentlyDeleteRTDocumentEvent,
    callback: PermanentlyDeleteRTDocumentEventCallback,
  ): void;

  // Add 'rich-text:document:load' event listener
  addEventListener(
    core: Core,
    type: LoadRTDocumentsEvent,
    callback: LoadRTDocumentsEventCallback,
  ): void;

  /* ***************************** */
  /* removeEventListener overloads */
  /* ***************************** */

  // Remove 'rich-text:document:create' event listener
  removeEventListener(
    core: Core,
    type: CreateRTDocumentEvent,
    callback: CreateRTDocumentEventCallback,
  ): void;

  // Remove 'rich-text:document:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateRTDocumentEvent,
    callback: UpdateRTDocumentEventCallback,
  ): void;

  // Remove 'rich-text:document:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteRTDocumentEvent,
    callback: DeleteRTDocumentEventCallback,
  ): void;

  // Remove 'rich-text:document:restore' event listener
  removeEventListener(
    core: Core,
    type: RestoreRTDocumentEvent,
    callback: RestoreRTDocumentEventCallback,
  ): void;

  // Remove 'rich-text:document:delete-permanently' event listener
  removeEventListener(
    core: Core,
    type: PermanentlyDeleteRTDocumentEvent,
    callback: PermanentlyDeleteRTDocumentEventCallback,
  ): void;

  // Remove 'rich-text:document:load' event listener
  removeEventListener(
    core: Core,
    type: LoadRTDocumentsEvent,
    callback: LoadRTDocumentsEventCallback,
  ): void;
}

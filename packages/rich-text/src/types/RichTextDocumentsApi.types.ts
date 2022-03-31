import { Core } from '@minddrop/core';
import {
  CreateRichTextDocumentData,
  RichTextDocument,
  RichTextDocumentMap,
} from './RichTextDocument.types';
import {
  CreateRichTextDocumentEvent,
  CreateRichTextDocumentEventCallback,
  DeleteRichTextDocumentEvent,
  DeleteRichTextDocumentEventCallback,
  PermanentlyDeleteRichTextDocumentEvent,
  PermanentlyDeleteRichTextDocumentEventCallback,
  RestoreRichTextDocumentEvent,
  RestoreRichTextDocumentEventCallback,
  UpdateRichTextDocumentEvent,
  UpdateRichTextDocumentEventCallback,
} from './RichTextEvents.types';

export interface RichTextDocumentsApi {
  /**
   * Retrieves rich text documents by ID. If provided a single ID string,
   * returns the matching rich text document. If provided an array of IDs,
   * returns a `{ [id]: RichTextDocument }` map of the corresponding rich
   * text documents.
   *
   * - Throws a `RichTextDocumentNotFoundError` if a requested document
   *   does not exist.
   *
   * @param documentId The ID(s) of the document(s) to retrieve.
   * @rturns The requested document or `{ [id]: RichTextDocument }` map of the requested rich text documents.
   */
  get(documentId: string | string[]): RichTextDocument | RichTextDocumentMap;

  /**
   * Retrurns all rich text documents from the store as a
   * `{ [id]: RichTextDocument }` map.
   */
  getAll(): RichTextDocumentMap;

  /**
   * Creates a new rich text document and dispatches a
   * `rich-text-documents:create' event. Returns the newly created document.
   *
   * Adds the document as a parent on all rich text block elements listen in
   * `children`.
   *
   * - Throws a `RichTextElementTypeNotRegistered` error if any of the child
   *   element types are not registered.
   * - Throws a `RichTextElementNotFoundError` if any of the children do not
   *   exist.
   * - Throws a `RichTextDocumentValidationError` if any of the children are
   *   not block level rich text elements.
   *
   * @param core A MindDrop core instance.
   * @param data The document data.
   * @returns The newly created document.
   */
  create(core: Core, data?: CreateRichTextDocumentData): RichTextDocument;

  /**
   * Deletes a rich text document and dispatches a
   * `rich-text-documents:delete` event. Returns the updated
   * document.
   *
   * @param core A MindDrop core instance.
   * @param documentId The ID of the document to delete.
   * @returns The updated document.
   */
  delete(core: Core, documentId: string): RichTextDocument;

  /**
   * Restores a deleted rich text document and dispatches a
   * `rich-text-documents:restore` event. Returns the restored
   * document.
   *
   * @param core A MindDrop core instance.
   * @param documentId The ID of the rich text document to restore.
   * @returns The restored document.
   */
  restore(core: Core, documentId: string): RichTextDocument;

  /**
   * Permanently deletes a rich text document and dispatches a
   * `rich-text-documents:delete-permanently` event. Returns the
   * deleted document.
   *
   * - Throws a `RichTextDocumentNotFoundError` if the document
   *   does not exist.
   *
   * @param core A MindDrop core instance.
   * @param documentId The ID of the docuemnt to permanently delete.
   * @returns The deleted docuemnt.
   */
  deletePermanently(core: Core, documentId: string): RichTextDocument;

  /**
   * Converts a rich text document to a plain text string.
   * Void documentsare converted using their toPlainText method.
   * If they do not have such a method, they are omited.
   *
   * - Throws a RichTextDocumentNotFoundError if any of the
   *   document's rich text documents do no exist.
   *
   * @param document The rich text document.
   * @returns The plain text.
   */
  toPlainText(document: RichTextDocument): string;

  /* ************************** */
  /* addEventListener overloads */
  /* ************************** */

  // Add 'rich-text-documents:create' event listener
  addEventListener(
    core: Core,
    type: CreateRichTextDocumentEvent,
    callback: CreateRichTextDocumentEventCallback,
  ): void;

  // Add 'rich-text-documents:update' event listener
  addEventListener(
    core: Core,
    type: UpdateRichTextDocumentEvent,
    callback: UpdateRichTextDocumentEventCallback,
  ): void;

  // Add 'rich-text-documents:delete' event listener
  addEventListener(
    core: Core,
    type: DeleteRichTextDocumentEvent,
    callback: DeleteRichTextDocumentEventCallback,
  ): void;

  // Add 'rich-text-documents:restore' event listener
  addEventListener(
    core: Core,
    type: RestoreRichTextDocumentEvent,
    callback: RestoreRichTextDocumentEventCallback,
  ): void;

  // Add 'rich-text-documents:delete-permanently' event listener
  addEventListener(
    core: Core,
    type: PermanentlyDeleteRichTextDocumentEvent,
    callback: PermanentlyDeleteRichTextDocumentEventCallback,
  ): void;

  /* ***************************** */
  /* removeEventListener overloads */
  /* ***************************** */

  // Remove 'rich-text-documents:create' event listener
  removeEventListener(
    core: Core,
    type: CreateRichTextDocumentEvent,
    callback: CreateRichTextDocumentEventCallback,
  ): void;

  // Remove 'rich-text-documents:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateRichTextDocumentEvent,
    callback: UpdateRichTextDocumentEventCallback,
  ): void;

  // Remove 'rich-text-documents:delete' event listener
  removeEventListener(
    core: Core,
    type: DeleteRichTextDocumentEvent,
    callback: DeleteRichTextDocumentEventCallback,
  ): void;

  // Remove 'rich-text-documents:restore' event listener
  removeEventListener(
    core: Core,
    type: RestoreRichTextDocumentEvent,
    callback: RestoreRichTextDocumentEventCallback,
  ): void;

  // Remove 'rich-text-documents:delete-permanently' event listener
  removeEventListener(
    core: Core,
    type: PermanentlyDeleteRichTextDocumentEvent,
    callback: PermanentlyDeleteRichTextDocumentEventCallback,
  ): void;
}

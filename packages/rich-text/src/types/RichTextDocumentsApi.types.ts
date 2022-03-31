import { Core } from '@minddrop/core';
import {
  CreateRichTextDocumentData,
  RichTextDocument,
  RichTextDocumentMap,
} from './RichTextDocument.types';
import {
  CreateRichTextDocumentEvent,
  CreateRichTextDocumentEventCallback,
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

  // Remove 'rich-text-documents:update' event listener
  removeEventListener(
    core: Core,
    type: UpdateRichTextDocumentEvent,
    callback: UpdateRichTextDocumentEventCallback,
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
}

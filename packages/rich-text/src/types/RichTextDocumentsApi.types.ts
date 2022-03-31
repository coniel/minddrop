import { Core, ParentReference } from '@minddrop/core';
import {
  CreateRichTextDocumentData,
  RichTextDocument,
  RichTextDocumentMap,
} from './RichTextDocument.types';
import {
  AddParentsToRichTextDocumentEvent,
  AddParentsToRichTextDocumentEventCallback,
  CreateRichTextDocumentEvent,
  CreateRichTextDocumentEventCallback,
  DeleteRichTextDocumentEvent,
  DeleteRichTextDocumentEventCallback,
  PermanentlyDeleteRichTextDocumentEvent,
  PermanentlyDeleteRichTextDocumentEventCallback,
  RemoveParentsFromRichTextDocumentEvent,
  RemoveParentsFromRichTextDocumentEventCallback,
  RestoreRichTextDocumentEvent,
  RestoreRichTextDocumentEventCallback,
  SetChildrenInRichTextDocumentEvent,
  SetChildrenInRichTextDocumentEventCallback,
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
   * Sets the child elements of a rich text document and dispatches a
   * `rich-text-documents:set-children` event. Returns the updated document.
   *
   * Adds the document as a parent on any added child elements and removes
   * the document as a parent from any removed child elements.
   *
   * - Throws a `RichTextDocumentNotFoundError` if the rich text document does
   *   not exist.
   * - Throws a `RichTextElementNotFoundError` if any of the rich text block
   * - elements do not exist.
   * - Throws a `RichTextDocumentValidationError` if any of the added elements
   * - are not block level elements.
   *
   * @param core A MindDrop core instance.
   * @param documentId The ID of the document in which to set the children.
   * @param children The IDs of the document's children.
   * @returns The updated document.
   */
  setChildren(
    core: Core,
    documentId: string,
    children: string[],
  ): RichTextDocument;

  /**
   * Adds parent references to a rich text document and dispatches a
   * `rich-text-documents:add-parents` event. Returns the updated
   * document.
   *
   * - Throws a `RichTextDocumentNotFound` error if the document does
   *   not exist.
   * - Throws a `ParentReferenceValidationError` if any of the parent
   *   references are invalid.
   *
   * @param core A MindDrop core instance.
   * @param documentId The ID of the document to which to add the parents.
   * @param parents The references of the parents to add.
   * @returns The updated rich text document.
   */
  addParents(
    core: Core,
    documentId: string,
    parents: ParentReference[],
  ): RichTextDocument;

  /**
   * Removes parent references from a rich text document and dispatches
   * a `rich-text-documents:remove-parents` event.
   *
   * - Throws a `RichTextDocumentNotFoundError` if the rich text document
   *   does not exist.
   *
   * @param core A MindDrop core instance.
   * @param documentId The ID of the document from which to remove the parents.
   * @param parents The parent references to remove from the document.
   * @returns The updated document.
   */
  removeParents(
    core: Core,
    documentId: string,
    parents: ParentReference[],
  ): RichTextDocument;

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

  // Add 'rich-text-documents:set-children' event listener
  addEventListener(
    core: Core,
    type: SetChildrenInRichTextDocumentEvent,
    callback: SetChildrenInRichTextDocumentEventCallback,
  ): void;

  // Add 'rich-text-documents:add-parents' event listener
  addEventListener(
    core: Core,
    type: AddParentsToRichTextDocumentEvent,
    callback: AddParentsToRichTextDocumentEventCallback,
  ): void;

  // Add 'rich-text-documents:remove-parents' event listener
  addEventListener(
    core: Core,
    type: RemoveParentsFromRichTextDocumentEvent,
    callback: RemoveParentsFromRichTextDocumentEventCallback,
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

  // Remove 'rich-text-documents:set-children' event listener
  removeEventListener(
    core: Core,
    type: SetChildrenInRichTextDocumentEvent,
    callback: SetChildrenInRichTextDocumentEventCallback,
  ): void;

  // Remove 'rich-text-documents:add-parents' event listener
  removeEventListener(
    core: Core,
    type: AddParentsToRichTextDocumentEvent,
    callback: AddParentsToRichTextDocumentEventCallback,
  ): void;

  // Remove 'rich-text-documents:remove-parents' event listener
  removeEventListener(
    core: Core,
    type: RemoveParentsFromRichTextDocumentEvent,
    callback: RemoveParentsFromRichTextDocumentEventCallback,
  ): void;
}

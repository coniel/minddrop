import { ParentReference } from '@minddrop/core';

export interface RichTextDocument {
  /**
   * The document ID.
   */
  id: string;

  /**
   * A UUID used to track different versions of the document.
   */
  revision: string;

  /**
   * References of the document's parents.
   */
  parents: ParentReference[];

  /**
   * Timestamp at which the document was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the document was last updated. Equal to
   * the `createdAt` value if the document has not been updated.
   */
  updatedAt: Date;

  /**
   * The IDs of the `RichTextElement`s which make up the content
   * of the document.
   */
  children: string[];

  /**
   * When `true`, the rich text document is deleted. Not present
   * if the document is not deleted.
   */
  deleted?: boolean;

  /**
   * Timestamp at which the rich text document was deleted. Not
   * present if the document is not deleted.
   */
  deletedAt?: Date;
}

/**
 * A { [id]: RichTextDocument } map of rich text documents.
 */
export type RichTextDocumentMap = Record<string, RichTextDocument>;

/**
 * Data supplied when creating a new rich text document.
 */
export interface CreateRichTextDocumentData {
  /**
   * A UUID used to track different versions of the document.
   */
  revision?: string;

  /**
   * The IDs of the `RichTextElement`s which make up the content
   * of the document.
   */
  children?: string[];
}

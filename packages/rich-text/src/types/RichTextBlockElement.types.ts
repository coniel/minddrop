import { ParentReference } from '@minddrop/core';
import { RichTextNode } from './RichTextNode.types';
import { RichTextInlineElement } from './RichTextInlineElement.types';

export interface RichTextBlockElement {
  /**
   * The element ID.
   */
  id: string;

  /**
   * The element type identifier, e.g. 'paragraph'.
   */
  type: string;

  /**
   * References of the element's parents (typically a
   * `RichTextDocument`).
   */
  parents: ParentReference[];

  /**
   * An array of `RichText` nodes and inline `RichTextElement`s,
   * which make up the element's rich text content.
   */
  children?: (RichTextNode | RichTextInlineElement)[];

  /**
   * The IDs of nested block level `RichTextElements`. Only present
   * on block level elements which support nesting.
   */
  nestedElements?: string[];

  /**
   * The IDs of the element's files.All files attached
   * to the element must be listed here.
   */
  files?: string[];

  /**
   * When `true`, the element is deleted. Not present if
   * the element is not deleted.
   */
  deleted?: boolean;

  /**
   * Timestamp at which the element was deleted. Not
   * present if the element is not deleted.
   */
  deletedAt?: Date;
}

export interface CreateRichTextBlockElementData {
  /**
   * The rich text content of the element.
   */
  children?: (RichTextNode | RichTextInlineElement)[];

  /**
   * The IDs of nested block level `RichTextElements`.
   */
  nestedElements?: string[];

  /**
   * The IDs of the element's files. All files attached
   * to the element must be listed here.
   */
  files?: string[];
}

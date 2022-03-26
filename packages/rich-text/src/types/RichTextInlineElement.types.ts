import { ParentReference } from '@minddrop/core';
import { RichText } from './RichText.types';

export interface RichTextInlineElement {
  /**
   * The element ID.
   */
  id: string;

  /**
   * The element type identifier, e.g. 'link'.
   */
  type: string;

  /**
   * References of the element's parents (typically a
   * `RichTextBlockElement` and a `RichTextDocument`).
   */
  parents: ParentReference[];

  /**
   * An array of `RichText` nodes and inline `RichTextElement`s,
   * which make up the element's rich text content.
   */
  children?: (RichText | RichTextInlineElement)[];

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

export interface CreateRichTextInlineElementData {
  /**
   * The element type identifier, e.g. 'paragraph'.
   */
  type: string;

  /**
   * The rich text content of the element.
   */
  children?: (RichText | RichTextInlineElement)[];

  /**
   * The IDs of the element's files. All files attached
   * to the element must be listed here.
   */
  files?: string[];
}

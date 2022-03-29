import { ParentReference } from '@minddrop/core';
import {
  FieldValueArrayFilter,
  FieldValueArrayRemove,
  FieldValueArrayUnion,
  FieldValueDelete,
} from '@minddrop/utils';
import { RichTextFragment } from './RichTextFragment.types';

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
  children?: RichTextFragment;

  /**
   * The IDs of the element's files.All files attached
   * to the element must be listed here.
   */
  files?: string[];

  /**
   * When `true`, the element is deleted. Not present if
   * the element is not deleted.
   */
  deleted?: true;

  /**
   * Timestamp at which the element was deleted. Not
   * present if the element is not deleted.
   */
  deletedAt?: Date;
}

/**
 * Data supplied when creating an inline rich text element via the API.
 */
export interface CreateRichTextInlineElementData {
  /**
   * The element type identifier, e.g. 'link'.
   */
  type: string;

  /**
   * The rich text content of the element.
   */
  children?: RichTextFragment;

  /**
   * The IDs of the element's files. All files attached
   * to the element must be listed here.
   */
  files?: string[];
}

/**
 * Data supplied when updating an inline rich text element via the API.
 */
export interface UpdateRichTextInlineElementData {
  /**
   * The rich text content of the element.
   */
  children?: RichTextFragment | FieldValueArrayUnion | FieldValueArrayFilter;
}

/**
 * Changes that can be applied to an inline rich text element's fields.
 */
export interface RichTextInlineElementChanges {
  /**
   * References of the element's parents (typically a
   * `RichTextBlockElement` and a `RichTextDocument`).
   */
  parents?: ParentReference[] | FieldValueArrayUnion | FieldValueArrayFilter;

  /**
   * An array of `RichText` nodes and inline `RichTextElement`s,
   * which make up the element's rich text content.
   */
  children?: RichTextFragment | FieldValueArrayUnion | FieldValueArrayFilter;

  /**
   * The IDs of the element's files.All files attached
   * to the element must be listed here.
   */
  files?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;

  /**
   * When `true`, the element is deleted. Not present if
   * the element is not deleted.
   */
  deleted?: true | FieldValueDelete;

  /**
   * Timestamp at which the element was deleted. Not
   * present if the element is not deleted.
   */
  deletedAt?: Date | FieldValueDelete;
}

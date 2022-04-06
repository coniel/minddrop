import { ParentReference } from '@minddrop/core';
import {
  FieldValueArrayFilter,
  FieldValueArrayRemove,
  FieldValueArrayUnion,
  FieldValueDelete,
} from '@minddrop/utils';
import { RichTextFragment } from './RichTextFragment.types';

export interface RichTextBlockElement<TType = string> {
  /**
   * The element ID.
   */
  id: string;

  /**
   * The element type identifier, e.g. 'paragraph'.
   */
  type: TType;

  /**
   * References of the element's parents (typically a
   * `RichTextDocument`).
   */
  parents: ParentReference[];

  /**
   * An array of `RichText` nodes and inline `RichTextElement`s,
   * which make up the element's rich text content.
   */
  children?: RichTextFragment;

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
  deleted?: true;

  /**
   * Timestamp at which the element was deleted. Not
   * present if the element is not deleted.
   */
  deletedAt?: Date;
}

/**
 * Data supplied when creating a rich text block element via the API.
 */
export interface CreateRichTextBlockElementData<TType = string> {
  /**
   * The element type identifier, e.g. 'link'.
   */
  type: TType;

  /**
   * The rich text content of the element.
   */
  children?: RichTextFragment;

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

/**
 * Changes that can be applied to a rich text block element's fields.
 */
export interface RichTextBlockElementChanges {
  /**
   * The element type identifier, e.g. 'paragraph'.
   */
  type?: string;

  /**
   * References of the element's parents (typically a
   * `RichTextDocument`).
   */
  parents?: ParentReference[] | FieldValueArrayUnion | FieldValueArrayFilter;

  /**
   * An array of `RichText` nodes and inline `RichTextElement`s,
   * which make up the element's rich text content.
   */
  children?: RichTextFragment | FieldValueArrayUnion | FieldValueArrayFilter;

  /**
   * The IDs of nested block level `RichTextElements`. Only present
   * on block level elements which support nesting.
   */
  nestedElements?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;

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

/**
 * Data supplied when updating a rich text block element via the API.
 */
export type UpdateRichTextBlockElementData = RichTextBlockElementChanges;

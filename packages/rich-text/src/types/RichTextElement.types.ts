import {
  CreateRichTextBlockElementData,
  UpdateRichTextBlockElementData,
  RichTextBlockElement,
  RichTextBlockElementChanges,
} from './RichTextBlockElement.types';
import {
  CreateRichTextInlineElementData,
  RichTextInlineElement,
  RichTextInlineElementChanges,
  UpdateRichTextInlineElementData,
} from './RichTextInlineElement.types';

export type RichTextElement = RichTextBlockElement | RichTextInlineElement;

/**
 * A { [id]: RichTextElement } map of rich text elements.
 */
export type RichTextElementMap<T extends RichTextElement = RichTextElement> =
  Record<string, T>;

/**
 * Data supplied when creating a rich text element via the API.
 */
export type CreateRichTextElementData =
  | CreateRichTextBlockElementData
  | CreateRichTextInlineElementData;

/**
 * Data supplied when updating a rich text element via the API.
 */
export type UpdateRichTextElementData =
  | UpdateRichTextBlockElementData
  | UpdateRichTextInlineElementData;

/**
 * Changes that can be applied to a rich text element's fields.
 */
export type RichTextElementChanges =
  | RichTextBlockElementChanges
  | RichTextInlineElementChanges;

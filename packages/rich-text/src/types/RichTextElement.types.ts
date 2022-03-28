import {
  CreateRichTextBlockElementData,
  RichTextBlockElement,
} from './RichTextBlockElement.types';
import {
  CreateRichTextInlineElementData,
  RichTextInlineElement,
} from './RichTextInlineElement.types';

export type RichTextElement = RichTextBlockElement | RichTextInlineElement;

/**
 * A { [id]: RichTextElement } map of rich text elements.
 */
export type RichTextElementMap<T extends RichTextElement = RichTextElement> =
  Record<string, T>;

export type CreateRichTextElementData =
  | CreateRichTextBlockElementData
  | CreateRichTextInlineElementData;

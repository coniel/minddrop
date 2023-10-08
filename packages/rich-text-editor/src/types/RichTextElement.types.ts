import {
  RichTextBlockElement,
  RichTextBlockElementProps,
} from './RichTextBlockElement.types';
import {
  RichTextInlineElement,
  RichTextInlineElementProps,
} from './RichTextInlineElement.types';

export type RichTextElement = RichTextBlockElement | RichTextInlineElement;

export type RichTextElementProps =
  | RichTextBlockElementProps<any>
  | RichTextInlineElementProps<any>;

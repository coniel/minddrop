import { RichTextBlockElementConfig } from './RichTextBlockElementConfig.types';
import {
  CreateRichTextElementData,
  RichTextElement,
} from './RichTextElement.types';
import { RichTextInlineElementConfig } from './RichTextInlineElementConfig.types';

export type RichTextElementConfig<
  TElement extends RichTextElement = RichTextElement,
  TData extends CreateRichTextElementData = CreateRichTextElementData,
> =
  | RichTextBlockElementConfig<TElement, TData>
  | RichTextInlineElementConfig<TElement, TData>;

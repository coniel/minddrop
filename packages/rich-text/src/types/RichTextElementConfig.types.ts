import { RichTextBlockElementConfig } from './RichTextBlockElementConfig.types';
import { RichTextElement } from './RichTextElement.types';
import { RichTextInlineElementConfig } from './RichTextInlineElementConfig.types';

export type RichTextElementConfig<
  TElement extends RichTextElement = RichTextElement,
  TData = {},
> =
  | RichTextBlockElementConfig<TElement, TData>
  | RichTextInlineElementConfig<TElement, TData>;

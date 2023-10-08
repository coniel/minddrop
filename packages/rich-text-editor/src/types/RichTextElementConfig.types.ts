import { RichTextInlineElementConfig } from './RichTextInlineElementConfig.types';
import { RichTextBlockElementConfig } from './RichTextBlockElementConfig.types';
import { RichTextBlockElementTypeData } from './RichTextBlockElement.types';
import { RichTextInlineElementTypeData } from './RichTextInlineElement.types';

export type RichTextElementConfig<
  TData extends
    | RichTextBlockElementTypeData
    | RichTextInlineElementTypeData = {},
> = RichTextInlineElementConfig<TData> | RichTextBlockElementConfig<TData>;

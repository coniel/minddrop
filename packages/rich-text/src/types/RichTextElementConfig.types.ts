import { RichTextBlockElementConfig } from './RichTextBlockElementConfig.types';
import { RichTextInlineElementConfig } from './RichTextInlineElementConfig.types';

export type RichTextElementConfig =
  | RichTextBlockElementConfig
  | RichTextInlineElementConfig;

import { RichTextBlockElementConfig } from '@minddrop/rich-text';
import { ParagraphElementComponent } from './ParagraphElementComponent';

export const ParagraphElementConfig: RichTextBlockElementConfig = {
  type: 'paragraph',
  level: 'block',
  allowConversion: true,
  component: ParagraphElementComponent,
};

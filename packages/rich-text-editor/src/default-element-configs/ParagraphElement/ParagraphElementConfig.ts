import { RichTextBlockElementConfig } from '../../types';
import { ParagraphElementComponent } from './ParagraphElementComponent';

export const ParagraphElementConfig: RichTextBlockElementConfig = {
  type: 'paragraph',
  level: 'block',
  component: ParagraphElementComponent,
};

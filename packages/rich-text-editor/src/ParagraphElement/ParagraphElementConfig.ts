import { RTBlockElementConfig } from '@minddrop/rich-text';
import { ParagraphElementComponent } from './ParagraphElementComponent';

export const ParagraphElementConfig: RTBlockElementConfig = {
  type: 'paragraph',
  level: 'block',
  component: ParagraphElementComponent,
};

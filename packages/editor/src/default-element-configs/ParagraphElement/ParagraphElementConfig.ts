import { EditorBlockElementConfig } from '../../types';
import { ParagraphElementComponent } from './ParagraphElementComponent';

export const ParagraphElementConfig: EditorBlockElementConfig = {
  type: 'paragraph',
  display: 'block',
  component: ParagraphElementComponent,
};

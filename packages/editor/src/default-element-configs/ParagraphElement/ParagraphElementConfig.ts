import { EditorBlockElementConfig } from '../../types';
import { ParagraphElementComponent } from './ParagraphElementComponent';

export const ParagraphElementConfig: EditorBlockElementConfig = {
  type: 'paragraph',
  component: ParagraphElementComponent,
  menuItems: [
    {
      label: 'editor.elements.paragraph.name',
      icon: 'align-left',
    },
  ],
};

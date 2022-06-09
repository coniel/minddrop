import { RTBlockElementConfig } from '@minddrop/rich-text';
import { ParagraphElementComponent } from './ParagraphElementComponent';

export const ParagraphElementConfig: RTBlockElementConfig = {
  type: 'paragraph',
  level: 'block',
  dataTypes: ['text/plain'],
  component: ParagraphElementComponent,
  initializeData: ({ data }) => ({
    children: [{ text: data['text/plain'] ? data['text/plain'].trim() : '' }],
  }),
};

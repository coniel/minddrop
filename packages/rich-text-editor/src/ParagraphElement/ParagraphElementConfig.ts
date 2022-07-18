import { RTBlockElementConfig } from '@minddrop/rich-text';
import { ParagraphElementComponent } from './ParagraphElementComponent';

export const ParagraphElementConfig: RTBlockElementConfig = {
  type: 'paragraph',
  level: 'block',
  dataTypes: ['text/plain'],
  component: ParagraphElementComponent,
  initializeData: (dataInsert) => ({
    children: [
      {
        text:
          dataInsert && dataInsert.types.includes('text/plain')
            ? dataInsert.data['text/plain'].trim()
            : '',
      },
    ],
  }),
};

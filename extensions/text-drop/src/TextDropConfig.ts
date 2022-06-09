import { DropTypeConfig } from '@minddrop/drops';
import { TextDropData } from './types';
import { TextDropComponent } from './TextDropComponent';
import { initializeTextDropData } from './initializeTextDropData';

export const TextDropConfig: DropTypeConfig<TextDropData> = {
  type: 'text',
  component: TextDropComponent,
  name: 'Text',
  description: 'A rich text drop',
  dataTypes: ['text/plain'],
  initializeData: initializeTextDropData,
  dataSchema: {
    richTextDocument: {
      type: 'resource-id',
      resource: 'rich-text:document',
    },
  },
};

import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { Resources } from '@minddrop/resources';
import { TextDrop } from '../types';

const {
  richTextDocument1,
  richTextDocument2,
  richTextDocument3,
  richTextDocument4,
} = RICH_TEXT_TEST_DATA;

export const textDrop1: TextDrop = Resources.generateDocument('drops:drop', {
  type: 'text',
  richTextDocument: richTextDocument1.id,
});

export const textDrop2: TextDrop = Resources.generateDocument('drops:drop', {
  type: 'text',
  richTextDocument: richTextDocument2.id,
});

export const textDrop3: TextDrop = Resources.generateDocument('drops:drop', {
  type: 'text',
  richTextDocument: richTextDocument3.id,
});

export const textDrop4: TextDrop = Resources.generateDocument('drops:drop', {
  type: 'text',
  richTextDocument: richTextDocument4.id,
});

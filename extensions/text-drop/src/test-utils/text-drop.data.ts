import { generateDrop } from '@minddrop/drops';
import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { TextDrop } from '../types';

const {
  richTextDocument1,
  richTextDocument2,
  richTextDocument3,
  richTextDocument4,
} = RICH_TEXT_TEST_DATA;

export const textDrop1: TextDrop = generateDrop({
  type: 'text',
  richTextDocument: richTextDocument1.id,
});

export const textDrop2: TextDrop = generateDrop({
  type: 'text',
  richTextDocument: richTextDocument2.id,
});

export const textDrop3: TextDrop = generateDrop({
  type: 'text',
  richTextDocument: richTextDocument3.id,
});

export const textDrop4: TextDrop = generateDrop({
  type: 'text',
  richTextDocument: richTextDocument4.id,
});

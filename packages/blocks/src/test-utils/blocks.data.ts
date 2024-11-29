import { Block } from '../types';

export const textBlock: Block = {
  id: 'block-1',
  created: new Date(),
  lastModified: new Date(),
  type: 'text',
  title: 'Block 1',
  text: 'Block 1 text',
};

export const fileBlock: Block = {
  id: 'block-2',
  created: new Date(),
  lastModified: new Date(),
  type: 'image',
  title: 'Block 2',
  file: 'image.jpg',
};

export const bookmarkBlock: Block = {
  id: 'block-3',
  type: 'web-bookmark',
  created: new Date(),
  lastModified: new Date(),
  title: 'Website title',
  url: 'https://example.com',
  description: 'Website description',
  icon: 'website-icon.png',
  image: 'website-image.jpg',
};

export const block1 = textBlock;
export const block2 = fileBlock;
export const block3 = bookmarkBlock;

export const blocks = [textBlock, fileBlock, bookmarkBlock];

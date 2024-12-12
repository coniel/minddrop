import { BlocksStore } from '../BlocksStore';
import {
  Block,
  BlockTemplate,
  BlockType,
  BlockVariant,
  TextBlockClassifier,
} from '../types';

export type TextTextBlockData = { foo?: string; bar?: string };
export type TestTextBlock = Block & TextTextBlockData;

export const textBlockConfig: BlockType<TextTextBlockData> = {
  id: 'text',
  defaultVariant: 'editor',
  icon: 'text',
  description: {
    'en-US': {
      name: 'Text',
      details: 'A block of text.',
    },
  },
  initialProperties: {
    foo: 'foo',
  },
  onCreate: async (block) => {
    setTimeout(() => {
      BlocksStore.getState().update(block.id, { bar: 'bar' });
    }, 1000);
  },
};

export const textBlockVariantConfig: BlockVariant = {
  blockType: 'text',
  id: 'editor',
  component: () => null,
  description: {
    'en-US': {
      name: 'Editor',
    },
  },
};

export const textBlockClassifier: TextBlockClassifier = {
  id: 'text-classifier',
  blockType: 'text',
  match: () => true,
  initializeData: (text: string) => ({ text }),
};

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

export const textBlockTemplate: BlockTemplate = {
  type: 'text',
  variant: 'editor',
  text: '',
};

export const fileBlockTemplate: BlockTemplate = {
  type: 'file',
};

export const block1 = textBlock;
export const block2 = fileBlock;
export const block3 = bookmarkBlock;

export const blockTemplate1 = textBlockTemplate;
export const blockTemplate2 = fileBlockTemplate;

export const blocks = [textBlock, fileBlock, bookmarkBlock];

export const blocksObject = blocks.reduce(
  (docs, block) => ({
    ...docs,
    [block.id]: block,
  }),
  {},
);

import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { classifyFileBlock } from './classifyFileBlock';
import { registerFileBlockClassifier } from '../BlockClassifiersStore';

const file = { name: 'image.jpg' } as unknown as File;

describe('classifyBlock', () => {
  beforeEach(() => {
    setup();

    // Register some classifiers
    registerFileBlockClassifier({
      id: 'image-png',
      blockType: 'image-png',
      fileTypes: ['png'],
    });
    registerFileBlockClassifier({
      id: 'image-jpg',
      blockType: 'image-jpg',
      fileTypes: ['jpg', 'jpeg'],
      initializeData: (file) => ({ file: file.name }),
    });
    registerFileBlockClassifier({
      id: 'image-gif',
      blockType: 'image-gif',
      fileTypes: ['gif'],
    });
  });

  afterEach(cleanup);

  it('classifies a block using match before file types', () => {
    registerFileBlockClassifier({
      id: 'match',
      blockType: 'match',
      match: (file) => file.name.endsWith('.jpg'),
    });

    const result = classifyFileBlock(file);

    expect(result?.type).toBe('match');
  });

  it('classifies a block using file types array', () => {
    const result = classifyFileBlock(file);

    expect(result?.type).toBe('image-jpg');
  });

  it('initializes the block properties', () => {
    const result = classifyFileBlock(file);

    expect(result?.file).toEqual('image.jpg');
  });

  it('returns undefined if no match', () => {
    const type = classifyFileBlock({ name: 'file.txt' } as unknown as File);

    expect(type).not.toBeDefined();
  });
});

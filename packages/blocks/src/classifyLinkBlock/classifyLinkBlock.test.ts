import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { classifyLinkBlock } from './classifyLinkBlock';
import { registerLinkBlockClassifier } from '../BlockClassifiersStore';

const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

describe('classifyBlock', () => {
  beforeEach(() => {
    setup();

    registerLinkBlockClassifier({
      id: 'youtube',
      blockType: 'youtube',
      patterns: ['*.youtube.com/watch*'],
      initializeData: (url) => ({
        url,
      }),
    });
  });

  afterEach(cleanup);

  it('classifies a block using match before patterns', () => {
    registerLinkBlockClassifier({
      id: 'match',
      blockType: 'match',
      match: (value) => value === url,
    });

    const result = classifyLinkBlock(url);

    expect(result?.type).toBe('match');
  });

  it('classifies a block using patterns', () => {
    const result = classifyLinkBlock(url);

    expect(result?.type).toBe('youtube');
  });

  it('initializes the block properties', () => {
    const result = classifyLinkBlock(url);

    expect(result?.url).toEqual(url);
  });

  it('returns undefined if no match', () => {
    const result = classifyLinkBlock('https://minddrop.app');

    expect(result).not.toBeDefined();
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerTextBlockClassifier } from '../BlockClassifiersStore';
import { cleanup, setup } from '../test-utils';
import { classifyTextBlock } from './classifyTextBlock';

const mathText = '$$\n1 + 1 = 2\n$$';

describe('classifyBlock', () => {
  beforeEach(() => {
    setup();

    registerTextBlockClassifier({
      id: 'math',
      blockType: 'math',
      match: (text) => text.startsWith('$$') && text.endsWith('$$'),
      initializeData: (text) => ({ text }),
    });
  });

  afterEach(cleanup);

  it('classifies a block using match', () => {
    const result = classifyTextBlock(mathText);

    expect(result?.type).toBe('math');
  });

  it('initializes the block properties', () => {
    const result = classifyTextBlock(mathText);

    expect(result?.text).toEqual(mathText);
  });

  it('returns undefined if no match', () => {
    const result = classifyTextBlock('foo bar');

    expect(result).not.toBeDefined();
  });
});

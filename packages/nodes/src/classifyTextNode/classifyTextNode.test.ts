import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { classifyTextNode } from './classifyTextNode';
import { registerNodeClassifierConfig } from '../NodeClassifierConfigsStore';
import { TextNode } from '../types';

const mathNode: TextNode = {
  type: 'text',
  layout: 'text',
  id: 'id-1',
  text: '$$\n1 + 1 = 2\n$$',
};

const textNode: TextNode = {
  type: 'text',
  layout: 'text',
  id: 'id-2',
  text: 'Hello, world!',
};

describe('classifyNode', () => {
  beforeEach(() => {
    setup();

    // Register a classifier
    registerNodeClassifierConfig({
      id: 'math',
      nodeType: 'text',
      layout: 'math',
      callback: (node) =>
        node.text.startsWith('$$') && node.text.endsWith('$$'),
    });
  });

  afterEach(cleanup);

  it('classifies a node', () => {
    const layout = classifyTextNode(mathNode);

    expect(layout).toBe('math');
  });

  it('falls back to the default layout', () => {
    const layout = classifyTextNode(textNode);

    expect(layout).toBe('text');
  });
});

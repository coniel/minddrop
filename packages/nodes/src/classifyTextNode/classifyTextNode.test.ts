import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { classifyTextNode } from './classifyTextNode';
import { registerNodeClassifierConfig } from '../NodeClassifierConfigsStore';
import { TextNode } from '../types';

const mathNode: TextNode = {
  type: 'text',
  display: 'text',
  id: 'id-1',
  text: '$$\n1 + 1 = 2\n$$',
};

const textNode: TextNode = {
  type: 'text',
  display: 'text',
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
      display: 'math',
      callback: (node) =>
        node.text.startsWith('$$') && node.text.endsWith('$$'),
    });
  });

  afterEach(cleanup);

  it('classifies a node', () => {
    const display = classifyTextNode(mathNode);

    expect(display).toBe('math');
  });

  it('falls back to the default display', () => {
    const display = classifyTextNode(textNode);

    expect(display).toBe('text');
  });
});

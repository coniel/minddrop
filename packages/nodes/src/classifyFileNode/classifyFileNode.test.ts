import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { classifyFileNode } from './classifyFileNode';
import { registerNodeClassifierConfig } from '../NodeClassifierConfigsStore';
import { FileNode } from '../types';

const imageNode: FileNode = {
  type: 'file',
  layout: 'file',
  id: 'id-1',
  file: 'image.jpg',
};

const textNode: FileNode = {
  type: 'file',
  layout: 'file',
  id: 'id-2',
  file: 'file.txt',
};

describe('classifyNode', () => {
  beforeEach(() => {
    setup();

    // Register some classifiers
    registerNodeClassifierConfig({
      id: 'image-png',
      nodeType: 'file',
      layout: 'image-png',
      fileTypes: ['png'],
    });
    registerNodeClassifierConfig({
      id: 'image-jpg',
      nodeType: 'file',
      layout: 'image-jpg',
      fileTypes: ['jpg', 'jpeg'],
    });
    registerNodeClassifierConfig({
      id: 'image-gif',
      nodeType: 'file',
      layout: 'image-gif',
      fileTypes: ['gif'],
    });
  });

  afterEach(cleanup);

  it('classifies a node', () => {
    const layout = classifyFileNode(imageNode);

    expect(layout).toBe('image-jpg');
  });

  it('falls back to the default layout', () => {
    const layout = classifyFileNode(textNode);

    expect(layout).toBe('file');
  });
});

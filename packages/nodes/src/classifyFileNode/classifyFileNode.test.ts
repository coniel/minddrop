import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { classifyFileNode } from './classifyFileNode';
import { registerNodeClassifierConfig } from '../NodeClassifierConfigsStore';
import { FileNode } from '../types';

const imageNode: FileNode = {
  type: 'file',
  display: 'file',
  id: 'id-1',
  file: 'image.jpg',
};

const textNode: FileNode = {
  type: 'file',
  display: 'file',
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
      display: 'image-png',
      fileTypes: ['png'],
    });
    registerNodeClassifierConfig({
      id: 'image-jpg',
      nodeType: 'file',
      display: 'image-jpg',
      fileTypes: ['jpg', 'jpeg'],
    });
    registerNodeClassifierConfig({
      id: 'image-gif',
      nodeType: 'file',
      display: 'image-gif',
      fileTypes: ['gif'],
    });
  });

  afterEach(cleanup);

  it('classifies a node', () => {
    const display = classifyFileNode(imageNode);

    expect(display).toBe('image-jpg');
  });

  it('falls back to the default display', () => {
    const display = classifyFileNode(textNode);

    expect(display).toBe('file');
  });
});

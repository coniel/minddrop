import { describe, it, expect, afterEach } from 'vitest';
import { textFile, createDataTransfer } from '@minddrop/test-utils';
import { generateNodesFromDataTransfer } from './generateNodesFromDataTransfer';
import { initializeMockFileSystem } from '@minddrop/file-system';

const parentPath = 'path/to/parent';

const MockFs = initializeMockFileSystem([parentPath]);

describe('generateNodesFromDataTransfer', () => {
  afterEach(() => {
    MockFs.reset();
  });

  it('generates file nodes from file data transfer', async () => {
    const dataTransfer = createDataTransfer({}, [textFile]);

    const nodes = await generateNodesFromDataTransfer(dataTransfer, parentPath);

    expect(nodes[0]).toEqual({
      type: 'file',
      id: expect.any(String),
      file: textFile.name,
      display: 'file',
    });
  });

  it('writes files to the file system', async () => {
    const dataTransfer = createDataTransfer({}, [textFile]);

    await generateNodesFromDataTransfer(dataTransfer, parentPath);

    expect(MockFs.exists(`${parentPath}/${textFile.name}`)).toBe(true);
  });

  it('generates link node from URL data transfer', async () => {
    const dataTransfer = createDataTransfer({
      'text/plain': 'https://example.com',
    });

    const nodes = await generateNodesFromDataTransfer(dataTransfer, parentPath);

    expect(nodes[0]).toEqual({
      type: 'link',
      id: expect.any(String),
      url: 'https://example.com',
      display: 'link',
    });
  });

  it('generates text node from plain text data transfer', async () => {
    const dataTransfer = createDataTransfer({
      'text/plain': 'Hello, world!',
    });

    const nodes = await generateNodesFromDataTransfer(dataTransfer, parentPath);

    expect(nodes[0]).toEqual({
      type: 'text',
      id: expect.any(String),
      text: 'Hello, world!',
      display: 'text',
    });
  });
});

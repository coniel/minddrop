import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  cleanup,
  createDataTransfer,
  textFile,
  weblocFile,
} from '@minddrop/test-utils';
import {
  registerFileBlockClassifier,
  registerLinkBlockClassifier,
  registerTextBlockClassifier,
} from '../BlockClassifiersStore';
import { registerBlockType } from '../BlockTypesStore';
import { BlockType } from '../types';
import { generateBlocksFromDataTransfer } from './generateBlocksFromDataTransfer';

const parentPath = 'path/to/parent';
const textFileContent = 'Hello, World!';
const text = '$$\n1 + 1 = 2\n$$';
const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

const MockFs = initializeMockFileSystem([parentPath]);

const textFileBlockConfig = { id: 'text-file' } as BlockType;
const youtubeBlockConfig = { id: 'youtube' } as BlockType;
const mathBlockConfig = { id: 'math' } as BlockType;

describe('generateBlocksFromDataTransfer', () => {
  beforeAll(() => {
    // Register block types
    registerBlockType(textFileBlockConfig);
    registerBlockType(youtubeBlockConfig);
    registerBlockType(mathBlockConfig);

    // Register block classifiers
    registerTextBlockClassifier({
      id: 'math',
      blockType: 'math',
      match: (text) => text.startsWith('$$') && text.endsWith('$$'),
      initializeData: () => ({ text, expression: '1 + 1 = 2' }),
    });

    registerLinkBlockClassifier({
      id: 'youtube',
      blockType: 'youtube',
      patterns: ['*.youtube.com/watch*'],
      initializeData: () => ({
        title: 'YouTube Video',
        url,
      }),
    });

    registerFileBlockClassifier({
      id: 'text-file',
      blockType: 'text-file',
      fileTypes: ['txt'],
      initializeData: () => ({ text: textFileContent }),
    });
  });

  afterEach(() => {
    MockFs.reset();
  });

  afterAll(cleanup);

  it('generates blocks from file data transfer', async () => {
    const dataTransfer = createDataTransfer({}, [textFile]);

    const blocks = await generateBlocksFromDataTransfer(
      dataTransfer,
      parentPath,
    );

    expect(blocks[0]).toEqual({
      type: 'text-file',
      id: expect.any(String),
      created: expect.any(Date),
      lastModified: expect.any(Date),
      file: textFile.name,
      text: textFileContent,
    });
  });

  it('writes files to the file system', async () => {
    const dataTransfer = createDataTransfer({}, [textFile]);

    await generateBlocksFromDataTransfer(dataTransfer, parentPath);

    expect(MockFs.exists(`${parentPath}/${textFile.name}`)).toBe(true);
  });

  it('ignores .webloc files', async () => {
    const dataTransfer = createDataTransfer({}, [weblocFile]);
    const blocks = await generateBlocksFromDataTransfer(
      dataTransfer,
      parentPath,
    );

    expect(blocks).toEqual([]);
  });

  it('generates block from text/uri-list', async () => {
    const dataTransfer = createDataTransfer(
      {
        'text/uri-list': url,
      },
      [weblocFile],
    );

    const blocks = await generateBlocksFromDataTransfer(
      dataTransfer,
      parentPath,
    );

    expect(blocks[0]).toEqual({
      type: 'youtube',
      id: expect.any(String),
      created: expect.any(Date),
      lastModified: expect.any(Date),
      url,
      title: 'YouTube Video',
    });
  });

  it('generates link block from plain text URL', async () => {
    const dataTransfer = createDataTransfer({
      'text/plain': url,
    });

    const blocks = await generateBlocksFromDataTransfer(
      dataTransfer,
      parentPath,
    );

    expect(blocks[0]).toEqual({
      type: 'youtube',
      url,
      id: expect.any(String),
      created: expect.any(Date),
      lastModified: expect.any(Date),
      title: 'YouTube Video',
    });
  });

  it('generates text block from plain text data transfer', async () => {
    const dataTransfer = createDataTransfer({
      'text/plain': text,
    });

    const blocks = await generateBlocksFromDataTransfer(
      dataTransfer,
      parentPath,
    );

    expect(blocks[0]).toEqual({
      type: 'math',
      id: expect.any(String),
      created: expect.any(Date),
      lastModified: expect.any(Date),
      text,
      expression: '1 + 1 = 2',
    });
  });
});

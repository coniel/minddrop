import { DataInsert, initializeCore } from '@minddrop/core';
import { imageFile, textFile } from '@minddrop/test-utils';
import { DropConfig } from '../types';
import { createFromDataInsert } from './createFromDataInsert';
import { generateDrop } from '../generateDrop';

const core = initializeCore({ appId: 'app', extensionId: 'drops' });

const textData: DataInsert = {
  types: ['text/plain', 'text/html'],
  data: {
    'text/plain': 'Hello world',
    'text/html': '<p>Hello world</p>',
  },
  files: [],
};

const filesData: DataInsert = {
  types: ['files'],
  data: {},
  files: [imageFile, textFile],
};

const multiTextFilesData: DataInsert = {
  types: ['files'],
  data: {},
  files: [textFile, textFile],
};

const textDropConfig: DropConfig = {
  type: 'text',
  name: 'Text',
  multiFile: true,
  description: 'A text drop',
  dataTypes: ['text/plain'],
  fileTypes: ['text/plain'],
  create: async () => generateDrop({ type: 'text' }),
};

const htmlDropConfig: DropConfig = {
  type: 'html',
  name: 'HTML',
  dataTypes: ['text/html'],
  fileTypes: ['text/plain'],
  description: 'An HTML drop',
  create: async () => generateDrop({ type: 'html' }),
};

const imageDropConfig: DropConfig = {
  type: 'image',
  name: 'Image',
  fileTypes: ['image/jpeg'],
  requiresFile: true,
  description: 'An image drop',
  create: async () => generateDrop({ type: 'image' }),
};

describe('createFromDataInsert', () => {
  it('creates a drop from the first drop config to match the data type', async () => {
    const drops = await createFromDataInsert(core, textData, [
      imageDropConfig,
      textDropConfig,
      htmlDropConfig,
    ]);

    // Should only create a single drop
    expect(Object.keys(drops).length).toBe(1);
    // Should create a 'text' drop
    expect(Object.values(drops)[0].type).toBe('text');
  });

  it('creates a drop from each file using the first drop config to match the file type', async () => {
    const drops = await createFromDataInsert(core, filesData, [
      imageDropConfig,
      textDropConfig,
      htmlDropConfig,
    ]);

    // Should create 2 drops
    expect(Object.keys(drops).length).toBe(2);
    // Should create an 'image' drop
    expect(
      Object.values(drops).find((drop) => drop.type === 'image'),
    ).toBeDefined();
    // Should create a 'text' drop
    expect(
      Object.values(drops).find((drop) => drop.type === 'text'),
    ).toBeDefined();
  });

  it('creates a single drop from multiple files if drop type supports multiFile', async () => {
    const drops = await createFromDataInsert(core, multiTextFilesData, [
      textDropConfig,
      htmlDropConfig,
    ]);

    // Should create 1 drop
    expect(Object.keys(drops).length).toBe(1);
    // Should create a 'text' drop
    expect(
      Object.values(drops).find((drop) => drop.type === 'text'),
    ).toBeDefined();
  });
});

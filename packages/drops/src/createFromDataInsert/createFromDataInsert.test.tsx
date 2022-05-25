import React from 'react';
import { DataInsert } from '@minddrop/core';
import { imageFile, textFile } from '@minddrop/test-utils';
import { DropsResource } from '../DropsResource';
import { cleanup, setup, core } from '../test-utils';
import { DropTypeConfig } from '../types';
import { createFromDataInsert } from './createFromDataInsert';

const textData: DataInsert = {
  action: 'insert',
  types: ['text/plain', 'text/html'],
  data: {
    'text/plain': 'Hello world',
    'text/html': '<p>Hello world</p>',
  },
  files: [],
};

const filesData: DataInsert = {
  action: 'insert',
  types: ['files'],
  data: {},
  files: [imageFile, textFile],
};

const multiTextFilesData: DataInsert = {
  action: 'insert',
  types: ['files'],
  data: {},
  files: [textFile, textFile],
};

const textDropConfig: DropTypeConfig<{ text: string }> = {
  name: 'Text',
  description: 'A text drop',
  component: () => <div />,
  type: 'text',
  dataSchema: { text: { type: 'string' } },
  multiFile: true,
  dataTypes: ['text/plain', 'text/html'],
  fileTypes: ['text/plain', 'text/html'],
  initializeData: ({ data }) => ({
    text: data['text/plain'] || data['text/html'],
  }),
};

const imageDropConfig: DropTypeConfig<{ file: string }> = {
  name: 'Image',
  description: 'An image drop',
  component: () => <div />,
  type: 'image',
  fileTypes: ['image/jpeg', 'image/png'],
  dataSchema: { file: { type: 'string' } },
  initializeData: ({ files }) => ({ file: files[0].name }),
};

const htmlDropConfig: DropTypeConfig<{ html: string }> = {
  name: 'HTML',
  description: 'An HTML drop',
  component: () => <div />,
  dataTypes: ['text/html'],
  type: 'html',
  dataSchema: { html: { type: 'string' } },
  initializeData: ({ data }) => ({
    html: data['text/html'],
  }),
};

const bookmarkDropConfig: DropTypeConfig<{ url: string }> = {
  name: 'Bookmark',
  description: 'A bookmark drop',
  component: () => <div />,
  type: 'bookmark',
  dataSchema: { url: { type: 'string' } },
};

const withoutInitializeDataDropConfig: DropTypeConfig<{ text: string }> = {
  name: 'Without initializeData callback',
  description:
    'A drop config which has supported data types but no `initializeData` callback',
  component: () => <div />,
  type: 'without-initialize-data',
  dataSchema: { text: { type: 'string' } },
};

describe('createFromDataInsert', () => {
  beforeEach(() => {
    setup();

    // Clear default registered test drop types
    DropsResource.typeConfigsStore.clear();

    // Register the test drop type configs
    DropsResource.register(core, textDropConfig);
    DropsResource.register(core, imageDropConfig);
    DropsResource.register(core, htmlDropConfig);
    DropsResource.register(core, bookmarkDropConfig);
    DropsResource.register(core, withoutInitializeDataDropConfig);
  });

  afterEach(cleanup);

  describe('text data insert', () => {
    it('creates a drop using the first type config to match the data type', () => {
      // Create drops from a text data insert
      const drops = createFromDataInsert(
        core,
        textData,
        DropsResource.getAllTypeConfigs(),
      );

      // Should only create a single drop
      expect(Object.keys(drops).length).toBe(1);

      const [drop] = Object.values(drops);

      // Should create a 'text' drop
      expect(drop.type).toBe('text');
      // Should save the drop
      expect(DropsResource.get(drop.id)).toEqual(drop);
    });
  });

  describe('file data insert', () => {
    it('creates one drop per file using the first tyoe config to match the file type', () => {
      const drops = createFromDataInsert(
        core,
        filesData,
        DropsResource.getAllTypeConfigs(),
      );

      // Should create two drops
      expect(Object.keys(drops).length).toBe(2);

      // Should create an 'image' drop
      expect(
        Object.values(drops).find((drop) => drop.type === 'image'),
      ).toBeDefined();
      // Should create a 'text' drop
      expect(
        Object.values(drops).find((drop) => drop.type === 'text'),
      ).toBeDefined();

      // Should save the drops
      expect(DropsResource.get(Object.keys(drops))).toEqual(drops);
    });
  });

  it('creates a single drop from multiple files if drop type supports multiFile', () => {
    // Create drops from a data insert containing multiple
    // text files.
    const drops = createFromDataInsert(
      core,
      multiTextFilesData,
      DropsResource.getAllTypeConfigs(),
    );

    // Should create a single drop (text drop type supports
    // multiple files).
    expect(Object.keys(drops).length).toBe(1);

    const [drop] = Object.values(drops);

    // Should create a 'text' drop
    expect(drop.type).toBe('text');
    // Should save the drop
    expect(DropsResource.get(drop.id)).toEqual(drop);
  });
});

import { DataInsert, initializeCore } from '@minddrop/core';
import { act, imageFile, textFile } from '@minddrop/test-utils';
import { DropConfig } from '../types';
import { generateDrop } from '../generateDrop';
import { registerDropType } from '../registerDropType';
import { useDropsStore } from '../useDropsStore';
import { Files } from '@minddrop/files';
import { Tags } from '@minddrop/tags';

export const core = initializeCore({ appId: 'app', extensionId: 'drops' });

export const textData: DataInsert = {
  types: ['text/plain', 'text/html'],
  data: {
    'text/plain': 'Hello world',
    'text/html': '<p>Hello world</p>',
  },
  files: [],
};

export const filesData: DataInsert = {
  types: ['files'],
  data: {},
  files: [imageFile, textFile],
};

export const multiTextFilesData: DataInsert = {
  types: ['files'],
  data: {},
  files: [textFile, textFile],
};

export const textDropConfig: DropConfig = {
  type: 'text',
  name: 'Text',
  multiFile: true,
  description: 'A text drop',
  dataTypes: ['text/plain'],
  fileTypes: ['text/plain'],
  create: async () => generateDrop({ type: 'text', markdown: '' }),
  insertData: async (c, drop, { data }) => ({
    ...drop,
    markdown: data['text/plain'],
  }),
};

export const htmlDropConfig: DropConfig = {
  type: 'html',
  name: 'HTML',
  dataTypes: ['text/html'],
  fileTypes: ['text/plain'],
  description: 'An HTML drop',
  create: async () => generateDrop({ type: 'html' }),
};

export const imageDropConfig: DropConfig = {
  type: 'image',
  name: 'Image',
  fileTypes: ['image/jpeg'],
  requiresFile: true,
  description: 'An image drop',
  create: async () => generateDrop({ type: 'image' }),
};

export const unregisteredDropConfig: DropConfig = {
  type: 'unregistered',
  name: 'Unregistered',
  dataTypes: ['text/plain'],
  description: 'An unregistered drop type',
  create: async () => generateDrop({ type: 'unregistered' }),
};

export const dropTypeConfigs = [
  textDropConfig,
  htmlDropConfig,
  imageDropConfig,
];

export function initialize() {
  act(() => {
    registerDropType(core, textDropConfig);
    registerDropType(core, htmlDropConfig);
    registerDropType(core, imageDropConfig);
  });
}

export function cleanup() {
  act(() => {
    useDropsStore.getState().clearRegistered();
    useDropsStore.getState().clearDrops();
    core.removeAllEventListeners();
    Files.clear(core);
    Tags.clear(core);
  });
}

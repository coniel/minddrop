import { DataInsert, initializeCore } from '@minddrop/core';
import { act, imageFile, textFile } from '@minddrop/test-utils';
import { registerDropType } from '../registerDropType';
import { useDropsStore } from '../useDropsStore';
import { Files } from '@minddrop/files';
import { Tags } from '@minddrop/tags';
import { dropFiles, drops, dropTypeConfigs } from './drops.data';
import { loadDrops } from '../loadDrops';

export const core = initializeCore({ appId: 'app', extensionId: 'drops' });

export const textData: DataInsert = {
  action: 'insert',
  types: ['text/plain', 'text/html'],
  data: {
    'text/plain': 'Hello world',
    'text/html': '<p>Hello world</p>',
  },
  files: [],
};

export const filesData: DataInsert = {
  action: 'insert',
  types: ['files'],
  data: {},
  files: [imageFile, textFile],
};

export const multiTextFilesData: DataInsert = {
  action: 'insert',
  types: ['files'],
  data: {},
  files: [textFile, textFile],
};

export function setup() {
  act(() => {
    dropTypeConfigs.forEach((config) => {
      registerDropType(core, config);
    });
    loadDrops(core, drops);
    Files.load(core, dropFiles);
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

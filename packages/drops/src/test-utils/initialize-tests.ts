import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { Files, FILES_TEST_DATA } from '@minddrop/files';
import { Tags, TAGS_TEXT_DATA } from '@minddrop/tags';
import { registerDropType } from '../registerDropType';
import { useDropsStore } from '../useDropsStore';
import { loadDrops } from '../loadDrops';
import { DropConfig } from '../types';
import { dropFiles, drops, dropTypeConfigs } from './drops.data';

const { fileReferences } = FILES_TEST_DATA;
const { tags } = TAGS_TEXT_DATA;

export const core = initializeCore({ appId: 'app', extensionId: 'drops' });

export function setup() {
  act(() => {
    // Register all test drop configs
    dropTypeConfigs.forEach((config) => {
      registerDropType(core, config as DropConfig);
    });

    // Load the test drops
    loadDrops(core, drops);

    // Load the test files
    Files.load(core, fileReferences);
    // Load the test files attached to drops
    Files.load(core, dropFiles);
    // Load test tags
    Tags.load(core, tags);
  });
}

export function cleanup() {
  act(() => {
    // Clear registered drop types
    useDropsStore.getState().clearRegistered();

    // Clear drops
    useDropsStore.getState().clearDrops();
    // Clear files
    Files.clear(core);
    // Clear tags
    Tags.clear(core);

    // Remove all of the extension's event listeners
    core.removeAllEventListeners();
  });
}

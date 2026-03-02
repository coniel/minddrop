import { Events } from '@minddrop/events';
import {
  FILE_SYSTEM_TEST_DATA,
  MockFileSystem,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { act } from '@minddrop/test-utils';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeLight, ThemeSystem } from '../constants';

const { configsFileDescriptor } = FILE_SYSTEM_TEST_DATA;

let MockFsAdapter: MockFileSystem;

export function setup() {
  // Initialize mock file system
  MockFsAdapter = initializeMockFileSystem([configsFileDescriptor]);
}

export function cleanup() {
  // Clear all event listeners
  Events._clearAll();
  // Clear the mock file system
  MockFsAdapter.reset();

  act(() => {
    // Reset the appearance to the default value
    ThemeConfig.set('appearance', ThemeLight);
    // Reset the appearance setting to the default value
    ThemeConfig.set('appearanceSetting', ThemeSystem);
  });
}

import { act } from '@testing-library/react';
import { Events } from '@minddrop/events';
import {
  FILE_SYSTEM_TEST_DATA,
  MockFileSystem,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { ThemeStore } from '../ThemeStore';

initializeI18n();

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
    // Reset the config to default values
    ThemeStore.reset();
  });
}

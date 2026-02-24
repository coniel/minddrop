import { vi } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { Paths } from '@minddrop/utils';
import { useDesignStudioStore } from '../DesignStudioStore';
import { testDatabase, testDesign } from './fixtures';

interface SetupOptions {
  initializeStore?: boolean;
}

initializeI18n();

export const MockFs = initializeMockFileSystem([Paths.workspace]);

export const onSave = vi.fn();

export function setup(setupOptions: SetupOptions = { initializeStore: true }) {
  DatabaseFixtures.setup(MockFs);

  // Initialize the design studio store with the test design
  if (setupOptions.initializeStore !== false) {
    useDesignStudioStore
      .getState()
      .initialize(testDesign, onSave, testDatabase.properties);
  }
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  Events._clearAll();

  // Clear stores
  DatabaseFixtures.cleanup();
  useDesignStudioStore.getState().clear();
  // Reset mock file system
  MockFs.reset();
}

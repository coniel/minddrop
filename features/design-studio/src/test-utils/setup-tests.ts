import { vi } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
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

export const MockFs = initializeMockFileSystem([
  Paths.workspace,
  ...DatabaseFixtures.databaseFiles,
]);

export function setup(setupOptions: SetupOptions = { initializeStore: true }) {
  // Load item type configs into the store
  Databases.Store.load(DatabaseFixtures.databases);

  // Add the test design to the test database
  Databases.Store.update(testDatabase.id, {
    designs: [testDesign],
  });

  // Initialize the design studio store with the test design
  if (setupOptions.initializeStore !== false) {
    useDesignStudioStore
      .getState()
      .initialize(testDesign.tree, testDatabase.properties);
  }
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  Events._clearAll();

  // Clear stores
  Databases.Store.clear();
  useDesignStudioStore.getState().clear();
  // Reset mock file system
  MockFs.reset();
}

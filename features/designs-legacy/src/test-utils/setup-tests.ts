import { vi } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import {
  cleanupDesignFixtures,
  setupDesignFixtures,
} from '@minddrop/designs-legacy/test-utils';
import { Events } from '@minddrop/events';
import {
  initializeMockFileSystem,
  setMockWorkspacePaths,
} from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { Paths } from '@minddrop/utils';
import { DesignStudioStore } from '../DesignStudioStore';
import { testDatabase, testDesign, testLayout } from './fixtures';

interface SetupOptions {
  initializeStore?: boolean;
}

initializeI18n();

// The fixture file paths resolve against the mock workspace, so it is
// set before they are read
setMockWorkspacePaths();

export const MockFs = initializeMockFileSystem([Paths.workspace]);

export function setup(setupOptions: SetupOptions = { initializeStore: true }) {
  DatabaseFixtures.setup(MockFs);
  setupDesignFixtures(MockFs);

  // Initialize the design studio store with the test design
  // and activate the test layout
  if (setupOptions.initializeStore !== false) {
    DesignStudioStore.initialize(testDesign, testDatabase.properties);
    DesignStudioStore.setActiveLayout(testLayout.id);
  }
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  Events._clearAll();

  // Clear stores
  DatabaseFixtures.cleanup();
  cleanupDesignFixtures();
  DesignStudioStore.clear();
  // Reset mock file system
  MockFs.reset();
}

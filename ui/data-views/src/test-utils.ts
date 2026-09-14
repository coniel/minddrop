import { vi } from 'vitest';
import {
  cleanupDataViewFixtures,
  setupDataViewFixtures,
} from '@minddrop/data-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { Filters } from '@minddrop/filters';
import { initializeI18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';

initializeI18n();

// Register the property and filter translations the labels use
Properties.initialize();
Filters.initialize();

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load workspace fixtures required for view file path resolution
  setupWorkspaceFixtures(MockFs);

  // Load database, entry and data view fixtures into the stores
  // and mock file system.
  DatabaseFixtures.setup(MockFs);
  setupDataViewFixtures(MockFs);
}

export async function cleanup(): Promise<void> {
  cleanupRender();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  cleanupDataViewFixtures();
  DatabaseFixtures.cleanup();
  cleanupWorkspaceFixtures();
  await Events.tests.cleanup();
  vi.clearAllMocks();
}

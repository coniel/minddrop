import { vi } from 'vitest';
import {
  cleanupDataViewFixtures,
  setupDataViewFixtures,
} from '@minddrop/data-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';

initializeI18n();

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load workspace fixtures required for view file path resolution
  setupWorkspaceFixtures(MockFs);

  // Load database, entry and data view fixtures into the stores
  // and mock file system
  DatabaseFixtures.setup(MockFs);
  setupDataViewFixtures(MockFs);
}

export function cleanup() {
  cleanupRender();
  cleanupDataViewFixtures();
  DatabaseFixtures.cleanup();
  cleanupWorkspaceFixtures();
  Events._clearAll();
  MockFs.reset();
  vi.clearAllMocks();
}

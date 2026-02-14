import { vi } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { Paths } from '@minddrop/utils';

initializeI18n();

export const MockFs = initializeMockFileSystem([
  Paths.workspace,
  ...DatabaseFixtures.databaseFiles,
]);

export function setup() {
  // Load item type configs into the store
  Databases.Store.load(DatabaseFixtures.databases);
}

export function cleanup() {
  cleanupRender();
  vi.clearAllMocks();
  Events._clearAll();

  // Clear stores
  Databases.Store.clear();
  // Reset mock file system
  MockFs.reset();
}

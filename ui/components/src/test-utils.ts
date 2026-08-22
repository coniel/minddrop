import { vi } from 'vitest';
import {
  cleanupCollectionFixtures,
  setupCollectionFixtures,
} from '@minddrop/collections/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

initializeI18n();

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load database and entry fixtures into the stores and mock
  // file system
  DatabaseFixtures.setup(MockFs);

  // Load collection fixtures into the store and mock file system
  setupCollectionFixtures(MockFs);
}

export function cleanup() {
  cleanupRender();
  DatabaseFixtures.cleanup();
  cleanupCollectionFixtures();
  Events._clearAll();
  MockFs.reset();
  vi.clearAllMocks();
}

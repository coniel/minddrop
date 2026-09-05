import { vi } from 'vitest';
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
}

export function cleanup() {
  cleanupRender();
  DatabaseFixtures.cleanup();
  Events.tests.cleanup();
  MockFs.reset();
  vi.clearAllMocks();
}

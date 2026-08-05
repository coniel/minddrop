import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import { cleanupQueryFixtures, setupQueryFixtures } from '@minddrop/queries';

initializeI18n();

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load query fixtures into the store and mock file system
  setupQueryFixtures(MockFs);
}

export function cleanup() {
  cleanupQueryFixtures();
  Events._clearAll();
  MockFs.reset();
  vi.clearAllMocks();
}

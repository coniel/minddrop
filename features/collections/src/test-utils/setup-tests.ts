import { vi } from 'vitest';
import {
  cleanupCollectionFixtures,
  setupCollectionFixtures,
} from '@minddrop/collections/test-utils';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';

initializeI18n();

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load collection fixtures into the store and mock file system
  setupCollectionFixtures(MockFs);
}

export function cleanup() {
  cleanupCollectionFixtures();
  Events._clearAll();
  MockFs.reset();
  vi.clearAllMocks();
}

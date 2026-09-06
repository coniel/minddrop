import { vi } from 'vitest';
import {
  cleanupCollectionFixtures,
  setupCollectionFixtures,
} from '@minddrop/collections/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';

initializeI18n();

export const MockFs = initializeMockFileSystem();

export function setup() {
  // Load collection fixtures into the store and mock file system
  setupCollectionFixtures(MockFs);
}

export async function cleanup(): Promise<void> {
  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  cleanupCollectionFixtures();
  await Events.tests.cleanup();
  vi.clearAllMocks();
}

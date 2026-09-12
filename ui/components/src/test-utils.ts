import { vi } from 'vitest';
import {
  cleanupCollectionFixtures,
  setupCollectionFixtures,
} from '@minddrop/collections/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
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
  // Set up the workspace fixtures first, so that the workspace
  // scoped stores load into the active workspace's record.
  setupWorkspaceFixtures(MockFs);

  // Load database and entry fixtures into the stores and mock
  // file system.
  DatabaseFixtures.setup(MockFs);

  // Load collection fixtures into the store and mock file system
  setupCollectionFixtures(MockFs);
}

export async function cleanup(): Promise<void> {
  cleanupRender();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  DatabaseFixtures.cleanup();
  cleanupCollectionFixtures();
  await Events.tests.cleanup();
  vi.clearAllMocks();
  cleanupWorkspaceFixtures();
}

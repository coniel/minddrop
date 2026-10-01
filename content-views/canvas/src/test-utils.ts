import { vi } from 'vitest';
import {
  cleanupCollectionFixtures,
  setupCollectionFixtures,
} from '@minddrop/collections/test-utils';
import {
  cleanupContentViewFixtures,
  setupContentViewFixtures,
} from '@minddrop/content-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { cleanup as cleanupDrag } from '@minddrop/drag-and-drop/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
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

  // Load the database, collection and content view fixtures into
  // the stores and the mock file system.
  DatabaseFixtures.setup(MockFs);
  setupCollectionFixtures(MockFs);
  setupContentViewFixtures(MockFs);
}

export async function cleanup(): Promise<void> {
  // Unmount, and end any drag a test left in progress
  cleanupDrag();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  // Clear the stores and fixtures
  DatabaseFixtures.cleanup();
  cleanupCollectionFixtures();
  cleanupContentViewFixtures();
  await Events.tests.cleanup();
  vi.clearAllMocks();
  cleanupWorkspaceFixtures();
}

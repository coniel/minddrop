import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import {
  cleanupTagFixtures,
  setupTagFixtures,
} from '@minddrop/tags/test-utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { initializeEntityGroupsUi } from '@minddrop/ui-entity-groups';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';

initializeI18n();

// Register the entity group translations. The grouped tag list
// renders its chrome with them.
initializeEntityGroupsUi();

export const MockFs = initializeMockFileSystem();

export function setup() {
  setupWorkspaceFixtures(MockFs);

  // Load tag fixtures into the stores and mock file system
  setupTagFixtures(MockFs);
}

export async function cleanup(): Promise<void> {
  cleanupRender();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  cleanupTagFixtures();
  await Events.tests.cleanup();
  vi.clearAllMocks();
  cleanupWorkspaceFixtures();
}

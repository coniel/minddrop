import { vi } from 'vitest';
import {
  cleanupCollectionFixtures,
  setupCollectionFixtures,
} from '@minddrop/collections/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { initializeEntityGroupsUi } from '@minddrop/ui-entity-groups';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { locales } from '../locales';

initializeI18n();

// Register the feature's translations so its labels resolve
I18n.registerTranslations(locales);

// Register the entity group translations. The grouped list renders
// its chrome with them.
initializeEntityGroupsUi();

export const MockFs = initializeMockFileSystem();

export function setup() {
  setupWorkspaceFixtures(MockFs);

  // Load collection fixtures into the store and mock file system
  setupCollectionFixtures(MockFs);
}

export async function cleanup(): Promise<void> {
  cleanupRender();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  cleanupCollectionFixtures();
  await Events.tests.cleanup();
  vi.clearAllMocks();
  cleanupWorkspaceFixtures();
}

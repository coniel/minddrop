// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import {
  cleanupTestSqlDatabase,
  setupTestSqlDatabase,
} from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { Filters } from '@minddrop/filters';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import {
  cleanupQueryFixtures,
  setupQueryFixtures,
} from '@minddrop/queries/test-utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { locales } from '../locales';

initializeI18n();

// Register the feature's translations so labels resolve, and
// the property filter translations the operator labels use.
I18n.registerTranslations(locales);
Properties.initialize();
Filters.initialize();

export const MockFs = initializeMockFileSystem();

export function setup() {
  setupWorkspaceFixtures(MockFs);

  // Open the in-memory SQL database queries run against
  setupTestSqlDatabase();

  // Load query fixtures into the store and mock file system
  setupQueryFixtures(MockFs);
}

export async function cleanup(): Promise<void> {
  cleanupRender();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  cleanupTestSqlDatabase();
  cleanupQueryFixtures();
  await Events.tests.cleanup();
  vi.clearAllMocks();
  cleanupWorkspaceFixtures();
}

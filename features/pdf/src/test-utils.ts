// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { DesignElementConfigs } from '@minddrop/designs-next';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { resetPdfStores } from '@minddrop/pdf/test-utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { locales } from './locales';

// Initialize i18n
initializeI18n();

// Register the feature's translations. This runs after the imports
// above, so it lands after the i18n initialization in
// @minddrop/test-utils. That initialization resets the resource
// bundles.
I18n.registerTranslations(locales);

// The mock file system the fixtures are set up on
export const MockFs = initializeMockFileSystem();

/**
 * Sets up the workspace fixtures.
 */
export function setup() {
  setupWorkspaceFixtures(MockFs);
}

/**
 * Cleans up rendered components, mocks, file operations and stores.
 */
export async function cleanup(): Promise<void> {
  // Unmount rendered components and reset mocks
  cleanupRender();
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();
  await Events.tests.cleanup();

  // Clear the stores
  DesignElementConfigs.Store.clear();
  resetPdfStores();
  cleanupWorkspaceFixtures();
}

import { vi } from 'vitest';
import {
  cleanupDesignFixtures,
  setupDesignFixtures,
} from '@minddrop/designs/test-utils';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { locales } from '../locales';

initializeI18n();

// Register the feature's own translations, as the feature
// initializer does at runtime, so tests exercise real labels.
I18n.registerTranslations(locales);

export const MockFs = initializeMockFileSystem();

export function setup() {
  setupWorkspaceFixtures(MockFs);

  // Load design fixtures into the stores and mock file system
  setupDesignFixtures(MockFs);
}

export async function cleanup(): Promise<void> {
  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  cleanupDesignFixtures();
  await Events.tests.cleanup();
  vi.clearAllMocks();
  cleanupWorkspaceFixtures();
}

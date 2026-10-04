// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { locales } from '../locales';
import { getQueryFiles } from './queries.fixtures';
import {
  SetupQueryFixturesOptions,
  cleanupQueryFixtures,
  setupQueryFixtures,
} from './setup-fixtures';

initializeI18n();

// Register the package's translations
I18n.registerTranslations(locales);

export const MockFs = initializeMockFileSystem([...getQueryFiles()]);
export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(options: SetupQueryFixturesOptions) {
  setupWorkspaceFixtures(MockFs);
  setupQueryFixtures(MockFs, options);
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export async function cleanup(): Promise<void> {
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  await Events.tests.cleanup();
  vi.useRealTimers();
  cleanupQueryFixtures();
  cleanupWorkspaceFixtures();
}

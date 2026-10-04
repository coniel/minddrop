// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { locales } from '../locales';
import {
  SetupWorkspaceFixturesOptions,
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from './setup-fixtures';

initializeI18n();

// Register the package's translations
I18n.registerTranslations(locales);

export const MockFs = initializeMockFileSystem();
export const mockDate = new Date('2000-01-01T00:00:00.000Z');

export function setup(options?: SetupWorkspaceFixturesOptions) {
  vi.useFakeTimers({ now: mockDate });
  setupWorkspaceFixtures(MockFs, options);
}

export async function cleanup(): Promise<void> {
  vi.clearAllMocks();
  vi.useRealTimers();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  await Events.tests.cleanup();
  cleanupWorkspaceFixtures();
}

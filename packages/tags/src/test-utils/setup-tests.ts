import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { locales } from '../locales';
import {
  SetupTagFixturesOptions,
  cleanupTagFixtures,
  setupTagFixtures,
} from './setup-fixtures';
import { getTagGroupFiles } from './tag-groups.fixtures';
import { getTagFiles } from './tags.fixtures';

initializeI18n();
I18n.registerTranslations(locales);

export const MockFs = initializeMockFileSystem([
  ...getTagFiles(),
  ...getTagGroupFiles(),
]);
export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(options: SetupTagFixturesOptions = {}) {
  setupTagFixtures(MockFs, options);
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
  cleanupTagFixtures();
}

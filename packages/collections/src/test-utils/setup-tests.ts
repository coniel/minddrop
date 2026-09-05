import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { locales } from '../locales';
import { getCollectionFiles } from './collections.fixtures';
import {
  SetupCollectionFixturesOptions,
  cleanupCollectionFixtures,
  setupCollectionFixtures,
} from './setup-fixtures';

initializeI18n();
I18n.registerTranslations(locales);

export const MockFs = initializeMockFileSystem([...getCollectionFiles()]);
export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(options: SetupCollectionFixturesOptions = {}) {
  setupCollectionFixtures(MockFs, options);
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  vi.clearAllMocks();
  MockFs.reset();
  Events.tests.cleanup();
  vi.useRealTimers();
  cleanupCollectionFixtures();
}

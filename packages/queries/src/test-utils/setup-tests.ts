import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { getQueryFiles } from './queries.fixtures';
import {
  SetupQueryFixturesOptions,
  cleanupQueryFixtures,
  setupQueryFixtures,
} from './setup-fixtures';

initializeI18n();

export const MockFs = initializeMockFileSystem([...getQueryFiles()]);
export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(options: SetupQueryFixturesOptions) {
  setupQueryFixtures(MockFs, options);
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  vi.clearAllMocks();
  MockFs.reset();
  Events.tests.cleanup();
  vi.useRealTimers();
  cleanupQueryFixtures();
}

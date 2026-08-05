import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { initializeI18n } from '@minddrop/i18n';
import {
  SetupSpaceFixturesOptions,
  cleanupSpaceFixtures,
  setupSpaceFixtures,
} from './setup-fixtures';
import { spaceFiles } from './spaces.fixtures';

initializeI18n();

export const MockFs = initializeMockFileSystem([...spaceFiles]);
export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(options: SetupSpaceFixturesOptions = {}) {
  setupSpaceFixtures(MockFs, options);
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export function cleanup() {
  vi.clearAllMocks();
  MockFs.reset();
  Events._clearAll();
  vi.useRealTimers();
  cleanupSpaceFixtures();
}

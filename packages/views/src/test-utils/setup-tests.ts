import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  SetupViewFixturesOptions,
  cleanupViewFixtures,
  setupViewFixtures,
} from './setup-fixtures';

export const MockFs = initializeMockFileSystem();
export const mockDate = new Date('2000-01-01T00:00:00.000Z');

export function setup(options: SetupViewFixturesOptions) {
  setupViewFixtures(MockFs, options);
  vi.useFakeTimers({ now: mockDate });
}

export function cleanup() {
  vi.clearAllMocks();
  Events._clearAll();
  vi.useRealTimers();
  cleanupViewFixtures();
  MockFs.reset();
}

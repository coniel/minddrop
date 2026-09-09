// Registers the store assertion matchers
import '@minddrop/stores/test-utils';
import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import {
  SetupSpaceFixturesOptions,
  cleanupSpaceFixtures,
  setupSpaceFixtures,
} from './setup-fixtures';
import { getSpaceFiles } from './spaces.fixtures';

initializeI18n();

export const MockFs = initializeMockFileSystem([...getSpaceFiles()]);
export const mockDate = new Date('2026-01-01T00:00:00.000Z');

export function setup(options: SetupSpaceFixturesOptions = {}) {
  setupSpaceFixtures(MockFs, options);
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
  cleanupSpaceFixtures();
}

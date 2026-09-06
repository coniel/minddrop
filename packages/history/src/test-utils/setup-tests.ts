import { vi } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';

export const MockFs = initializeMockFileSystem();
export const mockDate = new Date('2026-06-01T00:00:00.000Z');

export function setup() {
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
}

export async function cleanup(): Promise<void> {
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  vi.useRealTimers();
}

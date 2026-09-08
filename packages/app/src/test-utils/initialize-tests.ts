import { vi } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';

export const MockFs = initializeMockFileSystem();

export async function cleanup(): Promise<void> {
  // Clear mocked function state
  vi.clearAllMocks();

  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  // Events.tests.cleanup() is deliberately not used: it would also remove
  // the hydrate listeners persistent stores register when their modules
  // are first loaded, which cannot be registered again, leaving
  // hydrate() unable to resolve for the rest of the run. Tests remove
  // the listeners they register themselves.
}

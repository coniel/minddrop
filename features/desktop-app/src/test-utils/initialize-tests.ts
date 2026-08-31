import { vi } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { initializeI18n } from '@minddrop/i18n';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

initializeI18n();

export const MockFs = initializeMockFileSystem();

export function cleanup() {
  // Unmount any rendered components
  cleanupRender();

  // Clear mocked function state
  vi.clearAllMocks();

  // Restore the mock file system to its initial state.
  // Events._clearAll() is deliberately not used: it would also remove
  // the hydrate listeners persistent stores register when their modules
  // are first loaded, which cannot be registered again, leaving
  // hydrate() unable to resolve for the rest of the run. Tests remove
  // the listeners they register themselves.
  MockFs.reset();
}

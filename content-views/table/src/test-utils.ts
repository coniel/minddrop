import { vi } from 'vitest';
import {
  cleanup as cleanupDatabases,
  setup as setupDatabases,
} from '@minddrop/databases/test-utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';

/**
 * Sets up the database fixtures and gives elements a size.
 */
export function setup() {
  // Load the workspace, database and entry fixtures into the stores
  // and the mock file system.
  setupDatabases();

  // Give elements a size. happy-dom lays nothing out, and the
  // virtualised rows only render in a sized container.
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(800);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
}

/**
 * Unmounts rendered components and clears the stubs and fixtures
 * created by `setup`.
 */
export async function cleanup(): Promise<void> {
  // Unmount the rendered components
  cleanupRender();

  // Remove the element size stubs
  vi.restoreAllMocks();

  // Settle the mock file system and clear the stores and fixtures
  await cleanupDatabases();
}

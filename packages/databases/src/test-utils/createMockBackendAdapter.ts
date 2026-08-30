import { registerDatabaseBackendAdapter } from '../DatabaseBackendAdapter';
import type { InitializeBackendResult } from '../sql';
import { databaseEntrySqlRecords, databases } from './fixtures';

export interface MockBackendAdapter {
  /**
   * The workspace IDs and paths passed to `initializeBackend`,
   * in call order.
   */
  initializeBackendCalls: { workspaceId: string; workspacePath: string }[];

  /**
   * The workspace paths passed to `backgroundSync`, in call
   * order.
   */
  backgroundSyncCalls: string[];
}

/**
 * Registers a fake database backend adapter whose
 * `initializeBackend` resolves with a fixture based result and
 * which records the calls it receives, allowing tests to assert
 * backend interactions as recorded data.
 *
 * @param result - Overrides merged over the fixture based initialization result.
 * @returns The recorded call state.
 */
export function createMockBackendAdapter(
  result?: Partial<InitializeBackendResult>,
): MockBackendAdapter {
  // Recorded call state returned for tests to inspect
  const recordedCalls: MockBackendAdapter = {
    initializeBackendCalls: [],
    backgroundSyncCalls: [],
  };

  // Fixture based initialization result with overrides applied
  const initializeBackendResult: InitializeBackendResult = {
    databases,
    entries: databaseEntrySqlRecords,
    schemaChanged: false,
    ...result,
  };

  // Register the fake adapter in place of a platform backend
  registerDatabaseBackendAdapter({
    async initializeBackend(workspaceId, workspacePath) {
      // Record the call for assertions
      recordedCalls.initializeBackendCalls.push({ workspaceId, workspacePath });

      return initializeBackendResult;
    },

    async backgroundSync(workspacePath) {
      // Record the call for assertions
      recordedCalls.backgroundSyncCalls.push(workspacePath);
    },
  });

  return recordedCalls;
}

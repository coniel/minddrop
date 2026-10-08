import { registerDatabaseBackendAdapter } from '../DatabaseBackendAdapter';
import type { InitializeBackendResult } from '../sql';
import type { EntryFileChange } from '../types';
import { databases, entrySqlRecords } from './fixtures';

export interface MockBackendAdapter {
  /**
   * The workspace IDs and paths passed to `initializeBackend`,
   * in call order.
   */
  initializeBackendCalls: { workspaceId: string; workspacePath: string }[];

  /**
   * The workspace IDs and paths passed to `backgroundSync`, in
   * call order.
   */
  backgroundSyncCalls: { workspaceId: string; workspacePath: string }[];

  /**
   * The entry file changes passed to `syncEntryFiles`, one array per
   * call, in call order.
   */
  syncEntryFilesCalls: EntryFileChange[][];

  /**
   * Finishes the oldest unfinished `backgroundSync` or
   * `syncEntryFiles` call. Only needed when syncs are deferred.
   *
   * @throws Error if no sync is unfinished.
   */
  finishNextSync(): void;
}

export interface CreateMockBackendAdapterOptions {
  /**
   * Whether `backgroundSync` and `syncEntryFiles` calls stay
   * unfinished until `finishNextSync` is called, rather than
   * finishing at once.
   */
  deferSyncs?: boolean;
}

/**
 * Registers a fake database backend adapter whose
 * `initializeBackend` resolves with a fixture based result and
 * which records the calls it receives, allowing tests to assert
 * backend interactions as recorded data.
 *
 * @param result - Overrides merged over the fixture based initialization result.
 * @param options - Mock options.
 * @returns The recorded call state.
 */
export function createMockBackendAdapter(
  result?: Partial<InitializeBackendResult>,
  options?: CreateMockBackendAdapterOptions,
): MockBackendAdapter {
  // The resolvers of the unfinished syncs, oldest first
  const unfinishedSyncs: VoidFunction[] = [];

  // Recorded call state returned for tests to inspect
  const recordedCalls: MockBackendAdapter = {
    initializeBackendCalls: [],
    backgroundSyncCalls: [],
    syncEntryFilesCalls: [],
    finishNextSync() {
      const finish = unfinishedSyncs.shift();

      if (!finish) {
        throw new Error('No sync is unfinished.');
      }

      finish();
    },
  };

  // Fixture based initialization result with overrides applied
  const initializeBackendResult: InitializeBackendResult = {
    databases,
    entries: entrySqlRecords,
    schemaChanged: false,
    ...result,
  };

  // Finish a sync at once, or once the test finishes it when deferred
  const runSync = (): Promise<void> => {
    if (!options?.deferSyncs) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      unfinishedSyncs.push(resolve);
    });
  };

  // Register the fake adapter in place of a platform backend
  registerDatabaseBackendAdapter({
    async initializeBackend(workspaceId, workspacePath) {
      // Record the call for assertions
      recordedCalls.initializeBackendCalls.push({ workspaceId, workspacePath });

      return initializeBackendResult;
    },

    backgroundSync(workspaceId, workspacePath) {
      // Record the call for assertions
      recordedCalls.backgroundSyncCalls.push({ workspaceId, workspacePath });

      return runSync();
    },

    syncEntryFiles(_workspaceId, _workspacePath, _databases, changes) {
      // Record the call for assertions
      recordedCalls.syncEntryFilesCalls.push(changes);

      return runSync();
    },
  });

  return recordedCalls;
}

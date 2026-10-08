import { vi } from 'vitest';
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
   * The database IDs passed to `syncDatabaseConfigs`, one array per
   * call, in call order.
   */
  syncDatabaseConfigsCalls: string[][];

  /**
   * Finishes the oldest unfinished `backgroundSync`, `syncEntryFiles`
   * or `syncDatabaseConfigs` call. Only needed when syncs are
   * deferred.
   *
   * @throws {Error} If no sync is unfinished.
   */
  finishNextSync(): void;

  /**
   * Finishes every unfinished `backgroundSync`, `syncEntryFiles` and
   * `syncDatabaseConfigs` call, including those started while finishing. Does nothing if no
   * sync is unfinished.
   *
   * @returns A promise resolving once no sync is left unfinished.
   */
  finishAllSyncs(): Promise<void>;
}

export interface CreateMockBackendAdapterOptions {
  /**
   * Overrides merged over the fixture based initialization result.
   */
  result?: Partial<InitializeBackendResult>;

  /**
   * Whether `backgroundSync`, `syncEntryFiles` and
   * `syncDatabaseConfigs` calls stay unfinished until `finishNextSync` is called, rather than
   * finishing at once.
   */
  deferSyncs?: boolean;
}

/**
 * Registers a fake database backend adapter which records the calls it
 * receives. Its `initializeBackend` resolves with a fixture based
 * result.
 *
 * @param options - Mock options.
 * @returns The recorded call state.
 */
export function createMockBackendAdapter(
  options?: CreateMockBackendAdapterOptions,
): MockBackendAdapter {
  // The resolvers of the unfinished syncs, oldest first
  const unfinishedSyncs: VoidFunction[] = [];

  // Recorded call state returned for tests to inspect
  const recordedCalls: MockBackendAdapter = {
    initializeBackendCalls: [],
    backgroundSyncCalls: [],
    syncEntryFilesCalls: [],
    syncDatabaseConfigsCalls: [],
    finishNextSync() {
      // Take the oldest unfinished sync
      const finish = unfinishedSyncs.shift();

      // Throw if no sync is unfinished
      if (!finish) {
        throw new Error('No sync is unfinished.');
      }

      // Finish the sync
      finish();
    },
    async finishAllSyncs() {
      // Finish syncs until none is left. Each finished sync's follow-up
      // work may start a sync it queued.
      while (unfinishedSyncs.length) {
        // Finish the oldest sync
        unfinishedSyncs.shift()?.();

        // Let the sync's follow-up work run
        await vi.advanceTimersByTimeAsync(0);
      }
    },
  };

  // Fixture based initialization result with overrides applied
  const initializeBackendResult: InitializeBackendResult = {
    databases,
    entries: entrySqlRecords,
    schemaChanged: false,
    ...options?.result,
  };

  // Finish a sync at once, or once the test finishes it when deferred
  const runSync = (): Promise<void> => {
    // Check if syncs are deferred. If not, finish the sync at once.
    if (!options?.deferSyncs) {
      return Promise.resolve();
    }

    // Leave the sync unfinished until the test finishes it
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

    syncDatabaseConfigs(_workspaceId, _workspacePath, _databases, databaseIds) {
      // Record the call for assertions
      recordedCalls.syncDatabaseConfigsCalls.push(databaseIds);

      return runSync();
    },
  });

  return recordedCalls;
}

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Search } from '@minddrop/search';
import { Sql } from '@minddrop/sql';
import { createTestSqlAdapter } from '@minddrop/sql/test-utils';
import { Workspaces } from '@minddrop/workspaces';
import {
  WorkspaceFixtures,
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { MockFs, cleanup } from '../test-utils';
import { initializeWorkspaceCleanup } from './initializeWorkspaceCleanup';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

// The workspace's data directory and the SQL database file in it
const dataDirPath = Workspaces.resolveDataDirPath(workspace_2.id);
const databasePath = `${dataDirPath}/data.db`;

// The workspaces whose index the search adapter was asked to unload,
// each recorded with whether its SQL connection was still open
let unloads: { workspaceId: string; sqlOpen: boolean }[] = [];

describe('initializeWorkspaceCleanup', () => {
  // The cleanup function returned by the initialization under test
  let removeListener: VoidFunction = () => {};

  beforeEach(() => {
    vi.useFakeTimers();
    unloads = [];

    setupWorkspaceFixtures(MockFs);

    // Record the unload calls together with the SQL connection state
    // at the time.
    Search.registerAdapter({
      searchFullText: async () => [],
      searchInitialize: async () => undefined,
      searchUnload: async ({ workspaceId }) => {
        unloads.push({ workspaceId, sqlOpen: isSqlOpen(workspaceId) });
      },
      searchSync: async () => undefined,
      searchDatabaseSync: async () => undefined,
      searchReindexDatabase: async () => undefined,
    });

    // Open the workspace's SQL connection and give it a data directory
    Sql.registerAdapter(createTestSqlAdapter());
    Sql.connect(workspace_2.id);
    MockFs.addFiles([{ path: databasePath, textContent: '' }]);

    removeListener = initializeWorkspaceCleanup();
  });

  afterEach(async () => {
    removeListener();
    Sql.closeAll();

    vi.useRealTimers();

    cleanupWorkspaceFixtures();

    await cleanup();
  });

  it('unloads the search index before closing the SQL connection', async () => {
    Events.dispatch(Workspaces.events.Deleted, workspace_2);

    await flushEvents();

    expect(unloads).toEqual([{ workspaceId: workspace_2.id, sqlOpen: true }]);
  });

  it('closes the SQL connection', async () => {
    Events.dispatch(Workspaces.events.Deleted, workspace_2);

    await flushEvents();

    expect(isSqlOpen(workspace_2.id)).toBe(false);
  });

  it('removes the data directory', async () => {
    Events.dispatch(Workspaces.events.Deleted, workspace_2);

    await flushEvents();

    expect(MockFs.exists(dataDirPath)).toBe(false);
  });

  it('leaves other workspaces alone', async () => {
    const otherDataDirPath = Workspaces.resolveDataDirPath(workspace_1.id);

    Sql.connect(workspace_1.id);
    MockFs.addFiles([{ path: `${otherDataDirPath}/data.db`, textContent: '' }]);

    Events.dispatch(Workspaces.events.Deleted, workspace_2);

    await flushEvents();

    expect(isSqlOpen(workspace_1.id)).toBe(true);
    expect(MockFs.exists(otherDataDirPath)).toBe(true);
  });

  it('copes with a workspace which never loaded', async () => {
    Sql.close(workspace_2.id);
    MockFs.removeDir(dataDirPath, { recursive: true });

    Events.dispatch(Workspaces.events.Deleted, workspace_2);

    await flushEvents();

    expect(unloads.map((unload) => unload.workspaceId)).toEqual([
      workspace_2.id,
    ]);
  });
});

/**
 * Checks whether a workspace's SQL connection is open, which is
 * what a query needs.
 */
function isSqlOpen(workspaceId: string): boolean {
  try {
    Sql.get(workspaceId, 'SELECT 1');

    return true;
  } catch {
    return false;
  }
}

/**
 * Lets the queued event listeners and the file operations they
 * await run.
 */
async function flushEvents(): Promise<void> {
  await vi.advanceTimersByTimeAsync(0);
  await vi.advanceTimersByTimeAsync(0);
}

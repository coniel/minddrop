import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Ledgers } from '@minddrop/history';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseHistoryCauses } from '../constants';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import { resolveWorkspaceDatabaseLedger } from '../utils';
import { recordSyncedDatabaseDeletion } from './recordSyncedDatabaseDeletion';

const { objectDatabase } = DatabaseFixtures;
const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('recordSyncedDatabaseDeletion', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("records the deletion in the workspace's databases ledger", async () => {
    await recordSyncedDatabaseDeletion(objectDatabase, workspace_1.path);

    // The ledger should record the deletion under the database's name,
    // with an action of its own.
    expect(await Ledgers.read(resolveWorkspaceDatabaseLedger())).toEqual([
      expect.objectContaining({
        kind: 'deleted',
        subject: { key: objectDatabase.name, id: objectDatabase.id },
        action: {
          id: expect.stringMatching(/^action_/),
          cause: DatabaseHistoryCauses.DatabaseDeleted,
        },
      }),
    ]);
  });

  it('records the deletion in the given workspace', async () => {
    await recordSyncedDatabaseDeletion(objectDatabase, workspace_2.path);

    expect(
      await Ledgers.read(resolveWorkspaceDatabaseLedger(workspace_2.path)),
    ).toHaveLength(1);
  });
});

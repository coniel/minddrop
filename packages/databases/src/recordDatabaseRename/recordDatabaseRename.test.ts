import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { History, Ledgers } from '@minddrop/history';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import {
  resolveDatabaseHistorySubject,
  resolveWorkspaceDatabaseLedger,
} from '../utils';
import { recordDatabaseRename } from './recordDatabaseRename';

const { objectDatabase, historyAction_databaseRenamed } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

// The object database renamed
const renamedDatabase = {
  ...objectDatabase,
  name: 'Renamed Objects',
  path: 'Renamed Objects',
};

describe('recordDatabaseRename', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("records the rename against the database's history under its new path", async () => {
    await recordDatabaseRename(
      renamedDatabase,
      objectDatabase.name,
      historyAction_databaseRenamed,
    );

    expect(
      await History.read(resolveDatabaseHistorySubject(renamedDatabase)),
    ).toEqual([
      expect.objectContaining({
        kind: 'rename',
        target: 'self',
        from: objectDatabase.name,
        to: renamedDatabase.name,
        action: historyAction_databaseRenamed,
      }),
    ]);
  });

  it("records the rename in the workspace's databases ledger under the previous name", async () => {
    await recordDatabaseRename(
      renamedDatabase,
      objectDatabase.name,
      historyAction_databaseRenamed,
    );

    expect(await Ledgers.read(resolveWorkspaceDatabaseLedger())).toEqual([
      expect.objectContaining({
        kind: 'rename',
        subject: { key: objectDatabase.name, id: objectDatabase.id },
        to: renamedDatabase.name,
        action: historyAction_databaseRenamed,
      }),
    ]);
  });

  it('records the rename in the given workspace', async () => {
    await recordDatabaseRename(
      renamedDatabase,
      objectDatabase.name,
      historyAction_databaseRenamed,
      workspace_2.path,
    );

    // Both records should be in the second workspace
    expect(
      await History.read(
        resolveDatabaseHistorySubject(renamedDatabase, workspace_2.path),
      ),
    ).toHaveLength(1);
    expect(
      await Ledgers.read(resolveWorkspaceDatabaseLedger(workspace_2.path)),
    ).toHaveLength(1);
  });
});

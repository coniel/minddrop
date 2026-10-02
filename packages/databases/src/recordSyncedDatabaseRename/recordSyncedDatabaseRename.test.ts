import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { History, Ledgers } from '@minddrop/history';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseHistoryCauses } from '../constants';
import { recordWorkspaceDatabaseLedger } from '../recordWorkspaceDatabaseLedger';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import {
  resolveDatabaseHistorySubject,
  resolveWorkspaceDatabaseLedger,
} from '../utils';
import { recordSyncedDatabaseRename } from './recordSyncedDatabaseRename';

const { objectDatabase } = DatabaseFixtures;
const { workspace_1, workspace_2 } = WorkspaceFixtures;

// The object database renamed
const renamedDatabase = {
  ...objectDatabase,
  name: 'Renamed Objects',
  path: 'Renamed Objects',
};

// The action a rename found by the sync is recorded under
const renameAction = {
  id: expect.stringMatching(/^action_/),
  cause: DatabaseHistoryCauses.DatabaseRenamed,
};

describe('recordSyncedDatabaseRename', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('records a rename of a database the store held under another name', async () => {
    await recordSyncedDatabaseRename(
      renamedDatabase,
      objectDatabase.name,
      workspace_1.path,
    );

    // The database's history and the ledger should record the rename
    // from the stored name under one action.
    const [history, ledger] = await Promise.all([
      History.read(resolveDatabaseHistorySubject(renamedDatabase)),
      Ledgers.read(resolveWorkspaceDatabaseLedger()),
    ]);

    expect(history).toEqual([
      expect.objectContaining({
        kind: 'rename',
        from: objectDatabase.name,
        to: renamedDatabase.name,
        action: renameAction,
      }),
    ]);
    expect(ledger).toEqual([
      expect.objectContaining({
        kind: 'rename',
        subject: { key: objectDatabase.name, id: objectDatabase.id },
        to: renamedDatabase.name,
        action: history[0].action,
      }),
    ]);
  });

  it('records nothing for a database the store held under the same name', async () => {
    await recordSyncedDatabaseRename(
      objectDatabase,
      objectDatabase.name,
      workspace_1.path,
    );

    expect(
      await History.read(resolveDatabaseHistorySubject(objectDatabase)),
    ).toEqual([]);
    expect(await Ledgers.read(resolveWorkspaceDatabaseLedger())).toEqual([]);
  });

  it('records a rename of a database put back under another name', async () => {
    // Record the database deleted under an earlier name
    await recordWorkspaceDatabaseLedger({
      kind: 'deleted',
      subject: { key: 'Old Objects', id: objectDatabase.id },
    });

    await recordSyncedDatabaseRename(objectDatabase, null, workspace_1.path);

    // The database's history and the ledger should record the rename
    // from the deleted name.
    expect(
      await History.read(resolveDatabaseHistorySubject(objectDatabase)),
    ).toEqual([
      expect.objectContaining({
        kind: 'rename',
        from: 'Old Objects',
        to: objectDatabase.name,
        action: renameAction,
      }),
    ]);
    expect(await Ledgers.read(resolveWorkspaceDatabaseLedger())).toEqual([
      expect.objectContaining({ kind: 'deleted' }),
      expect.objectContaining({
        kind: 'rename',
        subject: { key: 'Old Objects', id: objectDatabase.id },
        to: objectDatabase.name,
        action: renameAction,
      }),
    ]);
  });

  it('records nothing for a database put back under the same name', async () => {
    // Record the database deleted under its current name
    await recordWorkspaceDatabaseLedger({
      kind: 'deleted',
      subject: { key: objectDatabase.name, id: objectDatabase.id },
    });

    await recordSyncedDatabaseRename(objectDatabase, null, workspace_1.path);

    // No rename should be recorded in the history or the ledger
    expect(
      await History.read(resolveDatabaseHistorySubject(objectDatabase)),
    ).toEqual([]);
    expect(await Ledgers.read(resolveWorkspaceDatabaseLedger())).toEqual([
      expect.objectContaining({ kind: 'deleted' }),
    ]);
  });

  it('records the rename in the given workspace', async () => {
    // Record the database deleted under an earlier name in the second
    // workspace.
    await recordWorkspaceDatabaseLedger(
      {
        kind: 'deleted',
        subject: { key: 'Old Objects', id: objectDatabase.id },
      },
      workspace_2.path,
    );

    await recordSyncedDatabaseRename(objectDatabase, null, workspace_2.path);

    // The database's history and the ledger in the second workspace
    // should record the rename.
    expect(
      await History.read(
        resolveDatabaseHistorySubject(objectDatabase, workspace_2.path),
      ),
    ).toEqual([
      expect.objectContaining({
        kind: 'rename',
        from: 'Old Objects',
        to: objectDatabase.name,
      }),
    ]);
    expect(
      await Ledgers.read(resolveWorkspaceDatabaseLedger(workspace_2.path)),
    ).toEqual([
      expect.objectContaining({ kind: 'deleted' }),
      expect.objectContaining({ kind: 'rename' }),
    ]);
  });

  it('records nothing for a database the ledger does not record as deleted', async () => {
    await recordSyncedDatabaseRename(objectDatabase, null, workspace_1.path);

    expect(
      await History.read(resolveDatabaseHistorySubject(objectDatabase)),
    ).toEqual([]);
    expect(await Ledgers.read(resolveWorkspaceDatabaseLedger())).toEqual([]);
  });
});

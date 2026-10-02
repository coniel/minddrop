import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { recordWorkspaceDatabaseLedger } from '../recordWorkspaceDatabaseLedger';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import { readDeletedDatabaseName } from './readDeletedDatabaseName';

const { objectDatabase, urlDatabase } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

describe('readDeletedDatabaseName', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("reads the name on the database's deleted record", async () => {
    // Record the database deleted under an earlier name
    await recordWorkspaceDatabaseLedger({
      kind: 'deleted',
      subject: { key: 'Old Objects', id: objectDatabase.id },
    });

    expect(await readDeletedDatabaseName(objectDatabase.id)).toBe(
      'Old Objects',
    );
  });

  it("reads the name on the latest of the database's records", async () => {
    // Record the database deleted, then recreated and renamed
    await recordWorkspaceDatabaseLedger({
      kind: 'deleted',
      subject: { key: 'Old Objects', id: objectDatabase.id },
    });
    await recordWorkspaceDatabaseLedger({
      kind: 'rename',
      subject: { key: 'Old Objects', id: objectDatabase.id },
      to: 'Objects',
    });

    // No deleted name should be read, since the database's latest
    // record is not a deletion.
    expect(await readDeletedDatabaseName(objectDatabase.id)).toBeNull();
  });

  it("ignores other databases' records", async () => {
    // Record another database deleted
    await recordWorkspaceDatabaseLedger({
      kind: 'deleted',
      subject: { key: urlDatabase.name, id: urlDatabase.id },
    });

    expect(await readDeletedDatabaseName(objectDatabase.id)).toBeNull();
  });

  it('returns null when the database has no records', async () => {
    expect(await readDeletedDatabaseName(objectDatabase.id)).toBeNull();
  });

  it('reads the ledger of the given workspace', async () => {
    // Record the database deleted in the second workspace
    await recordWorkspaceDatabaseLedger(
      {
        kind: 'deleted',
        subject: { key: 'Old Objects', id: objectDatabase.id },
      },
      workspace_2.path,
    );

    expect(
      await readDeletedDatabaseName(objectDatabase.id, workspace_2.path),
    ).toBe('Old Objects');
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Ledgers } from '@minddrop/history';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntryLedgerType } from '../constants';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import { recordEntriesLedger } from './recordEntriesLedger';

const { databaseDirPath, objectDatabase, objectEntry1 } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

// A deletion of the object entry
const deletion = {
  kind: 'deleted' as const,
  subject: { key: objectEntry1.title },
};

describe('recordEntriesLedger', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("records the change in the database's entries ledger", async () => {
    // Record a change
    await recordEntriesLedger(objectDatabase, deletion);

    // The database's entries ledger should contain the change
    expect(
      await Ledgers.read({
        ownerPath: databaseDirPath(objectDatabase),
        type: EntryLedgerType,
      }),
    ).toEqual([expect.objectContaining(deletion)]);
  });

  it('returns the recorded change', async () => {
    // Record a change
    const record = await recordEntriesLedger(objectDatabase, deletion);

    // The returned change should be the one in the ledger
    expect(
      await Ledgers.read({
        ownerPath: databaseDirPath(objectDatabase),
        type: EntryLedgerType,
      }),
    ).toEqual([record]);
  });

  it('records the change in the given workspace', async () => {
    // Record a change in the second workspace
    await recordEntriesLedger(objectDatabase, deletion, workspace_2.path);

    // The database's entries ledger in the second workspace should
    // contain it.
    expect(
      await Ledgers.read({
        ownerPath: `${workspace_2.path}/${objectDatabase.path}`,
        type: EntryLedgerType,
      }),
    ).toEqual([expect.objectContaining(deletion)]);
  });
});

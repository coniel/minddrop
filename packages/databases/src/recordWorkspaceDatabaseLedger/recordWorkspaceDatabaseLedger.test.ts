import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Ledgers } from '@minddrop/history';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseLedgerType } from '../constants';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import { recordWorkspaceDatabaseLedger } from './recordWorkspaceDatabaseLedger';

const { objectDatabase, parentDir } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

// A deletion of the object database
const deletion = {
  kind: 'deleted' as const,
  subject: { key: objectDatabase.name, id: objectDatabase.id },
};

describe('recordWorkspaceDatabaseLedger', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("records the change in the workspace's databases ledger", async () => {
    // Record a change
    await recordWorkspaceDatabaseLedger(deletion);

    // The active workspace's databases ledger should contain the change
    expect(
      await Ledgers.read({ ownerPath: parentDir, type: DatabaseLedgerType }),
    ).toEqual([expect.objectContaining(deletion)]);
  });

  it('returns the recorded change', async () => {
    // Record a change
    const record = await recordWorkspaceDatabaseLedger(deletion);

    // The returned change should be the one in the ledger
    expect(
      await Ledgers.read({ ownerPath: parentDir, type: DatabaseLedgerType }),
    ).toEqual([record]);
  });

  it('records the change in the given workspace', async () => {
    // Record a change in the second workspace
    await recordWorkspaceDatabaseLedger(deletion, workspace_2.path);

    // The second workspace's databases ledger should contain it
    expect(
      await Ledgers.read({
        ownerPath: workspace_2.path,
        type: DatabaseLedgerType,
      }),
    ).toEqual([expect.objectContaining(deletion)]);
  });
});

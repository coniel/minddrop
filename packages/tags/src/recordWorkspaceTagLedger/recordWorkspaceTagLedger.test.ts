import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Ledgers } from '@minddrop/history';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { TagLedgerType } from '../constants';
import { TagFixtures, cleanup, setup } from '../test-utils';
import { recordWorkspaceTagLedger } from './recordWorkspaceTagLedger';

const { tag_1 } = TagFixtures;
const { workspace_1, workspace_2 } = WorkspaceFixtures;

// A deletion of the first tag
const deletion = {
  kind: 'deleted' as const,
  subject: { key: tag_1.name, id: tag_1.id },
};

describe('recordWorkspaceTagLedger', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("records the change in the workspace's tags ledger", async () => {
    // Record a change
    await recordWorkspaceTagLedger(deletion);

    // The active workspace's tags ledger should contain the change
    expect(
      await Ledgers.read({ ownerPath: workspace_1.path, type: TagLedgerType }),
    ).toEqual([expect.objectContaining(deletion)]);
  });

  it('returns the recorded change', async () => {
    // Record a change
    const record = await recordWorkspaceTagLedger(deletion);

    // The returned change should be the one in the ledger
    expect(
      await Ledgers.read({ ownerPath: workspace_1.path, type: TagLedgerType }),
    ).toEqual([record]);
  });

  it('records the change in the given workspace', async () => {
    // Record a change in the second workspace
    await recordWorkspaceTagLedger(deletion, workspace_2.path);

    // The second workspace's tags ledger should contain it
    expect(
      await Ledgers.read({ ownerPath: workspace_2.path, type: TagLedgerType }),
    ).toEqual([expect.objectContaining(deletion)]);
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { TagLedgerType } from '../../constants';
import { cleanup, setup } from '../../test-utils';
import { resolveWorkspaceTagLedger } from './resolveWorkspaceTagLedger';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('resolveWorkspaceTagLedger', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("resolves the active workspace's tags ledger", () => {
    expect(resolveWorkspaceTagLedger()).toEqual({
      ownerPath: workspace_1.path,
      type: TagLedgerType,
    });
  });

  it('resolves the ledger of the given workspace', () => {
    expect(resolveWorkspaceTagLedger(workspace_2.path).ownerPath).toBe(
      workspace_2.path,
    );
  });
});

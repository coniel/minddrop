import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseLedgerType } from '../../constants';
import { DatabaseFixtures, cleanup, setup } from '../../test-utils';
import { resolveWorkspaceDatabaseLedger } from './resolveWorkspaceDatabaseLedger';

const { parentDir } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

describe('resolveWorkspaceDatabaseLedger', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("resolves the active workspace's databases ledger", () => {
    expect(resolveWorkspaceDatabaseLedger()).toEqual({
      ownerPath: parentDir,
      type: DatabaseLedgerType,
    });
  });

  it('resolves the ledger of the given workspace', () => {
    expect(resolveWorkspaceDatabaseLedger(workspace_2.path).ownerPath).toBe(
      workspace_2.path,
    );
  });
});

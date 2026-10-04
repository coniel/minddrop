import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntryLedgerType } from '../../constants';
import { DatabaseFixtures, cleanup, setup } from '../../test-utils';
import { resolveEntriesLedger } from './resolveEntriesLedger';

const { databaseDirPath, objectDatabase } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

describe('resolveEntriesLedger', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("resolves the database's entries ledger", () => {
    expect(resolveEntriesLedger(objectDatabase)).toEqual({
      ownerPath: databaseDirPath(objectDatabase),
      type: EntryLedgerType,
    });
  });

  it('resolves the owner path against the given workspace', () => {
    expect(
      resolveEntriesLedger(objectDatabase, workspace_2.path).ownerPath,
    ).toBe(`${workspace_2.path}/${objectDatabase.path}`);
  });
});

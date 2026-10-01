import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntryLedgerType } from '../../constants';
import { DatabaseFixtures, cleanup, setup } from '../../test-utils';
import { resolveDatabaseEntryLedger } from './resolveDatabaseEntryLedger';

const { databaseDirPath, objectDatabase } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

describe('resolveDatabaseEntryLedger', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("resolves the database's entries ledger", () => {
    expect(resolveDatabaseEntryLedger(objectDatabase)).toEqual({
      ownerPath: databaseDirPath(objectDatabase),
      type: EntryLedgerType,
    });
  });

  it('resolves the owner path against the given workspace', () => {
    expect(
      resolveDatabaseEntryLedger(objectDatabase, workspace_2.path).ownerPath,
    ).toBe(`${workspace_2.path}/${objectDatabase.path}`);
  });
});

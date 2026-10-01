import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { History } from '@minddrop/history';
import { ItemAddressChange } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import {
  databaseEntryAddress,
  resolveDatabaseEntryHistorySubject,
} from '../utils';
import { recordDatabaseEntriesReferenceRename } from './recordDatabaseEntriesReferenceRename';

const {
  collectionDatabase,
  collectionEntry1,
  collectionEntry2,
  historyAction_databaseRenamed,
  relatedEntry1,
  relatedEntry2,
} = DatabaseFixtures;
const { workspace_1, workspace_2 } = WorkspaceFixtures;

// The renamed state of relatedEntry1
const renamedRelated = { ...relatedEntry1, title: 'Renamed Related' };

// The change of relatedEntry1's address to its renamed one
const change: ItemAddressChange = {
  id: relatedEntry1.id,
  oldReference: databaseEntryAddress(relatedEntry1, collectionDatabase),
  newReference: databaseEntryAddress(renamedRelated, collectionDatabase),
};

describe('recordDatabaseEntriesReferenceRename', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('records the change against the entries referencing the item', async () => {
    // Record the change
    await recordDatabaseEntriesReferenceRename(change, workspace_1.id);

    // The referencing entry's history should contain the rename
    expect(
      await History.read(
        resolveDatabaseEntryHistorySubject(
          collectionDatabase,
          collectionEntry1,
        ),
      ),
    ).toEqual([
      expect.objectContaining({
        kind: 'rename',
        target: 'reference',
        from: change.oldReference,
        to: change.newReference,
      }),
    ]);
  });

  it("stamps the action on every referencing entry's record", async () => {
    // A second entry referencing the item
    DatabaseEntriesStore.set(collectionEntry2);

    // Record the change with an action
    await recordDatabaseEntriesReferenceRename(
      change,
      workspace_1.id,
      historyAction_databaseRenamed,
    );

    // Read both referencing entries' histories
    const records = await Promise.all(
      [collectionEntry1, collectionEntry2].map((entry) =>
        History.read(
          resolveDatabaseEntryHistorySubject(collectionDatabase, entry),
        ),
      ),
    );

    // Both entries' records should have the action
    expect(records.flat().map((record) => record.action)).toEqual([
      historyAction_databaseRenamed,
      historyAction_databaseRenamed,
    ]);
  });

  it('records nothing against entries not referencing the item', async () => {
    // Record the change
    await recordDatabaseEntriesReferenceRename(change, workspace_1.id);

    // relatedEntry2 is in the same database but references nothing
    expect(
      await History.read(
        resolveDatabaseEntryHistorySubject(collectionDatabase, relatedEntry2),
      ),
    ).toEqual([]);
  });

  it("records the change in the given workspace's databases", async () => {
    // The database and its entries held by the second workspace as well
    DatabasesStore.in(workspace_2.id).set(collectionDatabase);
    DatabaseEntriesStore.in(workspace_2.id).load([
      collectionEntry1,
      relatedEntry1,
      relatedEntry2,
    ]);

    // Record the change in the second workspace
    await recordDatabaseEntriesReferenceRename(change, workspace_2.id);

    // The referencing entry's history in the second workspace should
    // contain the rename.
    expect(
      await History.read(
        resolveDatabaseEntryHistorySubject(
          collectionDatabase,
          collectionEntry1,
          workspace_2.path,
        ),
      ),
    ).toHaveLength(1);
  });
});

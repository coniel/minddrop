import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { History, Ledgers } from '@minddrop/history';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseSettingsStore } from '../../DatabaseSettingsStore';
import { setDatabaseContentDefault } from '../../setDatabaseContentDefault';
import {
  sqlGetAllDatabases,
  sqlGetEntrySyncRecords,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  collectionEntry1SqlRecord,
  historyAction_databaseDeleted,
  objectDatabase,
  rootStorageDatabase,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import {
  resolveDatabaseHistorySubject,
  resolveWorkspaceDatabaseLedger,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';
import { onDeleteDatabase } from './database-deleted';

const { ownedCardDesign_1 } = DesignFixtures;

const { workspace_1 } = WorkspaceFixtures;

// The action performing the deletion
const action = historyAction_databaseDeleted;

describe('onDeleteDatabase', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the collection database record
    sqlUpsertDatabase(
      {
        id: collectionDatabase.id,
        name: collectionDatabase.name,
        path: collectionDatabase.path,
        icon: collectionDatabase.icon,
        properties: collectionDatabase.properties,
      },
      { silent: true },
    );

    // Seed one of the collection database's entry records
    sqlUpsertEntries(collectionDatabase.id, [collectionEntry1SqlRecord], {
      silent: true,
    });

    // Create virtual collections for the collection entry
    Collections.createVirtual(
      virtualCollectionId(collectionEntry1.id, 'Related'),
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
      collectionEntry1.properties.Related as string[],
    );
    Collections.createVirtual(
      virtualCollectionId(collectionEntry1.id, 'References'),
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'References',
      ),
      collectionEntry1.properties.References as string[],
    );
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it('deletes the database and its entries from SQL', async () => {
    // Delete the collection database
    await onDeleteDatabase({ ...collectionDatabase, action });

    // The database record should be gone from SQL
    expect(sqlGetAllDatabases()).not.toContainEqual(
      expect.objectContaining({ id: collectionDatabase.id }),
    );

    // The database's entry records should be cascade deleted
    expect(sqlGetEntrySyncRecords(collectionDatabase.id)).toEqual([]);
  });

  it("closes the database's history", async () => {
    // Call the handler
    await onDeleteDatabase({ ...objectDatabase, action });

    // The database's history should end with its deletion, with the
    // event's action on the record.
    expect(
      await History.read(resolveDatabaseHistorySubject(objectDatabase)),
    ).toEqual([expect.objectContaining({ kind: 'deleted', action })]);
  });

  it("records the deletion in the workspace's databases ledger", async () => {
    // Call the handler
    await onDeleteDatabase({ ...objectDatabase, action });

    // The ledger should record the deletion under the database's name,
    // with its ID and the event's action.
    expect(await Ledgers.read(resolveWorkspaceDatabaseLedger())).toEqual([
      expect.objectContaining({
        kind: 'deleted',
        subject: { key: objectDatabase.name, id: objectDatabase.id },
        action,
      }),
    ]);
  });

  it("deletes the database's designs", async () => {
    // Load a design owned by the database
    Designs.load(
      [{ ...ownedCardDesign_1, owner: objectDatabase.id }],
      workspace_1.id,
    );

    await onDeleteDatabase({ ...objectDatabase, action });

    expect(Designs.getByOwner(objectDatabase.id)).toEqual([]);
  });

  it('does nothing if the database has no collection properties', async () => {
    // Delete a database without collection properties
    await onDeleteDatabase({ ...objectDatabase, action });

    // Virtual collections should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).not.toBeNull();
  });

  it('deletes all virtual collections for the database entries', async () => {
    // Delete the collection database
    await onDeleteDatabase({ ...collectionDatabase, action });

    // All virtual collections should be deleted
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const references = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    expect(related).toBeNull();
    expect(references).toBeNull();
  });

  it("removes the database's entries from collections referencing them", async () => {
    // Delete the database containing referenceEntry1, which is
    // referenced by collectionEntry1's References collection.
    await onDeleteDatabase({ ...rootStorageDatabase, action });

    const references = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    expect(references.items).toEqual([]);
  });

  it('unsets the content defaults set to the database', async () => {
    // Set the database as the text default
    setDatabaseContentDefault('text', objectDatabase.id);

    // Delete the database
    await onDeleteDatabase({ ...objectDatabase, action });

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ text: null }),
    );
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { History } from '@minddrop/history';
import { sqlGetAllEntriesFull, sqlUpsertDatabase } from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  collectionEntry1SqlRecord,
  objectDatabase,
  objectEntry1,
  objectEntry1SqlRecord,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onCreateEntry } from './entry-created';

describe('onCreateEntry', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the database records the created entries belong to
    [objectDatabase, collectionDatabase].forEach((database) => {
      sqlUpsertDatabase(
        {
          id: database.id,
          name: database.name,
          path: database.path,
          icon: database.icon,
        },
        { silent: true },
      );
    });
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanup();
  });

  it('does nothing if the database has no collection properties', async () => {
    // Call the handler with an entry from a database without collection properties
    await onCreateEntry(objectEntry1);

    // No virtual collections should have been created
    const collections = Collections.Store.getAllArray();
    expect(collections.length).toBe(0);
  });

  it('upserts the entry into SQL', async () => {
    // Call the handler
    await onCreateEntry(objectEntry1);

    // The entry record and its properties should be in SQL
    expect(sqlGetAllEntriesFull()).toContainEqual(objectEntry1SqlRecord);
  });

  it('upserts collection property values into SQL', async () => {
    // Call the handler with an entry holding collection properties
    await onCreateEntry(collectionEntry1);

    // The record should carry the collection membership values
    expect(sqlGetAllEntriesFull()).toContainEqual(collectionEntry1SqlRecord);
  });

  it('creates a virtual collection for each collection property', async () => {
    // Call the handler
    await onCreateEntry(collectionEntry1);

    // Virtual collections should exist for each collection property
    const relatedCollection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const referencesCollection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    expect(relatedCollection).not.toBeNull();
    expect(relatedCollection?.virtual).toBe(true);
    expect(referencesCollection).not.toBeNull();
    expect(referencesCollection?.virtual).toBe(true);
  });

  it('names collections as [database] - [entry] - [property]', async () => {
    // Call the handler
    await onCreateEntry(collectionEntry1);

    // Get the created collections
    const relatedCollection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const referencesCollection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    // Collection names should follow the naming convention
    expect(relatedCollection?.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
    );
    expect(referencesCollection?.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'References',
      ),
    );
  });

  it('populates collections with entry IDs from properties', async () => {
    // Call the handler
    await onCreateEntry(collectionEntry1);

    // Get the created collections
    const relatedCollection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const referencesCollection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    // Collection entries should match the property values
    expect(relatedCollection?.items).toEqual(
      collectionEntry1.properties.Related,
    );
    expect(referencesCollection?.items).toEqual(
      collectionEntry1.properties.References,
    );
  });

  it("opens the entry's history", async () => {
    await onCreateEntry(objectEntry1);

    expect(
      await History.read({
        ownerPath: objectDatabase.path,
        subjectKey: objectEntry1.title,
      }),
    ).toEqual([expect.objectContaining({ kind: 'created' })]);
  });
});

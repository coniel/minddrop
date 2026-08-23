import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntry } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { cleanup, setup } from '../test-utils';
import { resolveEntryReference } from './resolveEntryReference';

const { objectDatabase, objectEntry1, rootStorageDatabase, rootStorageEntry1 } =
  DatabaseFixtures;

describe('resolveEntryReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('references an entry with a unique title by its title alone', () => {
    const reference = resolveEntryReference(rootStorageEntry1);

    expect(reference.reference).toBe(rootStorageEntry1.title);
  });

  it('qualifies a title shared by entries in more than one database', () => {
    // objectEntry1's title is shared with entries in other databases
    const reference = resolveEntryReference(objectEntry1);

    expect(reference.reference).toBe(
      `${objectDatabase.name}/${objectEntry1.title}`,
    );
  });

  it('falls back to the title when the database is missing', () => {
    // An entry pointing at a database which is not loaded
    const orphanedEntry: DatabaseEntry = {
      ...objectEntry1,
      database: 'database_missing',
    };

    const reference = resolveEntryReference(orphanedEntry);

    expect(reference.reference).toBe(orphanedEntry.title);
    expect(reference.description).toBeUndefined();
  });

  it('labels the reference with the entry title', () => {
    // The label reads as the title even when the reference is qualified
    const reference = resolveEntryReference(objectEntry1);

    expect(reference.label).toBe(objectEntry1.title);
  });

  it('describes the reference with the database name', () => {
    const reference = resolveEntryReference(rootStorageEntry1);

    expect(reference.description).toBe(rootStorageDatabase.name);
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  cleanup,
  databaseDirPath,
  entryStorageDatabase,
  entryStorageEntry1,
  imagePropertyName,
  propertyStorageDatabase,
  propertyStorageEntry1,
  rootStorageDatabase,
  rootStorageEntry1,
  setup,
} from '../../test-utils';
import { findEntryPropertyFileOwner } from './findEntryPropertyFileOwner';

// The file name each storage mode's entry holds in its image property
const rootStorageFile = rootStorageEntry1.properties[imagePropertyName];
const propertyStorageFile = propertyStorageEntry1.properties[imagePropertyName];
const entryStorageFile = entryStorageEntry1.properties[imagePropertyName];

describe('findEntryPropertyFileOwner', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('finds the entry property holding a file in the database root', () => {
    expect(
      findEntryPropertyFileOwner(
        `${databaseDirPath(rootStorageDatabase)}/${rootStorageFile}`,
      ),
    ).toEqual({ entryId: rootStorageEntry1.id, property: imagePropertyName });
  });

  it('finds the entry property holding a file in a property directory', () => {
    expect(
      findEntryPropertyFileOwner(
        `${databaseDirPath(propertyStorageDatabase)}/${imagePropertyName}/${propertyStorageFile}`,
      ),
    ).toEqual({
      entryId: propertyStorageEntry1.id,
      property: imagePropertyName,
    });
  });

  it('finds the entry property holding a file in an entry directory', () => {
    expect(
      findEntryPropertyFileOwner(
        `${databaseDirPath(entryStorageDatabase)}/${entryStorageEntry1.title}/${entryStorageFile}`,
      ),
    ).toEqual({ entryId: entryStorageEntry1.id, property: imagePropertyName });
  });

  it('returns the first of the entries sharing a file', () => {
    // A second entry in the root storage database holding the same file
    DatabaseEntriesStore.set({
      ...rootStorageEntry1,
      id: 'database-entry_root-storage-entry-2',
      title: 'Root Storage Entry 2',
    });

    expect(
      findEntryPropertyFileOwner(
        `${databaseDirPath(rootStorageDatabase)}/${rootStorageFile}`,
      ),
    ).toEqual({ entryId: rootStorageEntry1.id, property: imagePropertyName });
  });

  it('returns null for a file no entry property holds', () => {
    expect(
      findEntryPropertyFileOwner(
        `${databaseDirPath(rootStorageDatabase)}/missing.png`,
      ),
    ).toBeNull();
  });

  it('returns null for a file outside every database', () => {
    expect(findEntryPropertyFileOwner('/elsewhere/image.png')).toBe(null);
  });
});

import { describe, expect, it } from 'vitest';
import {
  collectionDatabase,
  collectionEntry1,
  collectionEntry1SqlRecord,
  objectDatabase,
  objectEntry1,
  objectEntry1SqlRecord,
  rootStorageDatabase,
  rootStorageEntry_empty_value,
  rootStorageEntrySqlRecord_empty_value,
  timestampDatabase,
  timestampEntry1,
  timestampEntry1SqlRecord,
  urlDatabase,
  urlEntry1,
  urlEntry1SqlRecord,
} from '../../test-utils/fixtures';
import { convertEntryToSqlRecord } from './convertEntryToSqlRecord';

describe('convertEntryToSqlRecord', () => {
  it('converts text and icon properties', () => {
    expect(convertEntryToSqlRecord(objectEntry1, objectDatabase)).toEqual(
      objectEntry1SqlRecord,
    );
  });

  it('converts url properties', () => {
    expect(convertEntryToSqlRecord(urlEntry1, urlDatabase)).toEqual(
      urlEntry1SqlRecord,
    );
  });

  it('converts date properties to epoch ms', () => {
    expect(
      convertEntryToSqlRecord(timestampEntry1, timestampDatabase),
    ).toEqual(timestampEntry1SqlRecord);
  });

  it('converts collection properties to string arrays', () => {
    expect(
      convertEntryToSqlRecord(collectionEntry1, collectionDatabase),
    ).toEqual(collectionEntry1SqlRecord);
  });

  it('handles entries with no properties', () => {
    expect(
      convertEntryToSqlRecord(rootStorageEntry_empty_value, rootStorageDatabase),
    ).toEqual(rootStorageEntrySqlRecord_empty_value);
  });
});

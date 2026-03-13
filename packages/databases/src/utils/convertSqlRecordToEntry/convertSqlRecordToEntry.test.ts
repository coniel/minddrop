import { describe, expect, it } from 'vitest';
import {
  collectionEntry1,
  collectionEntry1SqlRecord,
  objectEntry1,
  objectEntry1SqlRecord,
  rootStorageEntry_empty_value,
  rootStorageEntrySqlRecord_empty_value,
  timestampEntry1,
  timestampEntry1SqlRecord,
} from '../../test-utils/fixtures';
import type { SqlEntryRecord } from '../../types';
import { convertSqlRecordToEntry } from './convertSqlRecordToEntry';

describe('convertSqlRecordToEntry', () => {
  it('converts a SQL record with text properties', () => {
    expect(convertSqlRecordToEntry(objectEntry1SqlRecord)).toEqual(
      objectEntry1,
    );
  });

  it('converts date properties from epoch ms to Date', () => {
    expect(convertSqlRecordToEntry(timestampEntry1SqlRecord)).toEqual(
      timestampEntry1,
    );
  });

  it('converts multi-value properties', () => {
    expect(convertSqlRecordToEntry(collectionEntry1SqlRecord)).toEqual(
      collectionEntry1,
    );
  });

  it('converts number properties', () => {
    const record: SqlEntryRecord = {
      ...objectEntry1SqlRecord,
      properties: [{ name: 'Rating', type: 'number', value: 4.5 }],
    };

    const entry = convertSqlRecordToEntry(record);

    expect(entry.properties.Rating).toBe(4.5);
  });

  it('converts toggle properties from integer to boolean', () => {
    const record: SqlEntryRecord = {
      ...objectEntry1SqlRecord,
      properties: [
        { name: 'Read', type: 'toggle', value: 1 },
        { name: 'Archived', type: 'toggle', value: 0 },
      ],
    };

    const entry = convertSqlRecordToEntry(record);

    expect(entry.properties.Read).toBe(true);
    expect(entry.properties.Archived).toBe(false);
  });

  it('handles entries with no properties', () => {
    expect(
      convertSqlRecordToEntry(rootStorageEntrySqlRecord_empty_value),
    ).toEqual(rootStorageEntry_empty_value);
  });

  it('parses metadata with restoreDates', () => {
    const record: SqlEntryRecord = {
      ...objectEntry1SqlRecord,
      metadata: JSON.stringify({
        views: {
          'design-1:Content': {
            options: { sortBy: 'title' },
          },
        },
        designOverrides: { 'view-1': 'design-2' },
      }),
    };

    const entry = convertSqlRecordToEntry(record);

    expect(entry.metadata).toEqual({
      views: {
        'design-1:Content': { options: { sortBy: 'title' } },
      },
      designOverrides: { 'view-1': 'design-2' },
    });
  });
});

import { describe, expect, it } from 'vitest';
import {
  collectionDatabase,
  collectionEntry1,
  collectionEntry1SqlRecord,
  entryTemplatesDatabase,
  objectDatabase,
  objectEntry1,
  objectEntry1SqlRecord,
  rootStorageDatabase,
  rootStorageEntrySqlRecord_empty_value,
  rootStorageEntry_empty_value,
  timestampDatabase,
  timestampEntry1,
  timestampEntry1SqlRecord,
} from '../../test-utils/fixtures';
import type { Database, SqlEntryRecord } from '../../types';
import { convertSqlRecordToEntry } from './convertSqlRecordToEntry';

describe('convertSqlRecordToEntry', () => {
  it('converts a SQL record with text properties', () => {
    expect(
      convertSqlRecordToEntry(objectEntry1SqlRecord, objectDatabase),
    ).toEqual(objectEntry1);
  });

  it('converts date properties from epoch ms to Date', () => {
    expect(
      convertSqlRecordToEntry(timestampEntry1SqlRecord, timestampDatabase),
    ).toEqual(timestampEntry1);
  });

  it('converts multi-value properties', () => {
    expect(
      convertSqlRecordToEntry(collectionEntry1SqlRecord, collectionDatabase),
    ).toEqual(collectionEntry1);
  });

  it('converts tags properties', () => {
    const record: SqlEntryRecord = {
      ...objectEntry1SqlRecord,
      properties: [{ name: 'Tags', type: 'tags', value: ['Urgent', 'Home'] }],
    };

    const entry = convertSqlRecordToEntry(record, objectDatabase);

    // The tags value should restore to a string array
    expect(entry.properties.Tags).toEqual(['Urgent', 'Home']);
  });

  it('unwraps single select properties', () => {
    const record: SqlEntryRecord = {
      ...objectEntry1SqlRecord,
      properties: [{ name: 'Status', type: 'select', value: ['Todo'] }],
    };

    const entry = convertSqlRecordToEntry(record, entryTemplatesDatabase);

    expect(entry.properties.Status).toBe('Todo');
  });

  it('keeps multi select properties as arrays', () => {
    const database: Database = {
      ...entryTemplatesDatabase,
      properties: entryTemplatesDatabase.properties.map((schema) =>
        schema.type === 'select' ? { ...schema, multiselect: true } : schema,
      ),
    };
    const record: SqlEntryRecord = {
      ...objectEntry1SqlRecord,
      properties: [{ name: 'Status', type: 'select', value: ['Todo', 'Done'] }],
    };

    const entry = convertSqlRecordToEntry(record, database);

    expect(entry.properties.Status).toEqual(['Todo', 'Done']);
  });

  it('converts number properties', () => {
    const record: SqlEntryRecord = {
      ...objectEntry1SqlRecord,
      properties: [{ name: 'Rating', type: 'number', value: 4.5 }],
    };

    const entry = convertSqlRecordToEntry(record, objectDatabase);

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

    const entry = convertSqlRecordToEntry(record, objectDatabase);

    expect(entry.properties.Read).toBe(true);
    expect(entry.properties.Archived).toBe(false);
  });

  it('handles entries with no properties', () => {
    expect(
      convertSqlRecordToEntry(
        rootStorageEntrySqlRecord_empty_value,
        rootStorageDatabase,
      ),
    ).toEqual(rootStorageEntry_empty_value);
  });

  it('parses metadata with restoreDates', () => {
    const record: SqlEntryRecord = {
      ...objectEntry1SqlRecord,
      metadata: JSON.stringify({
        embeddedViewConfigs: {
          'layout-1:Content': {
            options: { sortBy: 'title' },
          },
        },
      }),
    };

    const entry = convertSqlRecordToEntry(record, objectDatabase);

    expect(entry.metadata).toEqual({
      embeddedViewConfigs: {
        'layout-1:Content': { options: { sortBy: 'title' } },
      },
    });
  });
});

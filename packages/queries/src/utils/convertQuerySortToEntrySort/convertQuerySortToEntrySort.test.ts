import { describe, expect, it } from 'vitest';
import { Database, DatabaseFixtures } from '@minddrop/databases';
import { initializeI18n } from '@minddrop/i18n';
import { convertQuerySortToEntrySort } from './convertQuerySortToEntrySort';

// Initialize translations used for the implicit title property
initializeI18n();

const { objectDatabase } = DatabaseFixtures;

const database: Database = {
  ...objectDatabase,
  properties: [
    { type: 'text', name: 'Name' },
    { type: 'number', name: 'Amount' },
  ],
};

describe('convertQuerySortToEntrySort', () => {
  it('resolves property types from the schema', () => {
    const result = convertQuerySortToEntrySort(
      [
        { property: 'Amount', direction: 'descending' },
        { property: 'Name', direction: 'ascending' },
      ],
      database,
    );

    expect(result).toEqual([
      { property: 'Amount', propertyType: 'number', direction: 'descending' },
      { property: 'Name', propertyType: 'text', direction: 'ascending' },
    ]);
  });

  it('resolves the implicit title property', () => {
    const result = convertQuerySortToEntrySort(
      [{ property: 'Title', direction: 'ascending' }],
      database,
    );

    expect(result).toEqual([
      { property: 'Title', propertyType: 'title', direction: 'ascending' },
    ]);
  });

  it('drops sorts on missing properties', () => {
    const result = convertQuerySortToEntrySort(
      [{ property: 'Removed', direction: 'ascending' }],
      database,
    );

    expect(result).toEqual([]);
  });
});

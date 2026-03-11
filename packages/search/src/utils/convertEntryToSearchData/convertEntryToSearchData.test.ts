import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { convertEntryToSearchData } from './convertEntryToSearchData';

const {
  objectDatabase,
  objectEntry1,
  urlDatabase,
  urlEntry1,
  collectionDatabase,
  collectionEntry1,
  noPropertiesDatabase,
  rootStorageEntry_empty_value,
} = DatabaseFixtures;

describe('convertEntryToSearchData', () => {
  it('converts core entry fields', () => {
    const result = convertEntryToSearchData(objectEntry1, objectDatabase);

    expect(result.id).toBe(objectEntry1.id);
    expect(result.databaseId).toBe(objectEntry1.database);
    expect(result.path).toBe(objectEntry1.path);
    expect(result.title).toBe(objectEntry1.title);
    expect(result.created).toBe(objectEntry1.created.getTime());
    expect(result.lastModified).toBe(objectEntry1.lastModified.getTime());
  });

  it('converts text properties using the database schema', () => {
    const result = convertEntryToSearchData(objectEntry1, objectDatabase);

    // objectDatabase has 'formatted-text' Content and 'icon' Icon
    expect(result.properties).toContainEqual({
      name: 'Content',
      type: 'formatted-text',
      value: 'Test content',
    });
    expect(result.properties).toContainEqual({
      name: 'Icon',
      type: 'icon',
      value: 'content-icon:shapes:blue',
    });
  });

  it('converts url properties', () => {
    const result = convertEntryToSearchData(urlEntry1, urlDatabase);

    expect(result.properties).toContainEqual({
      name: 'URL',
      type: 'url',
      value: 'https://example.com/some-page',
    });
  });

  it('converts collection properties to string arrays', () => {
    const result = convertEntryToSearchData(
      collectionEntry1,
      collectionDatabase,
    );

    expect(result.properties).toContainEqual({
      name: 'Related',
      type: 'collection',
      value: ['related-entry-1', 'related-entry-2'],
    });
    expect(result.properties).toContainEqual({
      name: 'References',
      type: 'collection',
      value: ['reference-entry-1'],
    });
  });

  it('skips null and undefined property values', () => {
    const result = convertEntryToSearchData(
      rootStorageEntry_empty_value,
      noPropertiesDatabase,
    );

    expect(result.properties).toEqual([]);
  });

  it('converts boolean properties', () => {
    const database = {
      ...objectDatabase,
      properties: [{ type: 'toggle' as const, name: 'Done' }],
    };
    const entry = {
      ...objectEntry1,
      properties: { Done: true },
    };

    const result = convertEntryToSearchData(entry, database);

    expect(result.properties).toContainEqual({
      name: 'Done',
      type: 'toggle',
      value: true,
    });
  });

  it('converts number properties', () => {
    const database = {
      ...objectDatabase,
      properties: [{ type: 'number' as const, name: 'Rating' }],
    };
    const entry = {
      ...objectEntry1,
      properties: { Rating: 4.5 },
    };

    const result = convertEntryToSearchData(entry, database);

    expect(result.properties).toContainEqual({
      name: 'Rating',
      type: 'number',
      value: 4.5,
    });
  });

  it('converts date properties to epoch milliseconds', () => {
    const date = new Date('2024-06-15T12:00:00.000Z');
    const database = {
      ...objectDatabase,
      properties: [{ type: 'date' as const, name: 'Due' }],
    };
    const entry = {
      ...objectEntry1,
      properties: { Due: date },
    };

    const result = convertEntryToSearchData(entry, database);

    expect(result.properties).toContainEqual({
      name: 'Due',
      type: 'date',
      value: date.getTime(),
    });
  });

  it('converts date string values to epoch milliseconds', () => {
    const dateString = '2024-06-15T12:00:00.000Z';
    const database = {
      ...objectDatabase,
      properties: [{ type: 'date' as const, name: 'Due' }],
    };
    const entry = {
      ...objectEntry1,
      properties: { Due: dateString },
    };

    const result = convertEntryToSearchData(entry, database);

    expect(result.properties).toContainEqual({
      name: 'Due',
      type: 'date',
      value: new Date(dateString).getTime(),
    });
  });

  it('converts multi-select properties to string arrays', () => {
    const database = {
      ...objectDatabase,
      properties: [
        {
          type: 'select' as const,
          name: 'Status',
          options: [
            { value: 'Active', color: 'green' as const },
            { value: 'Urgent', color: 'red' as const },
          ],
        },
      ],
    };
    const entry = {
      ...objectEntry1,
      properties: { Status: ['Active', 'Urgent'] },
    };

    const result = convertEntryToSearchData(entry, database);

    expect(result.properties).toContainEqual({
      name: 'Status',
      type: 'select',
      value: ['Active', 'Urgent'],
    });
  });

  it('wraps single select values in an array', () => {
    const database = {
      ...objectDatabase,
      properties: [
        {
          type: 'select' as const,
          name: 'Priority',
          options: [
            { value: 'High', color: 'red' as const },
            { value: 'Low', color: 'gray' as const },
          ],
        },
      ],
    };
    const entry = {
      ...objectEntry1,
      properties: { Priority: 'High' },
    };

    const result = convertEntryToSearchData(entry, database);

    expect(result.properties).toContainEqual({
      name: 'Priority',
      type: 'select',
      value: ['High'],
    });
  });

  it('passes through numeric date values as-is', () => {
    const epochMs = 1718452800000;
    const database = {
      ...objectDatabase,
      properties: [{ type: 'date' as const, name: 'Due' }],
    };
    const entry = {
      ...objectEntry1,
      properties: { Due: epochMs },
    };

    const result = convertEntryToSearchData(entry, database);

    expect(result.properties).toContainEqual({
      name: 'Due',
      type: 'date',
      value: epochMs,
    });
  });
});

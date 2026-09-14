import { describe, expect, it } from 'vitest';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import '../../test-utils';
import { resolveCreateOptions } from './resolveCreateOptions';

const { objectDatabase, entryTemplatesDatabase, entryTemplate1 } =
  DatabaseFixtures;
const { dataViewType_table } = DataViewFixtures;

// The options the query matched, by label
function labels(query: string, options = {}): string[] {
  return resolveCreateOptions({
    query,
    viewTypes: [],
    databases: [],
    templates: [],
    ...options,
  }).map((option) => option.label);
}

describe('resolveCreateOptions', () => {
  it('matches the options which exist whatever the workspace holds', () => {
    expect(labels('space')).toEqual(['Space']);
  });

  it('leaves out the options the query does not match', () => {
    expect(labels('space')).not.toContain('Database');
  });

  it('matches a data view type by name', () => {
    expect(labels('table', { viewTypes: [dataViewType_table] })).toEqual([
      dataViewType_table.name,
    ]);
  });

  it('matches a database by the name of its entries', () => {
    expect(labels('object', { databases: [objectDatabase] })).toEqual([
      objectDatabase.entryName,
    ]);
  });

  it('matches a database by its own name', () => {
    // The database is named "Objects", its entries "Object", so the
    // plural only matches the database itself.
    expect(labels('objects', { databases: [objectDatabase] })).toEqual([
      objectDatabase.entryName,
    ]);
  });

  it('matches a template by name, naming the entry it makes', () => {
    expect(
      labels('template one', {
        templates: [
          { database: entryTemplatesDatabase, template: entryTemplate1 },
        ],
      }),
    ).toEqual([`${entryTemplatesDatabase.entryName} · Template One`]);
  });

  it('ranks every kind of option against the others', () => {
    const matched = labels('temp', {
      viewTypes: [dataViewType_table],
      databases: [objectDatabase],
      templates: [
        { database: entryTemplatesDatabase, template: entryTemplate1 },
      ],
    });

    // The template is listed on its own merit rather than after the
    // options of every other kind.
    expect(matched).toEqual([
      `${entryTemplatesDatabase.entryName} · Template One`,
    ]);
  });

  it('returns the options which create what they stand for', () => {
    const [option] = resolveCreateOptions({
      query: 'object',
      viewTypes: [],
      databases: [objectDatabase],
      templates: [],
    });

    expect(option.action).toEqual({
      type: 'entry',
      databaseId: objectDatabase.id,
    });
  });

  it('returns the template options which create from the template', () => {
    const [option] = resolveCreateOptions({
      query: 'template one',
      viewTypes: [],
      databases: [],
      templates: [
        { database: entryTemplatesDatabase, template: entryTemplate1 },
      ],
    });

    expect(option.action).toEqual({
      type: 'entry',
      databaseId: entryTemplatesDatabase.id,
      templateId: entryTemplate1.id,
    });
  });
});

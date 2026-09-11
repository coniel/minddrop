import { describe, expect, it } from 'vitest';
import { PropertyFilter } from '@minddrop/properties';
import { objectEntry1 } from '../../test-utils';
import { DatabaseEntry } from '../../types';
import { filterDatabaseEntries } from './filterDatabaseEntries';

const done: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_done',
  title: 'Finished task',
  created: new Date(2026, 5, 15),
  properties: { Status: 'Done' },
};

const todo: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_todo',
  title: 'Pending task',
  created: new Date(2026, 5, 1),
  properties: { Status: 'Todo' },
};

const entries = [done, todo];

describe('filterDatabaseEntries', () => {
  it('filters by property value', () => {
    const filter: PropertyFilter = {
      property: 'Status',
      propertyType: 'select',
      operator: 'is',
      value: 'Done',
    };

    expect(filterDatabaseEntries(entries, [filter])).toEqual([done]);
  });

  it('reads metadata properties by type regardless of name', () => {
    const filter: PropertyFilter = {
      property: 'Titel',
      propertyType: 'title',
      operator: 'contains',
      value: 'pending',
    };

    expect(filterDatabaseEntries(entries, [filter])).toEqual([todo]);
  });

  it('reads date metadata by type', () => {
    const filter: PropertyFilter = {
      property: 'Created',
      propertyType: 'created',
      operator: 'is',
      value: { type: 'relative', preset: 'today' },
    };

    expect(
      filterDatabaseEntries(entries, [filter], new Date(2026, 5, 15, 12)),
    ).toEqual([done]);
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyFilter } from '@minddrop/properties';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { cleanup, objectEntry1, setup } from '../../test-utils';
import { DatabaseEntry } from '../../types';
import { filterDatabaseEntryIds } from './filterDatabaseEntryIds';

const done: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_done',
  properties: { Status: 'Done' },
};

const todo: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_todo',
  properties: { Status: 'Todo' },
};

const isDone: PropertyFilter = {
  property: 'Status',
  propertyType: 'select',
  operator: 'is',
  value: 'Done',
};

describe('filterDatabaseEntryIds', () => {
  beforeEach(() => {
    setup();

    DatabaseEntriesStore.load([done, todo]);
  });

  afterEach(cleanup);

  it('returns the IDs unchanged without filters', () => {
    const ids = [todo.id, done.id];

    expect(filterDatabaseEntryIds(ids, [])).toBe(ids);
  });

  it('keeps the IDs of matching entries', () => {
    expect(filterDatabaseEntryIds([todo.id, done.id], [isDone])).toEqual([
      done.id,
    ]);
  });

  it('drops IDs of other item types', () => {
    expect(
      filterDatabaseEntryIds(['collection_1', todo.id, done.id], [isDone]),
    ).toEqual([done.id]);
  });

  it('drops IDs of entries missing from the store', () => {
    expect(
      filterDatabaseEntryIds(['database-entry_missing', done.id], [isDone]),
    ).toEqual([done.id]);
  });
});

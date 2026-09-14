import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Filters, PropertyFilter } from '@minddrop/filters';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { cleanup, objectDatabase, objectEntry1, setup } from '../test-utils';
import { DatabaseEntry } from '../types';

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

// The test setup registers the entry filter adapter
describe('registerDatabaseEntryFilterAdapter', () => {
  beforeEach(() => {
    setup();

    DatabaseEntriesStore.load([done, todo]);
  });

  afterEach(cleanup);

  it('filters entries by property value', () => {
    const filter: PropertyFilter = {
      property: 'Status',
      propertyType: 'select',
      operator: 'is',
      value: 'Done',
    };

    expect(Filters.filterIds([todo.id, done.id], [filter])).toEqual([done.id]);
  });

  it('reads metadata properties by type regardless of name', () => {
    const filter: PropertyFilter = {
      property: 'Titel',
      propertyType: 'title',
      operator: 'contains',
      value: 'pending',
    };

    expect(Filters.filterIds([todo.id, done.id], [filter])).toEqual([todo.id]);
  });

  it('reads date metadata by type', () => {
    const filter: PropertyFilter = {
      property: 'Created',
      propertyType: 'created',
      operator: 'is-after',
      value: { type: 'absolute', date: new Date(2026, 5, 10) },
    };

    expect(Filters.filterIds([todo.id, done.id], [filter])).toEqual([done.id]);
  });

  it('lists entries by title and icon', () => {
    expect(Filters.listItems()).toContainEqual({
      id: done.id,
      label: done.title,
      icon: objectDatabase.icon,
    });
  });

  it('labels entries by title', () => {
    const filter: PropertyFilter = {
      property: 'Related',
      propertyType: 'collection',
      operator: 'contains-any',
      value: [done.id],
    };

    expect(
      Filters.formatValue(filter, { type: 'collection', name: 'Related' }),
    ).toBe(done.title);
  });
});

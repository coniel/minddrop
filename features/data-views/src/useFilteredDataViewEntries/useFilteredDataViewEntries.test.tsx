import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseEntries, DatabaseEntry } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { PropertyFilter } from '@minddrop/properties';
import {
  act,
  cleanup as cleanupRender,
  renderHook,
} from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { useFilteredDataViewEntries } from './useFilteredDataViewEntries';

const { dataView_gallery_1, dataViewType_table, dataViewType_gallery } =
  DataViewFixtures;

// A view of a filterable type
const tableView: DataView = {
  ...dataView_gallery_1,
  type: dataViewType_table.type,
};
const { objectEntry1 } = DatabaseFixtures;

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

const entries = [todo.id, done.id];

// Stable across renders so that the hook's memoisation is exercised
const doneView = viewWithFilters([isDone]);

describe('useFilteredDataViewEntries', () => {
  beforeEach(() => {
    setup();

    DatabaseEntries.Store.load([done, todo]);
  });

  afterEach(async () => {
    cleanupRender();
    await cleanup();
  });

  it('returns the entries unchanged without filters', () => {
    const { result } = renderHook(() =>
      useFilteredDataViewEntries(tableView, entries),
    );

    expect(result.current).toBe(entries);
  });

  it('returns the entries unchanged for unfilterable view types', () => {
    const { result } = renderHook(() =>
      useFilteredDataViewEntries(
        {
          ...dataView_gallery_1,
          type: dataViewType_gallery.type,
          options: { filters: [isDone] },
        },
        entries,
      ),
    );

    expect(result.current).toBe(entries);
  });

  it('keeps the entries matching the filters', () => {
    const { result } = renderHook(() =>
      useFilteredDataViewEntries(doneView, entries),
    );

    expect(result.current).toEqual([done.id]);
  });

  it('drops the entries not matching the filters', () => {
    const isArchived: PropertyFilter = { ...isDone, value: 'Archived' };

    const { result } = renderHook(() =>
      useFilteredDataViewEntries(viewWithFilters([isArchived]), entries),
    );

    expect(result.current).toEqual([]);
  });

  it('re-runs the filters when an entry changes', () => {
    const { result } = renderHook(() =>
      useFilteredDataViewEntries(doneView, entries),
    );

    act(() => {
      DatabaseEntries.Store.update(todo.id, { properties: { Status: 'Done' } });
    });

    expect(result.current).toEqual(entries);
  });
});

/**
 * Returns the table view fixture with the given filters.
 */
function viewWithFilters(filters: PropertyFilter[]): DataView {
  return { ...tableView, options: { filters } };
}

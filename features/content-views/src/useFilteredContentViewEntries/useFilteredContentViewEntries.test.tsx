import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentView } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseEntries, DatabaseEntry } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { PropertyFilter } from '@minddrop/filters';
import {
  act,
  cleanup as cleanupRender,
  renderHook,
} from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { useFilteredContentViewEntries } from './useFilteredContentViewEntries';

const {
  contentView_gallery_1,
  contentViewType_table,
  contentViewType_gallery,
} = ContentViewFixtures;

// A view of a filterable type
const tableView: ContentView = {
  ...contentView_gallery_1,
  type: contentViewType_table.type,
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

describe('useFilteredContentViewEntries', () => {
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
      useFilteredContentViewEntries(tableView, entries),
    );

    expect(result.current).toBe(entries);
  });

  it('returns the entries unchanged for unfilterable view types', () => {
    const { result } = renderHook(() =>
      useFilteredContentViewEntries(
        {
          ...contentView_gallery_1,
          type: contentViewType_gallery.type,
          options: { filters: [isDone] },
        },
        entries,
      ),
    );

    expect(result.current).toBe(entries);
  });

  it('keeps the entries matching the filters', () => {
    const { result } = renderHook(() =>
      useFilteredContentViewEntries(doneView, entries),
    );

    expect(result.current).toEqual([done.id]);
  });

  it('drops the entries not matching the filters', () => {
    const isArchived: PropertyFilter = { ...isDone, value: 'Archived' };

    const { result } = renderHook(() =>
      useFilteredContentViewEntries(viewWithFilters([isArchived]), entries),
    );

    expect(result.current).toEqual([]);
  });

  it('re-runs the filters when an entry changes', () => {
    const { result } = renderHook(() =>
      useFilteredContentViewEntries(doneView, entries),
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
function viewWithFilters(filters: PropertyFilter[]): ContentView {
  return { ...tableView, options: { filters } };
}

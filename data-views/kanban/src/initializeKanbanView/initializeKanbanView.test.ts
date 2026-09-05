import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DataView, DataViews } from '@minddrop/data-views';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { statusProperty } from '../test-utils';
import { KanbanViewData, KanbanViewOptions } from '../types';
import { initializeKanbanView } from './initializeKanbanView';

const { entryTemplatesDatabase } = DatabaseFixtures;

// A kanban view grouped by the fixture database's 'Status'
// property, virtual so that updates skip the file system.
const kanbanView: DataView<KanbanViewOptions, KanbanViewData> = {
  id: 'data-view_kanban-1',
  virtual: true,
  owner: entryTemplatesDatabase.id,
  name: 'Kanban',
  type: 'kanban',
  icon: 'content-icon:square-kanban:default',
  dataSource: { type: 'database', id: entryTemplatesDatabase.id },
  options: { groupBy: 'Status', hiddenOptions: ['Todo'] },
  data: { order: { Todo: ['entry-1'], '': ['entry-2'] } },
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
};

// A kanban view over a different database, which the handlers
// leave untouched.
const otherDatabaseView: DataView<KanbanViewOptions, KanbanViewData> = {
  ...kanbanView,
  id: 'data-view_kanban-2',
  dataSource: { type: 'database', id: 'database_other' },
};

// The 'Status' property with its 'Todo' option renamed
const renamedOptionProperty = {
  ...statusProperty,
  options: statusProperty.options.map((option) =>
    option.value === 'Todo' ? { ...option, value: 'Doing' } : option,
  ),
};

// Removes the registered event listeners after each test
let cleanupListeners: VoidFunction;

/**
 * Retrieves a kanban view typed with the kanban options and data.
 *
 * @param id - The ID of the view to retrieve.
 * @returns The kanban view.
 */
function getKanbanView(
  id: string,
): DataView<KanbanViewOptions, KanbanViewData> {
  return DataViews.getOfType<KanbanViewOptions, KanbanViewData>('kanban').find(
    (view) => view.id === id,
  )!;
}

describe('initializeKanbanView', () => {
  beforeEach(() => {
    // Add the kanban views to the store
    DataViews.Store.set(kanbanView);
    DataViews.Store.set(otherDatabaseView);

    // Register the event handlers
    cleanupListeners = initializeKanbanView();
  });

  afterEach(() => {
    cleanupListeners();
    DataViews.Store.clear();
  });

  it('follows group property renames', async () => {
    Events.dispatch(Databases.events.propertyRenamed, {
      original: entryTemplatesDatabase,
      updated: entryTemplatesDatabase,
      oldName: 'Status',
      newName: 'Stage',
    });

    // The handler runs queued rather than during the dispatch
    await vi.waitFor(() => {
      expect(getKanbanView(kanbanView.id).options).toMatchObject({
        groupBy: 'Stage',
      });
    });

    // Views over other databases keep their group property
    expect(getKanbanView(otherDatabaseView.id).options).toMatchObject({
      groupBy: 'Status',
    });
  });

  it('clears the group property and order on property removal', async () => {
    Events.dispatch(Databases.events.propertyRemoved, {
      original: entryTemplatesDatabase,
      updated: entryTemplatesDatabase,
      property: { type: 'select', name: 'Status', options: [] },
    });

    // The handler runs queued rather than during the dispatch
    await vi.waitFor(() => {
      const view = getKanbanView(kanbanView.id);

      expect(view.options).not.toHaveProperty('groupBy');
      expect(view.data).toEqual({ order: {} });
    });
    // Views over other databases keep their group property
    expect(getKanbanView(otherDatabaseView.id).options).toMatchObject({
      groupBy: 'Status',
    });
  });

  it('re-keys the order and hidden state on option renames', async () => {
    Events.dispatch(Databases.events.propertyOptionRenamed, {
      original: entryTemplatesDatabase,
      updated: entryTemplatesDatabase,
      property: renamedOptionProperty,
      oldValue: 'Todo',
      newValue: 'Doing',
    });

    // The handler runs queued rather than during the dispatch
    await vi.waitFor(() => {
      const view = getKanbanView(kanbanView.id);

      expect(view.data?.order).toEqual({ Doing: ['entry-1'], '': ['entry-2'] });
      expect(view.options?.hiddenOptions).toEqual(['Doing']);
    });
    // Views over other databases keep their saved order
    expect(getKanbanView(otherDatabaseView.id).data?.order).toEqual(
      kanbanView.data?.order,
    );
  });
});

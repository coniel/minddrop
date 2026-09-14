import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FilterAdaptersRegistry } from '../../FilterAdaptersRegistry';
import { PropertyFilter } from '../../types';
import { filterItemIds } from './filterItemIds';

interface Task {
  id: string;
  status: string;
}

const tasks: Record<string, Task> = {
  task_done: { id: 'task_done', status: 'Done' },
  task_todo: { id: 'task_todo', status: 'Todo' },
};

const isDone: PropertyFilter = {
  property: 'Status',
  propertyType: 'select',
  operator: 'is',
  value: 'Done',
};

describe('filterItemIds', () => {
  beforeEach(() => {
    // Register a task adapter reading the status
    FilterAdaptersRegistry.register({
      type: 'task',
      get: (id) => tasks[id] ?? null,
      getAll: () => Object.values(tasks),
      resolveValue: (item) => (item as Task).status,
      label: (item) => (item as Task).id,
    });
  });

  afterEach(() => {
    // Unregister the task adapter
    FilterAdaptersRegistry.clear();
  });

  it('returns the IDs unchanged without filters', () => {
    const ids = ['task_todo', 'task_done'];

    expect(filterItemIds(ids, [])).toBe(ids);
  });

  it('keeps the IDs of matching items', () => {
    expect(filterItemIds(['task_todo', 'task_done'], [isDone])).toEqual([
      'task_done',
    ]);
  });

  it('drops IDs of entity types which are not filterable', () => {
    expect(filterItemIds(['note_1', 'task_done'], [isDone])).toEqual([
      'task_done',
    ]);
  });

  it('drops IDs of items which do not exist', () => {
    expect(filterItemIds(['task_missing', 'task_done'], [isDone])).toEqual([
      'task_done',
    ]);
  });
});

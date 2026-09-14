import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FilterAdaptersRegistry } from '../../FilterAdaptersRegistry';
import { PropertyFilter } from '../../types';
import { filterItems } from './filterItems';

interface Task {
  id: string;
  status: string;
}

const done: Task = { id: 'task_done', status: 'Done' };
const todo: Task = { id: 'task_todo', status: 'Todo' };
// An item of an entity type with no adapter
const note = { id: 'note_1', status: 'Done' };

const isDone: PropertyFilter = {
  property: 'Status',
  propertyType: 'select',
  operator: 'is',
  value: 'Done',
};

describe('filterItems', () => {
  beforeEach(() => {
    // Register a task adapter reading the status
    FilterAdaptersRegistry.register({
      type: 'task',
      get: () => null,
      getAll: () => [],
      resolveValue: (item) => (item as Task).status,
      label: (item) => (item as Task).id,
    });
  });

  afterEach(() => {
    // Unregister the task adapter
    FilterAdaptersRegistry.clear();
  });

  it('returns the items unchanged without filters', () => {
    const items = [todo, done];

    expect(filterItems(items, [])).toBe(items);
  });

  it('keeps the items matching the filters', () => {
    expect(filterItems([todo, done], [isDone])).toEqual([done]);
  });

  it('drops items of entity types which are not filterable', () => {
    expect(filterItems([note, done], [isDone])).toEqual([done]);
  });
});

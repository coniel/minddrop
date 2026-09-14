import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FilterAdaptersRegistry } from '../../FilterAdaptersRegistry';
import { listFilterableItems } from './listFilterableItems';

describe('listFilterableItems', () => {
  beforeEach(() => {
    // Register two entity types with items
    FilterAdaptersRegistry.register({
      type: 'task',
      get: () => null,
      getAll: () => [{ id: 'task_1', title: 'Write tests' }],
      resolveValue: () => undefined,
      label: (item) => (item as { id: string; title: string }).title,
      icon: () => 'lucide:check:default',
    });
    FilterAdaptersRegistry.register({
      type: 'note',
      get: () => null,
      getAll: () => [{ id: 'note_1', name: 'Agenda' }],
      resolveValue: () => undefined,
      label: (item) => (item as { id: string; name: string }).name,
    });
  });

  afterEach(() => {
    FilterAdaptersRegistry.clear();
  });

  it("lists every adapter's items sorted by label", () => {
    expect(listFilterableItems()).toEqual([
      { id: 'note_1', label: 'Agenda', icon: undefined },
      { id: 'task_1', label: 'Write tests', icon: 'lucide:check:default' },
    ]);
  });
});

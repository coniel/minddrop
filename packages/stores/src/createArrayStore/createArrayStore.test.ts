import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import {
  StoreHydrateEvent,
  StoreHydrateRequestEvent,
  StoreHydratedEvent,
  StorePersistEvent,
} from '../events';
import { createArrayStore } from './createArrayStore';

interface TestItem {
  id: string;
  name: string;
  value: number;
}

const item1: TestItem = { id: 'item-1', name: 'Item 1', value: 1 };
const item2: TestItem = { id: 'item-2', name: 'Item 2', value: 2 };
const item3: TestItem = { id: 'item-3', name: 'Item 3', value: 3 };

describe('createArrayStore', () => {
  describe('without persistence', () => {
    const store = createArrayStore<TestItem>('Test:Array', 'id');

    beforeEach(() => {
      store.clear();
      Events._clearAll();
    });

    describe('add', () => {
      it('adds a new item to the store', () => {
        store.add(item1);

        expect(store.get('item-1')).toEqual(item1);
      });
    });

    describe('get', () => {
      it('returns the item when given a string identifier', () => {
        store.add(item1);

        expect(store.get('item-1')).toEqual(item1);
      });

      it('returns null when the item does not exist', () => {
        expect(store.get('nonexistent')).toBeNull();
      });

      it('returns matching items when given an array of identifiers', () => {
        store.add(item1);
        store.add(item2);

        const result = store.get(['item-1', 'item-2']);

        expect(result).toEqual([item1, item2]);
      });
    });

    describe('getAll', () => {
      it('returns all items', () => {
        store.add(item1);
        store.add(item2);

        expect(store.getAll()).toEqual([item1, item2]);
      });

      it('returns an empty array when the store is empty', () => {
        expect(store.getAll()).toEqual([]);
      });
    });

    describe('load', () => {
      it('loads multiple items into the store', () => {
        store.load([item1, item2]);

        expect(store.getAll()).toEqual([item1, item2]);
      });

      it('appends loaded items to existing items', () => {
        store.add(item1);
        store.load([item2, item3]);

        expect(store.getAll()).toEqual([item1, item2, item3]);
      });
    });

    describe('update', () => {
      it('merges partial data into an existing item', () => {
        store.add(item1);
        store.update('item-1', { name: 'Updated' });

        expect(store.get('item-1')).toEqual({
          ...item1,
          name: 'Updated',
        });
      });

      it('does nothing when the item does not exist', () => {
        store.update('nonexistent', { name: 'Updated' });

        expect(store.getAll()).toEqual([]);
      });
    });

    describe('remove', () => {
      it('removes the item from the store', () => {
        store.add(item1);
        store.add(item2);

        store.remove('item-1');

        expect(store.get('item-1')).toBeNull();
        expect(store.get('item-2')).toEqual(item2);
      });
    });

    describe('reorder', () => {
      it('reorders items to match the given ID order', () => {
        store.add(item1);
        store.add(item2);
        store.add(item3);

        store.reorder(['item-3', 'item-1', 'item-2']);

        expect(store.getAll()).toEqual([item3, item1, item2]);
      });
    });

    describe('clear', () => {
      it('removes all items from the store', () => {
        store.add(item1);
        store.add(item2);

        store.clear();

        expect(store.getAll()).toEqual([]);
      });
    });

    it('throws when calling hydrate', () => {
      expect(() => store.hydrate()).toThrow();
    });

    it('does not dispatch persist events', () => {
      const callback = vi.fn();
      Events.addListener(StorePersistEvent, 'test', callback);

      store.add(item1);
      store.update('item-1', { name: 'Updated' });
      store.remove('item-1');
      store.clear();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('with persistence', () => {
    const store = createArrayStore<TestItem>('Test:ArrayPersist', 'id', {
      persistTo: 'workspace-config',
      namespace: 'test-package',
    });

    beforeEach(() => {
      // Clear events first so old listeners don't receive
      // the persist event dispatched by store.clear()
      Events._clearAll();
      store.clear();
    });

    it('dispatches a persist event on add', async () =>
      new Promise<void>((done) => {
        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload.data).toEqual({
            persistTo: 'workspace-config',
            namespace: 'test-package',
            data: [item1],
          });
          done();
        });

        store.add(item1);
      }));

    it('dispatches a persist event on update', async () =>
      new Promise<void>((done) => {
        store.add(item1);

        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload.data).toEqual({
            persistTo: 'workspace-config',
            namespace: 'test-package',
            data: [{ ...item1, name: 'Updated' }],
          });
          done();
        });

        store.update('item-1', { name: 'Updated' });
      }));

    it('dispatches a persist event on remove', async () =>
      new Promise<void>((done) => {
        store.add(item1);
        store.add(item2);

        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload.data).toEqual({
            persistTo: 'workspace-config',
            namespace: 'test-package',
            data: [item2],
          });
          done();
        });

        store.remove('item-1');
      }));

    it('dispatches a persist event on reorder', async () =>
      new Promise<void>((done) => {
        store.add(item1);
        store.add(item2);

        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload.data).toEqual({
            persistTo: 'workspace-config',
            namespace: 'test-package',
            data: [item2, item1],
          });
          done();
        });

        store.reorder(['item-2', 'item-1']);
      }));

    it('dispatches a persist event on clear', async () =>
      new Promise<void>((done) => {
        store.add(item1);

        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload.data).toEqual({
            persistTo: 'workspace-config',
            namespace: 'test-package',
            data: [],
          });
          done();
        });

        store.clear();
      }));

    it('does not dispatch a persist event on load', async () => {
      const callback = vi.fn();
      Events.addListener(StorePersistEvent, 'test', callback);

      store.load([item1, item2]);

      // Wait for async event dispatch
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(callback).not.toHaveBeenCalled();
    });

    describe('hydrate', () => {
      it('dispatches a load request event', async () =>
        new Promise<void>((done) => {
          Events.addListener(StoreHydrateRequestEvent, 'test', (payload) => {
            expect(payload.data).toEqual({
              persistTo: 'workspace-config',
              namespace: 'test-package',
            });
            done();
          });

          store.hydrate();
        }));

      it('resolves after the load event is dispatched', async () => {
        // Create a fresh store so its load listener is active
        const freshStore = createArrayStore<TestItem>(
          'Test:ArrayPersist',
          'id',
          {
            persistTo: 'workspace-config',
            namespace: 'hydrate-resolve-test',
          },
        );

        // Simulate the platform layer responding to the load request
        Events.addListener(StoreHydrateRequestEvent, 'test', () => {
          Events.dispatch(StoreHydrateEvent, {
            namespace: 'hydrate-resolve-test',
            data: [item1, item2],
          });
        });

        await freshStore.hydrate();

        expect(freshStore.getAll()).toEqual([item1, item2]);
      });

      it('dispatches a hydrated event', async () => {
        // Create a fresh store so its listener is active
        const freshStore = createArrayStore<TestItem>(
          'Test:ArrayPersist',
          'id',
          {
            persistTo: 'workspace-config',
            namespace: 'hydrated-event-test',
          },
        );

        const callback = vi.fn();
        Events.addListener(StoreHydratedEvent, 'test', callback);

        // Simulate the platform layer responding to the load request
        Events.addListener(StoreHydrateRequestEvent, 'test', () => {
          Events.dispatch(StoreHydrateEvent, {
            namespace: 'hydrated-event-test',
            data: [item1],
          });
        });

        await freshStore.hydrate();

        expect(callback).toHaveBeenCalledWith(
          expect.objectContaining({
            data: { namespace: 'hydrated-event-test' },
          }),
        );
      });
    });
  });

  describe('hydrate listener', () => {
    it('loads data when a matching load event is dispatched', async () => {
      // Create a fresh store so its listener is active
      const freshStore = createArrayStore<TestItem>('Test:ArrayPersist', 'id', {
        persistTo: 'workspace-config',
        namespace: 'load-test',
      });

      // Dispatch a load event with data for this store
      await Events.dispatch(StoreHydrateEvent, {
        namespace: 'load-test',
        data: [item1, item2],
      });

      expect(freshStore.getAll()).toEqual([item1, item2]);
    });

    it('ignores load events for other namespaces', async () => {
      // Create a fresh store so its listener is active
      const freshStore = createArrayStore<TestItem>('Test:ArrayPersist', 'id', {
        persistTo: 'workspace-config',
        namespace: 'load-test-2',
      });

      // Dispatch a load event for a different namespace
      await Events.dispatch(StoreHydrateEvent, {
        namespace: 'other-package',
        data: [item1],
      });

      expect(freshStore.getAll()).toEqual([]);
    });
  });
});

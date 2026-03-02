import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import {
  StoreLoadEvent,
  StoreLoadRequestEvent,
  StorePersistEvent,
} from '../events';
import { createObjectStore } from './createObjectStore';

interface TestItem {
  id: string;
  name: string;
  value: number;
}

const item1: TestItem = { id: 'item-1', name: 'Item 1', value: 1 };
const item2: TestItem = { id: 'item-2', name: 'Item 2', value: 2 };
const item3: TestItem = { id: 'item-3', name: 'Item 3', value: 3 };

describe('createObjectStore', () => {
  describe('without persistence', () => {
    const store = createObjectStore<TestItem>('id');

    beforeEach(() => {
      store.clear();
      Events._clearAll();
    });

    describe('set', () => {
      it('adds a new item to the store', () => {
        store.set(item1);

        expect(store.get('item-1')).toEqual(item1);
      });

      it('replaces an existing item with the same identifier', () => {
        store.set(item1);

        const updated = { ...item1, name: 'Updated' };
        store.set(updated);

        expect(store.get('item-1')).toEqual(updated);
      });
    });

    describe('get', () => {
      it('returns the item when given a string identifier', () => {
        store.set(item1);

        expect(store.get('item-1')).toEqual(item1);
      });

      it('returns null when the item does not exist', () => {
        expect(store.get('nonexistent')).toBeNull();
      });

      it('returns a record of items when given an array of identifiers', () => {
        store.set(item1);
        store.set(item2);

        const result = store.get(['item-1', 'item-2']);

        expect(result).toEqual({
          'item-1': item1,
          'item-2': item2,
        });
      });

      it('omits missing items when given an array of identifiers', () => {
        store.set(item1);

        const result = store.get(['item-1', 'nonexistent']);

        expect(result).toEqual({ 'item-1': item1 });
      });
    });

    describe('getAll', () => {
      it('returns all items as a record', () => {
        store.set(item1);
        store.set(item2);

        expect(store.getAll()).toEqual({
          'item-1': item1,
          'item-2': item2,
        });
      });

      it('returns an empty record when the store is empty', () => {
        expect(store.getAll()).toEqual({});
      });
    });

    describe('getArray', () => {
      it('returns items matching the given identifiers as an array', () => {
        store.set(item1);
        store.set(item2);
        store.set(item3);

        const result = store.getArray(['item-1', 'item-3']);

        expect(result).toEqual([item1, item3]);
      });

      it('omits missing items when given an array of identifiers', () => {
        store.set(item1);

        const result = store.getArray(['item-1', 'nonexistent']);

        expect(result).toEqual([item1]);
      });
    });

    describe('getAllArray', () => {
      it('returns all items as an array', () => {
        store.set(item1);
        store.set(item2);

        expect(store.getAllArray()).toEqual([item1, item2]);
      });

      it('returns an empty array when the store is empty', () => {
        expect(store.getAllArray()).toEqual([]);
      });
    });

    describe('load', () => {
      it('loads multiple items into the store', () => {
        store.load([item1, item2]);

        expect(store.getAll()).toEqual({
          'item-1': item1,
          'item-2': item2,
        });
      });

      it('merges loaded items with existing items', () => {
        store.set(item1);
        store.load([item2, item3]);

        expect(store.getAll()).toEqual({
          'item-1': item1,
          'item-2': item2,
          'item-3': item3,
        });
      });

      it('overwrites existing items with the same identifier', () => {
        store.set(item1);

        const updated = { ...item1, name: 'Updated' };
        store.load([updated]);

        expect(store.get('item-1')).toEqual(updated);
      });
    });

    describe('update', () => {
      it('merges partial data into an existing item', () => {
        store.set(item1);
        store.update('item-1', { name: 'Updated' });

        expect(store.get('item-1')).toEqual({
          ...item1,
          name: 'Updated',
        });
      });

      it('does nothing when the item does not exist', () => {
        store.update('nonexistent', { name: 'Updated' });

        expect(store.getAll()).toEqual({});
      });
    });

    describe('remove', () => {
      it('removes the item from the store', () => {
        store.set(item1);
        store.set(item2);

        store.remove('item-1');

        expect(store.get('item-1')).toBeNull();
        expect(store.get('item-2')).toEqual(item2);
      });
    });

    describe('clear', () => {
      it('removes all items from the store', () => {
        store.set(item1);
        store.set(item2);

        store.clear();

        expect(store.getAll()).toEqual({});
      });
    });

    it('throws when calling loadPersisted', () => {
      expect(() => store.loadPersisted()).toThrow();
    });

    it('does not dispatch persist events', () => {
      const callback = vi.fn();
      Events.addListener(StorePersistEvent, 'test', callback);

      store.set(item1);
      store.update('item-1', { name: 'Updated' });
      store.remove('item-1');
      store.clear();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('with persistence', () => {
    const store = createObjectStore<TestItem>('id', {
      persistTo: 'app-config',
      namespace: 'test-package',
    });

    beforeEach(() => {
      // Clear events first so old listeners don't receive
      // the persist event dispatched by store.clear()
      Events._clearAll();
      store.clear();
    });

    it('dispatches a persist event on set', async () =>
      new Promise<void>((done) => {
        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload.data).toEqual({
            persistTo: 'app-config',
            namespace: 'test-package',
            data: { 'item-1': item1 },
          });
          done();
        });

        store.set(item1);
      }));

    it('dispatches a persist event on update', async () =>
      new Promise<void>((done) => {
        store.set(item1);

        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload.data).toEqual({
            persistTo: 'app-config',
            namespace: 'test-package',
            data: { 'item-1': { ...item1, name: 'Updated' } },
          });
          done();
        });

        store.update('item-1', { name: 'Updated' });
      }));

    it('dispatches a persist event on remove', async () =>
      new Promise<void>((done) => {
        store.set(item1);
        store.set(item2);

        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload.data).toEqual({
            persistTo: 'app-config',
            namespace: 'test-package',
            data: { 'item-2': item2 },
          });
          done();
        });

        store.remove('item-1');
      }));

    it('dispatches a persist event on clear', async () =>
      new Promise<void>((done) => {
        store.set(item1);

        Events.addListener(StorePersistEvent, 'test', (payload) => {
          expect(payload.data).toEqual({
            persistTo: 'app-config',
            namespace: 'test-package',
            data: {},
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

    describe('loadPersisted', () => {
      it('dispatches a load request event', async () =>
        new Promise<void>((done) => {
          Events.addListener(StoreLoadRequestEvent, 'test', (payload) => {
            expect(payload.data).toEqual({
              persistTo: 'app-config',
              namespace: 'test-package',
            });
            done();
          });

          store.loadPersisted();
        }));
    });
  });

  describe('loadPersisted listener', () => {
    it('loads data when a matching load event is dispatched', async () => {
      // Create a fresh store so its listener is active
      const freshStore = createObjectStore<TestItem>('id', {
        persistTo: 'app-config',
        namespace: 'load-test',
      });

      // Dispatch a load event with data for this store
      await Events.dispatch(StoreLoadEvent, {
        namespace: 'load-test',
        data: { 'item-1': item1, 'item-2': item2 },
      });

      expect(freshStore.getAll()).toEqual({
        'item-1': item1,
        'item-2': item2,
      });
    });

    it('ignores load events for other namespaces', async () => {
      // Create a fresh store so its listener is active
      const freshStore = createObjectStore<TestItem>('id', {
        persistTo: 'app-config',
        namespace: 'load-test-2',
      });

      // Dispatch a load event for a different namespace
      await Events.dispatch(StoreLoadEvent, {
        namespace: 'other-package',
        data: { 'item-1': item1 },
      });

      expect(freshStore.getAll()).toEqual({});
    });
  });
});

import { describe, beforeEach, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { ItemStore } from '../types';
import { createItemStore } from './createItemStore';

interface TestItem {
  id: string;
  foo: string;
}

const item1: TestItem = {
  id: 'doc-1',
  foo: 'foo',
};

const item2: TestItem = {
  foo: 'foo',
  id: 'doc-2',
};

describe('itemStore', () => {
  let Store: ItemStore<TestItem>;

  beforeEach(() => {
    Store = createItemStore();
  });

  describe('load', () => {
    it('loads items into the store', () => {
      // Load items into the store
      Store.load([item1, item2]);

      // Items should be in the store
      expect(Store.get(item1.id)).toEqual(item1);
      expect(Store.get(item2.id)).toEqual(item2);
    });

    it('preserves existing items', () => {
      // Load a item into the store
      Store.load([item1]);
      // Load a second item into the store
      Store.load([item2]);

      // Store should contain both items
      expect(Store.get(item1.id)).toEqual(item1);
      expect(Store.get(item2.id)).toEqual(item2);
    });
  });

  describe('set', () => {
    it('sets a item in the store', () => {
      // Set a item in the store
      Store.set(item1);

      // Item should be in the store
      expect(Store.get(item1.id)).toEqual(item1);
    });
  });

  describe('remove', () => {
    it('removes a item from the store', () => {
      // Load items into the store
      Store.load([item1, item2]);

      // Remove a item from the store
      Store.remove(item1.id);

      // Item should be removed from the store
      expect(Store.getAll()).toEqual({ 'doc-2': item2 });
    });

    it('removes the item revisions from the store', () => {
      // Load items into the store
      Store.load([item1, item2]);

      // Remove a item from the store
      Store.remove(item1.id);
    });
  });

  describe('get', () => {
    it('returns a single item provided a single ID', () => {
      // Load items into the store
      Store.load([item1, item2]);

      // Returns the requested item
      expect(Store.get(item1.id)).toEqual(item1);
    });

    it('returns multiple items provided an array of IDs', () => {
      // Load items into the store
      Store.load([item1, item2]);

      // Returns the requested items
      expect(Store.get([item1.id, item2.id])).toEqual({
        'doc-1': item1,
        'doc-2': item2,
      });
    });
  });

  describe('getAll', () => {
    it('returns all items from the store', () => {
      // Load items into the store
      Store.load([item1, item2]);

      // Returns all items in the store
      expect(Store.getAll()).toEqual({
        'doc-1': item1,
        'doc-2': item2,
      });
    });
  });

  describe('clear', () => {
    it('clears all items from the store', () => {
      // Load items into the store
      Store.load([item1, item2]);

      // Clear the store
      Store.clear();

      // Items should no longer be in the store
      expect(Store.get([item1.id, item2.id])).toEqual({});
    });

    it('clears all item revisions from the store', () => {
      // Load items into the store
      Store.load([item1, item2]);

      // Clear the store
      Store.clear();
    });
  });

  describe('useItem', () => {
    it('returns requested item from the store', () => {
      // Load items into the store
      Store.load([item1, item2]);

      const { result } = renderHook(() => Store.useItem(item1.id));

      // Returns the requested item
      expect(result.current).toEqual(item1);
    });

    it('is reactive', () => {
      // Load items into the store
      Store.load([item1, item2]);

      const { result } = renderHook(() => Store.useItem(item1.id));

      act(() => {
        Store.set({ ...item1, foo: 'bar' });
      });

      // Returns the requested item
      expect(result.current).toEqual({ ...item1, foo: 'bar' });
    });
  });

  describe('useItems', () => {
    it('returns requested items from the store', () => {
      // Load items into the store
      Store.load([item1, item2]);

      const { result } = renderHook(() => Store.useItems([item1.id, item2.id]));

      // Returns the requested item
      expect(result.current).toEqual({ [item1.id]: item1, [item2.id]: item2 });
    });

    it('is reactive', () => {
      // Load items into the store
      Store.load([item1, item2]);

      const { result } = renderHook(() => Store.useItems([item1.id, item2.id]));

      act(() => {
        Store.set({ ...item1, foo: 'bar' });
      });

      // Returns the requested item
      expect(result.current).toEqual({
        [item1.id]: { ...item1, foo: 'bar' },
        [item2.id]: item2,
      });
    });
  });

  describe('useAllItems', () => {
    it('returns all items from the store', () => {
      // Load items into the store
      Store.load([item1, item2]);

      const { result } = renderHook(() => Store.useAllItems());

      // Returns the requested item
      expect(result.current).toEqual({ [item1.id]: item1, [item2.id]: item2 });
    });

    it('is reactive', () => {
      // Load items into the store
      Store.load([item1, item2]);

      const { result } = renderHook(() => Store.useAllItems());

      act(() => {
        Store.set({ ...item1, foo: 'bar' });
      });

      // Returns the requested item
      expect(result.current).toEqual({
        [item1.id]: { ...item1, foo: 'bar' },
        [item2.id]: item2,
      });
    });
  });
});

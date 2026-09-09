import { beforeEach, describe, expect, it } from 'vitest';
import { createArrayStore } from '../../createArrayStore';
import { createKeyValueStore } from '../../createKeyValueStore';
import { createObjectStore } from '../../createObjectStore';
import './matchers';

interface TestItem {
  id: string;
  name: string;
  value: number;
}

const item1: TestItem = { id: 'item-1', name: 'Item 1', value: 1 };
const item2: TestItem = { id: 'item-2', name: 'Item 2', value: 2 };
const item3: TestItem = { id: 'item-3', name: 'Item 3', value: 3 };

const objectStore = createObjectStore<TestItem>('Test:Matchers:Object', 'id');
const arrayStore = createArrayStore<TestItem>('Test:Matchers:Array', 'id');
const keyValueStore = createKeyValueStore('Test:Matchers:KeyValue', {
  theme: 'light',
  fontSize: 14,
});

describe('store matchers', () => {
  beforeEach(() => {
    objectStore.clear();
    arrayStore.clear();
    keyValueStore.reset();

    objectStore.load([item1, item2]);
    arrayStore.load([item1, item2]);
  });

  describe('toHaveItem', () => {
    it('passes when the store holds the item', () => {
      expect(objectStore).toHaveItem('item-1');
      expect(arrayStore).toHaveItem('item-1');
    });

    it('fails when the store does not hold the item', () => {
      expect(() => expect(objectStore).toHaveItem('item-9')).toThrow(
        'Test:Matchers:Object has no item "item-9". It holds: item-1, item-2.',
      );
    });

    it('reports an empty store rather than listing nothing', () => {
      objectStore.clear();

      expect(() => expect(objectStore).toHaveItem('item-9')).toThrow(
        'Test:Matchers:Object has no item "item-9". It is empty.',
      );
    });

    it('passes when the item matches the expected value', () => {
      expect(objectStore).toHaveItem('item-1', item1);
      expect(arrayStore).toHaveItem('item-1', item1);
    });

    it('fails when the item does not match the expected value', () => {
      expect(() =>
        expect(objectStore).toHaveItem('item-1', { ...item1, name: 'Other' }),
      ).toThrow('Test:Matchers:Object item "item-1" does not match');
    });

    it('distinguishes a missing item from a mismatched one', () => {
      expect(() => expect(objectStore).toHaveItem('item-9', item1)).toThrow(
        'has no item "item-9"',
      );
    });

    it('supports asymmetric matchers', () => {
      expect(objectStore).toHaveItem('item-1', {
        id: 'item-1',
        name: expect.any(String),
        value: 1,
      });
    });

    it('passes when negated and the store does not hold the item', () => {
      expect(objectStore).not.toHaveItem('item-9');
    });

    it('fails when negated and the store holds the item', () => {
      expect(() => expect(objectStore).not.toHaveItem('item-1')).toThrow(
        'Test:Matchers:Object has an item "item-1".',
      );
    });
  });

  describe('toHaveItems', () => {
    it('passes when the store holds exactly the given items', () => {
      expect(objectStore).toHaveItems([item1, item2]);
      expect(arrayStore).toHaveItems([item1, item2]);
    });

    it('ignores order', () => {
      expect(objectStore).toHaveItems([item2, item1]);
      expect(arrayStore).toHaveItems([item2, item1]);
    });

    it('accepts an array of identifiers', () => {
      expect(objectStore).toHaveItems(['item-2', 'item-1']);
    });

    it('fails when the store holds an extra item', () => {
      objectStore.set(item3);

      expect(() => expect(objectStore).toHaveItems([item1, item2])).toThrow(
        'Test:Matchers:Object does not hold the expected items',
      );
    });

    it('fails when the store is missing an item', () => {
      expect(() =>
        expect(objectStore).toHaveItems([item1, item2, item3]),
      ).toThrow('Test:Matchers:Object does not hold the expected items');
    });

    it('fails when an item differs in value', () => {
      expect(() =>
        expect(objectStore).toHaveItems([item1, { ...item2, name: 'Other' }]),
      ).toThrow('Test:Matchers:Object does not hold the expected items');
    });
  });

  describe('toHaveItemCount', () => {
    it('passes when the count matches', () => {
      expect(objectStore).toHaveItemCount(2);
      expect(arrayStore).toHaveItemCount(2);
    });

    it('passes on an empty store', () => {
      objectStore.clear();

      expect(objectStore).toHaveItemCount(0);
    });

    it('fails when the count differs', () => {
      expect(() => expect(objectStore).toHaveItemCount(3)).toThrow(
        'Test:Matchers:Object has 2 items, expected 3.',
      );
    });
  });

  describe('toHaveItemOrder', () => {
    it('passes when the items are in the given order', () => {
      expect(arrayStore).toHaveItemOrder(['item-1', 'item-2']);
    });

    it('fails when the items are in a different order', () => {
      expect(() =>
        expect(arrayStore).toHaveItemOrder(['item-2', 'item-1']),
      ).toThrow('Test:Matchers:Array items are in a different order');
    });

    it('throws when used on a store which has no order', () => {
      expect(() =>
        expect(objectStore).toHaveItemOrder(['item-1', 'item-2']),
      ).toThrow('toHaveItemOrder can only be used on array stores');
    });
  });

  describe('toHaveStoredValue', () => {
    it('passes when the value matches', () => {
      expect(keyValueStore).toHaveStoredValue('theme', 'light');
    });

    it('passes for a value set after the default', () => {
      keyValueStore.set('theme', 'dark');

      expect(keyValueStore).toHaveStoredValue('theme', 'dark');
    });

    it('fails when the value differs', () => {
      expect(() =>
        expect(keyValueStore).toHaveStoredValue('theme', 'dark'),
      ).toThrow('Test:Matchers:KeyValue value "theme" does not match');
    });

    it('throws when used on a store which holds items', () => {
      expect(() =>
        expect(objectStore).toHaveStoredValue('theme', 'dark'),
      ).toThrow('toHaveStoredValue can only be used on key-value stores');
    });
  });

  describe('received value', () => {
    it('throws when given something which is not a store', () => {
      expect(() => expect(5).toHaveItem('item-1')).toThrow(
        'toHaveItem expects a store',
      );
    });
  });
});

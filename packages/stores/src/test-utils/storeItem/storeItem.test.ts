import { beforeEach, describe, expect, it } from 'vitest';
import { createArrayStore } from '../../createArrayStore';
import { createObjectStore } from '../../createObjectStore';
import { storeItem } from './storeItem';

interface TestItem {
  id: string;
  name: string;
  nested: { color: string };
}

const item1: TestItem = {
  id: 'item-1',
  name: 'Item 1',
  nested: { color: 'red' },
};
const item2: TestItem = {
  id: 'item-2',
  name: 'Item 2',
  nested: { color: 'blue' },
};

const objectStore = createObjectStore<TestItem>('Test:StoreItem:Object', 'id');
const arrayStore = createArrayStore<TestItem>('Test:StoreItem:Array', 'id');

describe('storeItem', () => {
  beforeEach(() => {
    objectStore.clear();
    arrayStore.clear();

    objectStore.load([item1, item2]);
    arrayStore.load([item1, item2]);
  });

  it('returns the item from an object store', () => {
    expect(storeItem(objectStore, 'item-1')).toEqual(item1);
  });

  it('returns the item from an array store', () => {
    expect(storeItem(arrayStore, 'item-1')).toEqual(item1);
  });

  it('returns the item as non-nullable, so nested fields can be read', () => {
    expect(storeItem(objectStore, 'item-1').nested.color).toBe('red');
  });

  it('throws when the store does not hold the item', () => {
    expect(() => storeItem(objectStore, 'item-9')).toThrow(
      'Test:StoreItem:Object has no item "item-9". It holds: item-1, item-2.',
    );
  });

  it('reports an empty store rather than listing nothing', () => {
    objectStore.clear();

    expect(() => storeItem(objectStore, 'item-9')).toThrow(
      'Test:StoreItem:Object has no item "item-9". It is empty.',
    );
  });
});

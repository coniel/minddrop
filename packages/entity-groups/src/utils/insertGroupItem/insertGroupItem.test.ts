import { describe, expect, it } from 'vitest';
import { insertGroupItem } from './insertGroupItem';

const items = ['item_1', 'item_2', 'item_3'];

describe('insertGroupItem', () => {
  it('inserts the item at the given index', () => {
    expect(insertGroupItem(items, 'item_4', 1)).toEqual([
      'item_1',
      'item_4',
      'item_2',
      'item_3',
    ]);
  });

  it('appends the item when given no index', () => {
    expect(insertGroupItem(items, 'item_4')).toEqual([...items, 'item_4']);
  });

  it('lists an item the group already holds once', () => {
    expect(insertGroupItem(items, 'item_1', 1)).toEqual([
      'item_2',
      'item_1',
      'item_3',
    ]);
  });

  it('lands a held item at the index it names when moving it later', () => {
    // Dropping item_1 first shifts the rest down, so a naive splice
    // would put it after item_3 rather than at index 2.
    expect(insertGroupItem(items, 'item_1', 2)).toEqual([
      'item_2',
      'item_3',
      'item_1',
    ]);
    expect(insertGroupItem(items, 'item_1', 2)[2]).toBe('item_1');
  });

  it('lands a held item at the index it names when moving it earlier', () => {
    expect(insertGroupItem(items, 'item_3', 0)[0]).toBe('item_3');
  });

  it('appends an index past the end', () => {
    expect(insertGroupItem(items, 'item_4', 99)).toEqual([...items, 'item_4']);
  });

  it('leaves the given items alone', () => {
    insertGroupItem(items, 'item_4', 0);

    expect(items).toEqual(['item_1', 'item_2', 'item_3']);
  });
});

import { describe, expect, it } from 'vitest';
import { filterStoreItems } from './filterStoreItems';

const books = { id: 'db_1', name: 'Books' };
const films = { id: 'db_2', name: 'Films', properties: ['director'] };

const items = [books, films];

describe('filterStoreItems', () => {
  it('returns every item without search text', () => {
    expect(filterStoreItems(items, '  ')).toEqual(items);
  });

  it('filters by label, ignoring case', () => {
    expect(filterStoreItems(items, 'BOOKS')).toEqual([books]);
  });

  it('filters by identifier', () => {
    expect(filterStoreItems(items, 'db_2')).toEqual([films]);
  });

  it('filters by item contents', () => {
    expect(filterStoreItems(items, 'director')).toEqual([films]);
  });

  it('returns nothing when no item matches', () => {
    expect(filterStoreItems(items, 'music')).toEqual([]);
  });

  it('keeps items which cannot be serialized searchable by label', () => {
    const circular: Record<string, unknown> = { name: 'Circular' };
    circular.self = circular;

    expect(filterStoreItems([circular], 'circular')).toEqual([circular]);
  });
});

import { describe, expect, it } from 'vitest';
import { getStoreItemId } from './getStoreItemId';

describe('getStoreItemId', () => {
  it('uses the ID field when present', () => {
    expect(getStoreItemId({ id: 'db_1', name: 'Books' })).toBe('db_1');
  });

  it('falls back through the other identifying fields', () => {
    expect(getStoreItemId({ key: 'a' })).toBe('a');
    expect(getStoreItemId({ type: 'page' })).toBe('page');
    expect(getStoreItemId({ name: 'Books' })).toBe('Books');
    expect(getStoreItemId({ path: '/books' })).toBe('/books');
  });

  it('ignores empty and non string fields', () => {
    expect(getStoreItemId({ id: '', key: 'a' })).toBe('a');
    expect(getStoreItemId({ id: 4, key: 'a' })).toBe('a');
  });

  it('falls back to the serialized item', () => {
    expect(getStoreItemId({ count: 2 })).toBe('{"count":2}');
  });
});

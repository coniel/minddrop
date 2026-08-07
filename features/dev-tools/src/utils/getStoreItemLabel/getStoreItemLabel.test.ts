import { describe, expect, it } from 'vitest';
import { getStoreItemLabel } from './getStoreItemLabel';

describe('getStoreItemLabel', () => {
  it('uses the name field when present', () => {
    expect(getStoreItemLabel({ id: 'db_1', name: 'Books' })).toBe('Books');
  });

  it('falls back through the other naming fields', () => {
    expect(getStoreItemLabel({ title: 'Reading list' })).toBe('Reading list');
    expect(getStoreItemLabel({ label: 'Recent' })).toBe('Recent');
  });

  it('falls back to the item identifier', () => {
    expect(getStoreItemLabel({ id: 'db_1' })).toBe('db_1');
  });
});

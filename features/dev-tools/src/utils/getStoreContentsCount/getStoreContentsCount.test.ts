import { describe, expect, it } from 'vitest';
import { getStoreContentsCount } from './getStoreContentsCount';

describe('getStoreContentsCount', () => {
  it('counts items', () => {
    expect(getStoreContentsCount({ kind: 'items', items: [{ id: 'a' }] })).toBe(
      1,
    );
  });

  it('counts values', () => {
    expect(
      getStoreContentsCount({ kind: 'values', values: { a: 1, b: 2 } }),
    ).toBe(2);
  });

  it('counts empty contents as none', () => {
    expect(getStoreContentsCount({ kind: 'items', items: [] })).toBe(0);
    expect(getStoreContentsCount({ kind: 'values', values: {} })).toBe(0);
  });
});

import { describe, expect, it } from 'vitest';
import { readStoreContents } from './readStoreContents';

describe('readStoreContents', () => {
  it('reads the items of an array store', () => {
    expect(readStoreContents('array', { items: [{ id: 'a' }] })).toEqual({
      kind: 'items',
      items: [{ id: 'a' }],
    });
  });

  it('reads the items of an object store in insertion order', () => {
    expect(
      readStoreContents('object', {
        items: { b: { id: 'b' }, a: { id: 'a' } },
      }),
    ).toEqual({ kind: 'items', items: [{ id: 'b' }, { id: 'a' }] });
  });

  it('reads the values of a key-value store', () => {
    expect(readStoreContents('key-value', { values: { open: true } })).toEqual({
      kind: 'values',
      values: { open: true },
    });
  });

  it('reads empty contents from an empty store', () => {
    expect(readStoreContents('array', { items: [] })).toEqual({
      kind: 'items',
      items: [],
    });
    expect(readStoreContents('object', { items: {} })).toEqual({
      kind: 'items',
      items: [],
    });
    expect(readStoreContents('key-value', { values: {} })).toEqual({
      kind: 'values',
      values: {},
    });
  });

  it('reads empty contents from state without them', () => {
    expect(readStoreContents('array', undefined)).toEqual({
      kind: 'items',
      items: [],
    });
    expect(readStoreContents('object', {})).toEqual({
      kind: 'items',
      items: [],
    });
    expect(readStoreContents('key-value', { values: null })).toEqual({
      kind: 'values',
      values: {},
    });
  });
});

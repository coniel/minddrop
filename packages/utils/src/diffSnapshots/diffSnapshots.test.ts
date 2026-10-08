import { describe, expect, it } from 'vitest';
import { diffSnapshots } from './diffSnapshots';

describe('diffSnapshots', () => {
  it('returns no keys for identical snapshots', () => {
    expect(diffSnapshots({ a: '1', b: '2' }, { a: '1', b: '2' })).toEqual({
      modified: [],
      deleted: [],
      created: [],
    });
  });

  it('returns the keys whose values changed as modified', () => {
    expect(diffSnapshots({ a: '1', b: '2' }, { a: '1', b: '3' })).toEqual({
      modified: ['b'],
      deleted: [],
      created: [],
    });
  });

  it('returns the keys missing from the later snapshot as deleted', () => {
    expect(diffSnapshots({ a: '1', b: '2' }, { a: '1' })).toEqual({
      modified: [],
      deleted: ['b'],
      created: [],
    });
  });

  it('returns the keys new in the later snapshot as created', () => {
    expect(diffSnapshots({ a: '1' }, { a: '1', b: '2' })).toEqual({
      modified: [],
      deleted: [],
      created: ['b'],
    });
  });

  it('compares values structurally rather than by reference', () => {
    expect(diffSnapshots({ a: { title: 'A' } }, { a: { title: 'A' } })).toEqual(
      { modified: [], deleted: [], created: [] },
    );
  });

  it('counts a key holding an empty value as present', () => {
    expect(diffSnapshots({ a: '' }, { a: '' })).toEqual({
      modified: [],
      deleted: [],
      created: [],
    });
  });
});

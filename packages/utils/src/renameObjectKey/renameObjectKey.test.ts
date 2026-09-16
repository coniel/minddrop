import { describe, expect, it } from 'vitest';
import { renameObjectKey } from './renameObjectKey';

describe('renameObjectKey', () => {
  it('renames the key in place', () => {
    // Rename a key in the middle of the object
    const renamed = renameObjectKey(
      { first: 1, second: 2, third: 3 },
      'second',
      'middle',
    );

    // The key should be renamed, keeping its position
    expect(Object.entries(renamed)).toEqual([
      ['first', 1],
      ['middle', 2],
      ['third', 3],
    ]);
  });

  it('returns the same object when it does not have the key', () => {
    // An object without the renamed key
    const object = { first: 1 };

    // The same object should be returned
    expect(renameObjectKey(object, 'second', 'middle')).toBe(object);
  });
});

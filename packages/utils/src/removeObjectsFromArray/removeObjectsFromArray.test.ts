import { describe, it, expect } from 'vitest';
import { removeObjectsFromArray } from './removeObjectsFromArray';

describe('removeObjectsFromArray', () => {
  it('removes objects which match on all keys', () => {
    const objects = [
      { string: 'obj0', number: 123, boolean: true },
      { string: 'obj1', number: 123, boolean: true },
      { string: 'obj2', number: 456, boolean: true },
      { string: 'obj3', number: 123, boolean: false },
    ];

    // Remove a couple of objects
    expect(removeObjectsFromArray(objects, [objects[1], objects[3]])).toEqual([
      objects[0],
      objects[2],
    ]);
  });
});

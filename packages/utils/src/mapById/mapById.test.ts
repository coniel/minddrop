import { describe, it, expect } from 'vitest';
import { mapById } from './mapById';

describe('mapById', () => {
  it('returns a map of the items', () => {
    const item1 = { id: 'item-1' };
    const item2 = { id: 'item-2' };

    expect(mapById([item1, item2])).toEqual({
      'item-1': item1,
      'item-2': item2,
    });
  });
});

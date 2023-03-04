import { describe, it, expect } from 'vitest';
import { getMissingItems } from './getMissingItems';

describe('getMissingItems', () => {
  it('returns the needles which are missing from the haystack', () => {
    expect(getMissingItems(['one', 'two'], ['one', 'three', 'four'])).toEqual([
      'three',
      'four',
    ]);
  });
});

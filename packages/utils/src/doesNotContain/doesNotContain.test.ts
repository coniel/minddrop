import { describe, it, expect } from 'vitest';
import { doesNotContain } from './doesNotContain';

describe('doesNotContain', () => {
  it('returns true if the array does not contain any of the items', () => {
    expect(doesNotContain([1, 'a', false], [2, 'b', true])).toBeTruthy();
  });

  it('returns false if the array contains any of the items', () => {
    expect(doesNotContain([1, 2, 3], [3, 4, 5])).toBeFalsy();
    expect(doesNotContain(['a', 'b', 'c'], ['c', 'd'])).toBeFalsy();
    expect(doesNotContain([false, true], [false])).toBeFalsy();
    expect(doesNotContain([null], [null])).toBeFalsy();
  });

  it('supports basic objects', () => {
    expect(
      doesNotContain(
        [{ string: 'a', number: 1, boolean: false, null: null }],
        [{ string: 'a', number: 1, boolean: false, null: null }],
      ),
    ).toBeFalsy();
    expect(
      doesNotContain(
        [{ string: 'a', number: 1, boolean: false, null: null }],
        [{ string: 'b', number: 1, boolean: false, null: null }],
      ),
    ).toBeTruthy();
    expect(
      doesNotContain(
        [{ string: 'a', number: 1, boolean: false, null: null }],
        [{ string: 'a', number: 2, boolean: false, null: null }],
      ),
    ).toBeTruthy();
    expect(
      doesNotContain(
        [{ string: 'a', number: 1, boolean: false, null: null }],
        [{ string: 'a', number: 1, boolean: true, null: null }],
      ),
    ).toBeTruthy();
    expect(
      doesNotContain(
        [{ string: 'a', number: 1, boolean: false, null: null }],
        [{ string: 'a', number: 1, boolean: false, null: 'foo' }],
      ),
    ).toBeTruthy();
  });
});

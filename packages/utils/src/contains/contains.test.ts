import { contains } from './contains';

describe('contains', () => {
  it('returns true if array is a subset', () => {
    expect(
      contains(['a', 'b', 1, 2, null, false], ['a', 1, null, false]),
    ).toBeTruthy();
  });

  it('returns false if array is not a subset', () => {
    expect(contains(['a', 'b'], ['b', 'c'])).toBe(false);
    expect(contains([1, 2], [2, 3])).toBe(false);
    expect(contains(['a', 'b'], [null])).toBe(false);
    expect(contains(['a', 'b'], [false])).toBe(false);
  });

  it('supports basic objects', () => {
    // Should be true
    expect(
      contains(
        [{ number: 1, string: 'a', null: null, boolean: true }],
        [{ number: 1, string: 'a', null: null, boolean: true }],
      ),
    ).toBeTruthy();
    // Should be false
    expect(
      contains(
        [{ number: 1, string: 'a', null: null, boolean: true }],
        [{ number: 2, string: 'a', null: null, boolean: true }],
      ),
    ).toBeFalsy();
    // Should be false
    expect(
      contains(
        [{ number: 1, string: 'a', null: null, boolean: true }],
        [{ number: 1, string: 'b', null: null, boolean: true }],
      ),
    ).toBeFalsy();
    // Should be false
    expect(
      contains(
        [{ number: 1, string: 'a', null: null, boolean: true }],
        [{ number: 1, string: 'a', boolean: true }],
      ),
    ).toBeFalsy();
    // Should be false
    expect(
      contains(
        [{ number: 1, string: 'a', null: null, boolean: true }],
        [{ number: 1, string: 'a', null: null, boolean: false }],
      ),
    ).toBeFalsy();
  });
});

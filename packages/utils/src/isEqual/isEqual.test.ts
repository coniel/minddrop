import { isEqual } from './isEqual';

describe('isEqual', () => {
  it('returns true if arrays contain the same elements', () => {
    expect(isEqual([1, 2, 3], [3, 1, 2])).toBe(true);
  });

  it('returns false if the arrays do not contain the same elements', () => {
    expect(isEqual([1, 2, 3], [3, 1])).toBe(false);
    expect(isEqual([1, 2], [3, 1, 2])).toBe(false);
    expect(isEqual([1, 2, 3, 4], [3, 1, 2])).toBe(false);
    expect(isEqual([1, 2, 3], [3, 4, 1, 2])).toBe(false);
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });
});

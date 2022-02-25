import { isSubsetOf } from './isSubsetOf';

describe('isSubsetOf', () => {
  it('returns true if array is a subset', () => {
    expect(isSubsetOf([1, 2], [4, 3, 2, 1])).toBe(true);
  });

  it('returns false if array is not a subset', () => {
    expect(isSubsetOf([1, 2, 5], [4, 3, 2, 1])).toBe(false);
    expect(isSubsetOf([1, 2], [4, 3, 1])).toBe(false);
  });
});

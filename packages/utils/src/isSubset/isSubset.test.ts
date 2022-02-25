import { isSubset } from './isSubset';

describe('isSubset', () => {
  it('returns true if array is a subset', () => {
    expect(isSubset([1, 2], [4, 3, 2, 1])).toBe(true);
  });

  it('returns false if array is not a subset', () => {
    expect(isSubset([1, 2, 5], [4, 3, 2, 1])).toBe(false);
    expect(isSubset([1, 2], [4, 3, 1])).toBe(false);
  });
});

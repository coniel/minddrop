import { doesNotContain } from './doesNotContain';

describe('doesNotContain', () => {
  it('returns true if the array does not contain any of the items', () => {
    expect(doesNotContain([1, 2, 3], [4, 5, 6])).toBeTruthy();
  });

  it('returns false if the array contains any of the items', () => {
    expect(doesNotContain([1, 2, 3], [3, 4, 5])).toBeFalsy();
  });
});

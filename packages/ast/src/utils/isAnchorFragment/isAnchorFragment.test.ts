import { describe, expect, it } from 'vitest';
import { isAnchorFragment } from './isAnchorFragment';

describe('isAnchorFragment', () => {
  it('recognises an anchor', () => {
    expect(isAnchorFragment('^abcd1234')).toBe(true);
  });

  it('rejects a heading', () => {
    expect(isAnchorFragment('Heading')).toBe(false);
  });

  it('rejects an empty anchor', () => {
    expect(isAnchorFragment('^')).toBe(false);
  });
});

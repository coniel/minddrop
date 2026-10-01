import { describe, expect, it } from 'vitest';
import { parseAnchorFragment } from './parseAnchorFragment';

describe('parseAnchorFragment', () => {
  it('parses the ID of an anchor', () => {
    expect(parseAnchorFragment('^abcd1234')).toBe('abcd1234');
  });

  it('returns null for a heading', () => {
    expect(parseAnchorFragment('Heading')).toBeNull();
  });

  it('returns null for an empty anchor', () => {
    expect(parseAnchorFragment('^')).toBeNull();
  });
});

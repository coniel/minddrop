import { describe, expect, it } from 'vitest';
import { resolveAnchorFragment } from './resolveAnchorFragment';

describe('resolveAnchorFragment', () => {
  it('spells the fragment for an anchor ID', () => {
    expect(resolveAnchorFragment('abcd1234')).toBe('^abcd1234');
  });
});

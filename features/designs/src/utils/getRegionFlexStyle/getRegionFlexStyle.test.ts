import { describe, expect, it } from 'vitest';
import { getRegionFlexStyle } from './getRegionFlexStyle';

describe('getRegionFlexStyle', () => {
  it('keeps panels from shrinking', () => {
    expect(getRegionFlexStyle({ type: 'page-panel' })).toEqual({
      flexShrink: 0,
    });
  });

  it('grows the content region', () => {
    expect(getRegionFlexStyle({ type: 'container', role: 'content' })).toEqual({
      flexGrow: 1,
      flexBasis: 0,
      minWidth: 0,
    });
  });

  it('returns no sizing for a plain container', () => {
    expect(getRegionFlexStyle({ type: 'container' })).toEqual({});
  });
});

import { describe, expect, it } from 'vitest';
import { resolveRegionFlexStyle } from './resolveRegionFlexStyle';

describe('resolveRegionFlexStyle', () => {
  it('keeps panels from shrinking', () => {
    expect(resolveRegionFlexStyle({ type: 'page-panel' })).toEqual({
      flexShrink: 0,
    });
  });

  it('grows the content region', () => {
    expect(
      resolveRegionFlexStyle({ type: 'container', role: 'content' }),
    ).toEqual({
      flexGrow: 1,
      flexBasis: 0,
      minWidth: 0,
    });
  });

  it('returns no sizing for a plain container', () => {
    expect(resolveRegionFlexStyle({ type: 'container' })).toEqual({});
  });
});

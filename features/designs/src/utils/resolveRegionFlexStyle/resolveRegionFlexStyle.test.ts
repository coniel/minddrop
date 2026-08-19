import { describe, expect, it } from 'vitest';
import { resolveRegionFlexStyle } from './resolveRegionFlexStyle';

describe('resolveRegionFlexStyle', () => {
  it('keeps page panels at a fixed width', () => {
    expect(resolveRegionFlexStyle({ type: 'page-panel' })).toEqual({
      flexShrink: 0,
      overflowY: 'auto',
    });
  });

  it('grows the content region to fill the remaining space', () => {
    expect(
      resolveRegionFlexStyle({ type: 'container', role: 'page-content' }),
    ).toEqual({
      flexGrow: 1,
      flexBasis: 0,
      minWidth: 0,
      overflowY: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
    });
  });

  it("caps the content region at the root's content width", () => {
    expect(
      resolveRegionFlexStyle(
        { type: 'container', role: 'page-content' },
        'narrow',
      ),
    ).toMatchObject({ maxWidth: 'var(--measure-narrow)' });
  });

  it("pads the content region outside the root's cap", () => {
    expect(
      resolveRegionFlexStyle(
        { type: 'container', role: 'page-content' },
        'narrow',
        '4',
      ),
    ).toMatchObject({
      paddingLeft: 'var(--space-4)',
      paddingRight: 'var(--space-4)',
      maxWidth: 'calc(var(--measure-narrow) + 2 * var(--space-4))',
    });
  });

  it('returns no styles for other elements', () => {
    expect(resolveRegionFlexStyle({ type: 'container' })).toEqual({});
    expect(resolveRegionFlexStyle({ type: 'text' })).toEqual({});
  });
});

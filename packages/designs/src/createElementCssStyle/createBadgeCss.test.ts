import { describe, expect, it } from 'vitest';
import { createBadgeCss } from './createBadgeCss';

describe('createBadgeCss', () => {
  it('emits nothing for an empty style', () => {
    expect(createBadgeCss({})).toEqual({});
  });

  it('emits every set value', () => {
    expect(
      createBadgeCss({
        fontSize: 'xs',
        fontWeight: 'medium',
        textTransform: 'uppercase',
        borderRadius: 'full',
        padding: '0-5',
        marginRight: '1',
      }),
    ).toEqual({
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-medium)',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-full)',
      padding: 'var(--space-0-5)',
      marginRight: 'var(--space-1)',
    });
  });

  it('emits no colours of its own', () => {
    // A chip's fill and label colour come from its select option,
    // applied by the renderer over this CSS
    const css = createBadgeCss({ fontSize: 'xs', padding: '0-5' });

    expect(css).not.toHaveProperty('color');
    expect(css).not.toHaveProperty('backgroundColor');
  });
});

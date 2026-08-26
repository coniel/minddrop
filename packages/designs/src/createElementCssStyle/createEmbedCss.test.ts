import { describe, expect, it } from 'vitest';
import { createEmbedCss } from './createEmbedCss';

describe('createEmbedCss', () => {
  it('emits nothing for an empty style', () => {
    expect(createEmbedCss({})).toEqual({});
  });

  it('emits every set value', () => {
    expect(
      createEmbedCss({
        background: 'subtle',
        aspectRatio: '16/9',
        height: 'xl',
        borderStyle: 'solid',
        borderRadius: 'lg',
        marginTop: '2',
      }),
    ).toEqual({
      backgroundColor: 'var(--surface-subtle)',
      aspectRatio: '16 / 9',
      height: 'var(--size-xl)',
      border: 'var(--border-width-thin) solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      marginTop: 'var(--space-2)',
    });
  });

  it('emits a fill height as flex growth', () => {
    expect(createEmbedCss({ height: 'fill' })).toEqual({
      flexGrow: 1,
      flexBasis: 0,
      minHeight: 0,
    });
  });
});

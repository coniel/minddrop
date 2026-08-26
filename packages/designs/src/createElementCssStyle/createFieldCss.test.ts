import { describe, expect, it } from 'vitest';
import { createFieldCss } from './createFieldCss';

describe('createFieldCss', () => {
  it('emits nothing for an empty style', () => {
    expect(createFieldCss({})).toEqual({});
  });

  it('emits every set value', () => {
    expect(
      createFieldCss({
        fontFamily: 'mono',
        fontSize: 'base',
        fontWeight: 'medium',
        lineHeight: 'none',
        color: 'subtle',
        background: 'subtle',
        paddingTop: '1',
        marginBottom: '2',
        borderStyle: 'solid',
        borderRadius: 'sm',
        maxWidth: 'content',
      }),
    ).toEqual({
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 'var(--line-height-none)',
      color: 'var(--text-muted)',
      backgroundColor: 'var(--surface-subtle)',
      paddingTop: 'var(--space-1)',
      marginBottom: 'var(--space-2)',
      border: 'var(--border-width-thin) solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      maxWidth: 'var(--measure-content)',
    });
  });

  it('pairs a solid background with the contrasting text colour', () => {
    expect(createFieldCss({ background: 'solid' })).toEqual({
      backgroundColor: 'var(--surface-solid-accent)',
      color: 'var(--text-on-solid)',
    });
  });
});

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
        color: 'on-solid',
        background: 'solid-accent',
        borderStyle: 'solid',
        borderColor: 'strong',
        borderRadius: 'full',
        padding: '0-5',
        marginRight: '1',
      }),
    ).toEqual({
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-medium)',
      textTransform: 'uppercase',
      color: 'var(--text-on-solid)',
      backgroundColor: 'var(--surface-solid-accent)',
      border: 'var(--border-width-thin) solid var(--border-strong)',
      borderRadius: 'var(--radius-full)',
      padding: 'var(--space-0-5)',
      marginRight: 'var(--space-1)',
    });
  });

  it('defaults the border color when only a border style is set', () => {
    expect(createBadgeCss({ borderStyle: 'dashed' })).toEqual({
      border: 'var(--border-width-thin) dashed var(--border-default)',
    });
  });
});

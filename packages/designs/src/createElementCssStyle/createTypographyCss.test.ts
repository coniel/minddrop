import { describe, expect, it } from 'vitest';
import { createTypographyCss } from './createTypographyCss';

describe('createTypographyCss', () => {
  it('emits nothing for an empty style', () => {
    expect(createTypographyCss({})).toEqual({});
  });

  it('emits every set value', () => {
    expect(
      createTypographyCss({
        fontFamily: 'serif',
        fontSize: 'md',
        fontWeight: 'semibold',
        lineHeight: 'relaxed',
        letterSpacing: 'wide',
        color: 'muted',
        textAlign: 'center',
        textTransform: 'uppercase',
        italic: true,
        truncate: 2,
        marginTop: '2',
        marginBottom: '4',
        maxWidth: 'content',
      }),
    ).toEqual({
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--font-size-md)',
      fontWeight: 'var(--font-weight-semibold)',
      lineHeight: 'var(--line-height-relaxed)',
      letterSpacing: 'var(--letter-spacing-wide)',
      color: 'var(--text-muted)',
      textAlign: 'center',
      textTransform: 'uppercase',
      fontStyle: 'italic',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
      overflow: 'hidden',
      marginTop: 'var(--space-2)',
      marginBottom: 'var(--space-4)',
      maxWidth: 'var(--measure-content)',
    });
  });

  it('caps the width at a measure', () => {
    expect(createTypographyCss({ maxWidth: 'narrow' })).toEqual({
      maxWidth: 'var(--measure-narrow)',
    });
  });

  it('does not truncate at zero lines', () => {
    expect(createTypographyCss({ truncate: 0 })).toEqual({});
  });
});

import { describe, expect, it } from 'vitest';
import { createEditorCss, createEditorTitleCss } from './createEditorCss';

describe('createEditorCss', () => {
  it('emits nothing for an empty style', () => {
    expect(createEditorCss({})).toEqual({});
  });

  it('emits every set value', () => {
    expect(
      createEditorCss({
        fontFamily: 'serif',
        fontSize: 'md',
        lineHeight: 'relaxed',
        color: 'regular',
        paddingTop: '4',
        marginBottom: '2',
        borderStyle: 'solid',
        maxWidth: 'content',
      }),
    ).toEqual({
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--font-size-md)',
      lineHeight: 'var(--line-height-relaxed)',
      color: 'var(--text-regular)',
      paddingTop: 'var(--space-4)',
      marginBottom: 'var(--space-2)',
      border: 'var(--border-width-thin) solid var(--border-default)',
      maxWidth: 'var(--measure-content)',
    });
  });
});

describe('createEditorTitleCss', () => {
  it('resolves the default title variant styles', () => {
    expect(createEditorTitleCss({})).toEqual({
      fontSize: 'var(--font-size-md)',
      fontWeight: 'var(--font-weight-semibold)',
      lineHeight: 'var(--line-height-tight)',
    });
  });

  it('resolves the selected variant against the layout context', () => {
    expect(createEditorTitleCss({ title: { variant: 'lg' } }, 'page')).toEqual({
      fontSize: 'var(--font-size-5xl)',
      fontWeight: 'var(--font-weight-bold)',
      lineHeight: 'var(--line-height-tight)',
    });
  });

  it('applies the title colour over the variant styles', () => {
    expect(createEditorTitleCss({ title: { color: 'subtle' } }).color).toBe(
      'var(--text-muted)',
    );
  });
});

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
        color: 'regular',
        paddingTop: '4',
        marginBottom: '2',
        borderStyle: 'solid',
        maxWidth: 'content',
      }),
    ).toEqual({
      fontFamily: 'var(--font-serif)',
      color: 'var(--text-regular)',
      paddingTop: 'var(--space-4)',
      marginBottom: 'var(--space-2)',
      border: 'var(--border-width-thin) solid var(--border-default)',
      maxWidth: 'var(--measure-content)',
    });
  });
});

describe('createEditorTitleCss', () => {
  it('emits nothing without a title style', () => {
    expect(createEditorTitleCss({})).toEqual({});
  });

  it('emits the nested title typography', () => {
    expect(
      createEditorTitleCss({
        title: { fontSize: '4xl', fontWeight: 'bold' },
      }),
    ).toEqual({
      fontSize: 'var(--font-size-4xl)',
      fontWeight: 'var(--font-weight-bold)',
    });
  });
});

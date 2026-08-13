import { describe, expect, it } from 'vitest';
import { createBackdropCss, createContainerCss } from './createContainerCss';

describe('createContainerCss', () => {
  it('emits only the flex base for an empty style', () => {
    expect(createContainerCss({})).toEqual({
      display: 'flex',
      flexDirection: 'column',
    });
  });

  it('emits every set value', () => {
    expect(
      createContainerCss({
        direction: 'row',
        align: 'center',
        justify: 'space-between',
        wrap: true,
        gap: '2',
        background: 'raised',
        shadow: 'raised',
        minHeight: 'md',
        paddingTop: '4',
        paddingLeft: '4',
        marginBottom: '2',
        borderStyle: 'solid',
        borderColor: 'subtle',
        borderWidth: 'medium',
        borderRadius: 'lg',
        width: 'full',
        fontFamily: 'mono',
        color: 'muted',
      }),
    ).toEqual({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
      backgroundColor: 'var(--surface-raised)',
      boxShadow: 'var(--shadow-raised)',
      minHeight: 'var(--size-md)',
      paddingTop: 'var(--space-4)',
      paddingLeft: 'var(--space-4)',
      marginBottom: 'var(--space-2)',
      border: 'var(--border-width-medium) solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      width: '100%',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)',
    });
  });

  it('maps start and end alignment onto flex values', () => {
    expect(createContainerCss({ align: 'start', justify: 'end' })).toEqual({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
    });
  });

  it('draws the border only on restricted edges', () => {
    expect(
      createContainerCss({
        borderStyle: 'solid',
        borderColor: 'primary',
        borderWidth: 'thick',
        borderEdges: ['left'],
      }),
    ).toEqual({
      display: 'flex',
      flexDirection: 'column',
      borderLeft: 'var(--border-width-thick) solid var(--border-primary)',
    });
  });
});

describe('createBackdropCss', () => {
  it('returns null without a backdrop treatment', () => {
    expect(createBackdropCss({})).toBeNull();
  });

  it('emits the blur preset', () => {
    expect(createBackdropCss({ backdrop: 'blur' })).toEqual({
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    });
  });

  it('emits the fade mask for the blur-fade preset', () => {
    const css = createBackdropCss({ backdrop: 'blur-fade' });

    expect(css?.backdropFilter).toBe('blur(12px)');
    expect(css?.maskImage).toBe(
      'linear-gradient(to bottom, black 40%, transparent)',
    );
  });
});

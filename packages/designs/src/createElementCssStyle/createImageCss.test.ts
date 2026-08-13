import { describe, expect, it } from 'vitest';
import { createImageCss } from './createImageCss';

describe('createImageCss', () => {
  it('emits nothing for an empty style', () => {
    expect(createImageCss({})).toEqual({});
  });

  it('emits every set value', () => {
    expect(
      createImageCss({
        aspectRatio: 'landscape',
        objectFit: 'cover',
        width: 'full',
        height: 'md',
        borderStyle: 'solid',
        borderRadius: 'md',
        marginBottom: '2',
      }),
    ).toEqual({
      aspectRatio: '4 / 3',
      objectFit: 'cover',
      width: '100%',
      height: 'var(--size-md)',
      border: 'var(--border-width-thin) solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--space-2)',
    });
  });

  it('emits a fill height as flex growth', () => {
    expect(createImageCss({ height: 'fill' })).toEqual({
      flexGrow: 1,
      minHeight: 0,
    });
  });

  it('maps each aspect preset onto its ratio', () => {
    expect(createImageCss({ aspectRatio: 'square' }).aspectRatio).toBe('1 / 1');
    expect(createImageCss({ aspectRatio: 'portrait' }).aspectRatio).toBe(
      '3 / 4',
    );
    expect(createImageCss({ aspectRatio: 'wide' }).aspectRatio).toBe('16 / 9');
  });
});

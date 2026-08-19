import { describe, expect, it } from 'vitest';
import { createImageCss } from './createImageCss';

describe('createImageCss', () => {
  it('spans the container whatever else is set', () => {
    // Images have no width of their own
    expect(createImageCss({})).toEqual({ width: '100%' });
  });

  it('emits every set value', () => {
    expect(
      createImageCss({
        aspectRatio: '4/3',
        objectFit: 'cover',
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
      border: 'var(--border-width-thin) solid var(--border-neutral)',
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--space-2)',
    });
  });

  it('emits a fill height as flex growth', () => {
    expect(createImageCss({ height: 'fill' })).toEqual({
      flexGrow: 1,
      flexBasis: 0,
      minHeight: 0,
      width: '100%',
    });
  });

  it('spaces each ratio out into its CSS value', () => {
    expect(createImageCss({ aspectRatio: '1/1' }).aspectRatio).toBe('1 / 1');
    expect(createImageCss({ aspectRatio: '2/3' }).aspectRatio).toBe('2 / 3');
    expect(createImageCss({ aspectRatio: '16/9' }).aspectRatio).toBe('16 / 9');
  });
});

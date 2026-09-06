import { describe, expect, it } from 'vitest';
import { createIconContainerCss, createIconCss } from './createIconCss';

describe('createIconCss', () => {
  it('emits nothing for an empty style', () => {
    expect(createIconCss({})).toEqual({});
  });

  it('emits a square icon size and color', () => {
    expect(createIconCss({ size: 'lg', color: 'solid' })).toEqual({
      width: 'var(--icon-size-lg)',
      height: 'var(--icon-size-lg)',
      color: 'var(--text-solid)',
    });
  });
});

describe('createIconContainerCss', () => {
  it('returns null without a container', () => {
    expect(createIconContainerCss({})).toBeNull();
  });

  it('emits the container box values', () => {
    expect(
      createIconContainerCss({
        container: { background: 'subtle', radius: 'md', padding: '1' },
      }),
    ).toEqual({
      backgroundColor: 'var(--surface-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-1)',
    });
  });
});

import { describe, expect, it } from 'vitest';
import { createPropertyIconCss } from './createPropertyIconCss';

describe('createPropertyIconCss', () => {
  it('defaults the colour to subtle', () => {
    expect(createPropertyIconCss({})).toEqual({
      color: 'var(--text-muted)',
    });
  });

  it('emits the set colour', () => {
    expect(createPropertyIconCss({ color: 'regular' })).toEqual({
      color: 'var(--text-regular)',
    });
  });
});

import { describe, expect, it } from 'vitest';
import { createPropertyLabelCss } from './createPropertyLabelCss';

describe('createPropertyLabelCss', () => {
  it('defaults the colour to subtle', () => {
    expect(createPropertyLabelCss({})).toEqual({
      color: 'var(--text-muted)',
    });
  });

  it('emits the set colour', () => {
    expect(createPropertyLabelCss({ color: 'solid' })).toEqual({
      color: 'var(--text-solid)',
    });
  });
});

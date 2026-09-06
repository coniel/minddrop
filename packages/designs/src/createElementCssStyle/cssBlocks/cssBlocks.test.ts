import { describe, expect, it } from 'vitest';
import { backgroundCss } from './cssBlocks';

describe('backgroundCss', () => {
  it('emits nothing without an emphasis step', () => {
    expect(backgroundCss({})).toEqual({});
  });

  it('paints each emphasis step on its schemable surface', () => {
    expect(backgroundCss({ background: 'subtle' })).toEqual({
      backgroundColor: 'var(--surface-subtle)',
    });
    expect(backgroundCss({ background: 'regular' })).toEqual({
      backgroundColor: 'var(--surface-accent)',
    });
  });

  it('flips the text inside a solid fill to the contrasting role', () => {
    expect(backgroundCss({ background: 'solid' })).toEqual({
      backgroundColor: 'var(--surface-solid-accent)',
      color: 'var(--text-on-solid)',
    });
  });

  it('degrades an unknown step to no background', () => {
    // Values left behind by removed vocabulary must not break CSS
    // emission
    expect(
      backgroundCss({ background: 'raised' as unknown as 'subtle' }),
    ).toEqual({});
  });
});

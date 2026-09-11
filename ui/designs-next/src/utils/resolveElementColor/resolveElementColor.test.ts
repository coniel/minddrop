import { describe, expect, it } from 'vitest';
import { resolveElementColor } from './resolveElementColor';

describe('resolveElementColor', () => {
  it('resolves the element colour to its palette token', () => {
    expect(resolveElementColor({ color: 'red', level: 900 })).toBe(
      'var(--red-900)',
    );
  });

  it('leaves an element without a colour of its own unset', () => {
    expect(resolveElementColor()).toBeUndefined();
  });
});

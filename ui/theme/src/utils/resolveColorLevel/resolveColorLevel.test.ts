import { describe, expect, it } from 'vitest';
import { resolveColorLevel } from './resolveColorLevel';

describe('resolveColorLevel', () => {
  it('resolves the palette token of the colour', () => {
    expect(resolveColorLevel('blue', 700)).toBe('var(--blue-700)');
  });

  it('resolves the default colour to the accent ramp', () => {
    // A scheme rebinds the accent ramp to its own hue.
    expect(resolveColorLevel('default', 1200)).toBe('var(--accent-1200)');
  });
});

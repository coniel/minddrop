import { describe, expect, it } from 'vitest';
import { resolveCornerRadius } from './resolveCornerRadius';

describe('resolveCornerRadius', () => {
  it('resolves a radius to its theme token', () => {
    expect(resolveCornerRadius('md')).toBe('var(--radius-md)');
  });

  it('resolves no radius to a square corner', () => {
    expect(resolveCornerRadius('none')).toBe('0');
  });
});

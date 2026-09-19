import { describe, expect, it } from 'vitest';
import { resolveDropPosition } from './resolveDropPosition';

// A target 100px square at the viewport's origin
const rect = new DOMRect(0, 0, 100, 100);

describe('resolveDropPosition', () => {
  it('resolves inside for a container', () => {
    expect(resolveDropPosition(rect, 10, 10)).toBe('inside');
  });

  it('divides a vertical target at its midpoint', () => {
    expect(resolveDropPosition(rect, 50, 49, { axis: 'vertical' })).toBe(
      'before',
    );
    expect(resolveDropPosition(rect, 50, 50, { axis: 'vertical' })).toBe(
      'after',
    );
  });

  it('divides a horizontal target at its midpoint', () => {
    expect(resolveDropPosition(rect, 49, 50, { axis: 'horizontal' })).toBe(
      'before',
    );
    expect(resolveDropPosition(rect, 50, 50, { axis: 'horizontal' })).toBe(
      'after',
    );
  });

  it('resolves inside between the edge zones when the inside is enabled', () => {
    const options = { axis: 'vertical' as const, enableInside: true };

    expect(resolveDropPosition(rect, 50, 24, options)).toBe('before');
    expect(resolveDropPosition(rect, 50, 50, options)).toBe('inside');
    expect(resolveDropPosition(rect, 50, 76, options)).toBe('after');
  });

  it('sizes the edge zones by the edge threshold', () => {
    const options = {
      axis: 'vertical' as const,
      enableInside: true,
      edgeThreshold: 0.1,
    };

    expect(resolveDropPosition(rect, 50, 9, options)).toBe('before');
    expect(resolveDropPosition(rect, 50, 11, options)).toBe('inside');
  });
});

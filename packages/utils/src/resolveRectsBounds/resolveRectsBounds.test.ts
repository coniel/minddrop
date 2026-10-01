import { describe, expect, it } from 'vitest';
import { resolveRectsBounds } from './resolveRectsBounds';

describe('resolveRectsBounds', () => {
  it('bounds the boxes', () => {
    expect(
      resolveRectsBounds([
        { left: 10, top: 20, width: 100, height: 12 },
        { left: 30, top: 40, width: 50, height: 12 },
      ]),
    ).toEqual({ left: 10, top: 20, width: 100, height: 32 });
  });

  it('bounds a single box as itself', () => {
    const rect = { left: 10, top: 20, width: 100, height: 12 };

    expect(resolveRectsBounds([rect])).toEqual(rect);
  });
});

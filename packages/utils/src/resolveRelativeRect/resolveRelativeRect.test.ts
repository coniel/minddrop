import { describe, expect, it } from 'vitest';
import { resolveRelativeRect } from './resolveRelativeRect';

describe('resolveRelativeRect', () => {
  it('offsets the box by the container position', () => {
    expect(
      resolveRelativeRect(
        { left: 120, top: 70, width: 200, height: 24 },
        { left: 100, top: 50, width: 800, height: 1200 },
      ),
    ).toEqual({ left: 20, top: 20, width: 200, height: 24 });
  });
});

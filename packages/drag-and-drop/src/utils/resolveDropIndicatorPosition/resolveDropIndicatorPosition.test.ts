import { describe, expect, it } from 'vitest';
import { resolveDropIndicatorPosition } from './resolveDropIndicatorPosition';

describe('resolveDropIndicatorPosition', () => {
  it('marks a drop before the first item as the start', () => {
    expect(resolveDropIndicatorPosition('before', 0)).toBe('start');
  });

  it('marks a drop after the last item as the end', () => {
    expect(resolveDropIndicatorPosition('after', 3, true)).toBe('end');
  });

  it('keeps a drop before an item after the first', () => {
    expect(resolveDropIndicatorPosition('before', 1)).toBe('before');
  });

  it('keeps a drop after an item before the last', () => {
    expect(resolveDropIndicatorPosition('after', 1)).toBe('after');
  });

  it('keeps a drop inside', () => {
    expect(resolveDropIndicatorPosition('inside', 0, true)).toBe('inside');
  });
});

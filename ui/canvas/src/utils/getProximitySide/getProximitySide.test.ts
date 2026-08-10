import { describe, expect, it } from 'vitest';
import { getProximitySide } from './getProximitySide';

const size = { width: 200, height: 100 };

describe('getProximitySide', () => {
  it('returns null away from all edges', () => {
    expect(getProximitySide(size, { x: 100, y: 50 }, 10)).toBeNull();
  });

  it('returns the side of a nearby edge with its distance', () => {
    expect(getProximitySide(size, { x: 5, y: 50 }, 10)).toEqual({
      side: 'left',
      distance: 5,
    });
    expect(getProximitySide(size, { x: 195, y: 50 }, 10)?.side).toBe('right');
    expect(getProximitySide(size, { x: 100, y: 5 }, 10)?.side).toBe('top');
    expect(getProximitySide(size, { x: 100, y: 95 }, 10)?.side).toBe('bottom');
  });

  it('detects points just outside the edge', () => {
    expect(getProximitySide(size, { x: -5, y: 50 }, 10)?.side).toBe('left');
    expect(getProximitySide(size, { x: 100, y: 105 }, 10)?.side).toBe('bottom');
  });

  it('picks the closest edge near a corner', () => {
    expect(getProximitySide(size, { x: 3, y: 8 }, 10)?.side).toBe('left');
    expect(getProximitySide(size, { x: 8, y: 3 }, 10)?.side).toBe('top');
  });

  it('respects the threshold', () => {
    expect(getProximitySide(size, { x: 15, y: 50 }, 10)).toBeNull();
    expect(getProximitySide(size, { x: 15, y: 50 }, 20)?.side).toBe('left');
  });
});

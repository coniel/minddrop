import { describe, expect, it } from 'vitest';
import { CanvasConnectionAnchor } from '../../types';
import { getConnectionPathBounds } from './getConnectionPathBounds';

const start: CanvasConnectionAnchor = { point: { x: 0, y: 0 }, side: 'bottom' };
const end: CanvasConnectionAnchor = { point: { x: 200, y: 0 }, side: 'bottom' };

describe('getConnectionPathBounds', () => {
  it('encloses a direct connection with its endpoints', () => {
    expect(getConnectionPathBounds(start, end, 'direct')).toEqual({
      x: 0,
      y: 0,
      width: 200,
      height: 0,
    });
  });

  it('follows the curve rather than the control points', () => {
    const bounds = getConnectionPathBounds(start, end, 'curved');

    // The control points sit 100 below the anchors, but the
    // curve only reaches 75 down at its midpoint
    expect(bounds.height).toBeCloseTo(75);
    expect(bounds.y).toBe(0);
  });

  it('encloses an elbow route including its corners', () => {
    const bounds = getConnectionPathBounds(
      { point: { x: 0, y: 0 }, side: 'right' },
      { point: { x: 200, y: 100 }, side: 'left' },
      'straight',
    );

    expect(bounds).toEqual({ x: 0, y: 0, width: 200, height: 100 });
  });
});

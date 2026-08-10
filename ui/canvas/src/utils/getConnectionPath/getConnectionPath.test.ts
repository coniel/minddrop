import { describe, expect, it } from 'vitest';
import { getConnectionPath } from './getConnectionPath';

describe('getConnectionPath', () => {
  it('returns a cubic bezier path between the anchors', () => {
    const path = getConnectionPath(
      { point: { x: 0, y: 0 }, side: 'right' },
      { point: { x: 200, y: 0 }, side: 'left' },
    );

    expect(path).toBe('M 0 0 C 100 0, 100 0, 200 0');
  });

  it('curves out of each anchor side', () => {
    const path = getConnectionPath(
      { point: { x: 0, y: 0 }, side: 'bottom' },
      { point: { x: 0, y: 200 }, side: 'top' },
    );

    expect(path).toBe('M 0 0 C 0 100, 0 100, 0 200');
  });

  it('draws a direct line for the direct shape', () => {
    const path = getConnectionPath(
      { point: { x: 0, y: 0 }, side: 'right' },
      { point: { x: 200, y: 100 }, side: 'left' },
      'direct',
    );

    expect(path).toBe('M 0 0 L 200 100');
  });

  it('draws axis-aligned segments for the straight shape', () => {
    const path = getConnectionPath(
      { point: { x: 0, y: 0 }, side: 'right' },
      { point: { x: 200, y: 100 }, side: 'left' },
      'straight',
    );

    // Steps across at the halfway line between the anchors
    expect(path).toBe('M 0 0 L 100 0 L 100 100 L 200 100');
  });
});

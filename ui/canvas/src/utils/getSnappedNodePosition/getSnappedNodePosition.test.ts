import { describe, expect, it } from 'vitest';
import { GRID_SIZE } from '../../constants';
import { getSnappedNodePosition } from './getSnappedNodePosition';

const frame = { x: 0, y: 0, width: 100, height: 100 };

// A node aligned with the dragged node's left edge
const target = { x: 200, y: 400, width: 100, height: 100 };

const options = {
  grid: false,
  objects: false,
  targets: [],
  threshold: 10,
};

describe('getSnappedNodePosition', () => {
  it('returns the dragged position when snapping is off', () => {
    expect(getSnappedNodePosition({ x: 203, y: 97 }, frame, options)).toEqual({
      x: 203,
      y: 97,
      guides: [],
    });
  });

  it('lands the position on the grid', () => {
    const snapped = getSnappedNodePosition({ x: GRID_SIZE + 1, y: 1 }, frame, {
      ...options,
      grid: true,
    });

    expect(snapped).toEqual({ x: GRID_SIZE, y: 0, guides: [] });
  });

  it('aligns to the other nodes', () => {
    const snapped = getSnappedNodePosition({ x: 203, y: 100 }, frame, {
      ...options,
      objects: true,
      targets: [target],
    });

    expect(snapped.x).toBe(200);
    expect(snapped.guides.length).toBeGreaterThan(0);
  });

  it('aligns from the grid position, so the two combine', () => {
    const snapped = getSnappedNodePosition({ x: 203, y: 100 }, frame, {
      ...options,
      grid: true,
      objects: true,
      targets: [target],
    });

    expect(snapped.x).toBe(200);
  });

  it('does not align an unregistered node', () => {
    const snapped = getSnappedNodePosition({ x: 203, y: 100 }, null, {
      ...options,
      objects: true,
      targets: [target],
    });

    expect(snapped).toEqual({ x: 203, y: 100, guides: [] });
  });
});

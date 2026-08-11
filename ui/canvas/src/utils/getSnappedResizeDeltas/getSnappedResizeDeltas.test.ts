import { describe, expect, it } from 'vitest';
import { GRID_SIZE } from '../../constants';
import { CanvasNodeResizeEdge } from '../../types';
import { getSnappedResizeDeltas } from './getSnappedResizeDeltas';

// A node at (0, 0) sized 100x100
function resizeState(edge: CanvasNodeResizeEdge) {
  return {
    edge,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    originWidth: 100,
    originHeight: 100,
  };
}

// A node whose left edge sits at 120
const target = { x: 120, y: 0, width: 100, height: 100 };

const options = {
  grid: false,
  objects: false,
  targets: [],
  threshold: 6,
  mirror: false,
};

describe('getSnappedResizeDeltas', () => {
  it('returns the dragged distance when snapping is off', () => {
    expect(
      getSnappedResizeDeltas(resizeState('right'), { x: 23, y: 0 }, options),
    ).toEqual({ x: 23, y: 0, guides: [] });
  });

  it('lands the moving edge on the grid', () => {
    const snapped = getSnappedResizeDeltas(
      resizeState('right'),
      { x: GRID_SIZE + 2, y: 0 },
      { ...options, grid: true },
    );

    // The right edge starts at 100 and lands on the grid line
    // above it, so the distance shrinks by the remainder
    expect(snapped.x).toBe(GRID_SIZE * 5 - 100);
  });

  it('aligns the moving edge to the other nodes', () => {
    const snapped = getSnappedResizeDeltas(
      resizeState('right'),
      { x: 18, y: 0 },
      { ...options, objects: true, targets: [target] },
    );

    expect(snapped.x).toBe(20);
    expect(snapped.guides).toHaveLength(1);
  });

  it('leaves the axes the resize does not move unaligned', () => {
    const snapped = getSnappedResizeDeltas(
      resizeState('right'),
      { x: 0, y: 18 },
      { ...options, objects: true, targets: [target] },
    );

    expect(snapped.y).toBe(18);
    expect(snapped.guides).toHaveLength(0);
  });

  it('leaves edges out of aligning range where they are', () => {
    const snapped = getSnappedResizeDeltas(
      resizeState('right'),
      { x: 5, y: 0 },
      { ...options, objects: true, targets: [target] },
    );

    expect(snapped.x).toBe(5);
    expect(snapped.guides).toHaveLength(0);
  });
});

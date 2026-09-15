import { describe, expect, it } from 'vitest';
import {
  DEFAULT_NODE_WIDTH,
  ESTIMATED_NODE_HEIGHT,
  NODE_GAP,
  UNPLACED_SECTION_GAP,
} from '../../constants';
import { CanvasViewNode } from '../../types';
import { getUnplacedNodePositions } from './getUnplacedNodePositions';

const placedNode: CanvasViewNode = {
  type: 'entry',
  id: 'entry-1',
  x: 100,
  y: 50,
  width: 300,
  height: 200,
};

describe('getUnplacedNodePositions', () => {
  it('starts at the origin on an empty canvas', () => {
    expect(getUnplacedNodePositions([], 1)).toEqual([{ x: 0, y: 0 }]);
  });

  it('places nodes below the placed bounding box', () => {
    const [position] = getUnplacedNodePositions([placedNode], 1);

    expect(position).toEqual({
      x: 100,
      y: 50 + 200 + UNPLACED_SECTION_GAP,
    });
  });

  it('estimates the height of auto-height nodes', () => {
    const autoHeightNode = { ...placedNode, height: undefined };
    const [position] = getUnplacedNodePositions([autoHeightNode], 1);

    expect(position.y).toBe(50 + ESTIMATED_NODE_HEIGHT + UNPLACED_SECTION_GAP);
  });

  it('lays out positions in rows', () => {
    const positions = getUnplacedNodePositions([], 5);

    // First row fills left to right
    expect(positions[1]).toEqual({ x: DEFAULT_NODE_WIDTH + NODE_GAP, y: 0 });
    // Fifth position wraps to the second row
    expect(positions[4]).toEqual({ x: 0, y: ESTIMATED_NODE_HEIGHT + NODE_GAP });
  });

  it('is deterministic for the same input', () => {
    expect(getUnplacedNodePositions([placedNode], 3)).toEqual(
      getUnplacedNodePositions([placedNode], 3),
    );
  });
});

import { describe, expect, it } from 'vitest';
import { CanvasNodeFrame } from '../../types';
import { getConnectionDropTarget } from './getConnectionDropTarget';

const nodes: Record<string, CanvasNodeFrame> = {
  'node-1': { x: 0, y: 0, width: 200, height: 100 },
  'node-2': { x: 400, y: 0, width: 200, height: 100 },
};

describe('getConnectionDropTarget', () => {
  it('returns null when no node is within reach', () => {
    expect(
      getConnectionDropTarget(nodes, { x: 300, y: 50 }, 'node-1', 20),
    ).toBeNull();
  });

  it('targets the node under the cursor', () => {
    expect(
      getConnectionDropTarget(nodes, { x: 410, y: 50 }, 'node-1', 20),
    ).toEqual({ nodeId: 'node-2', side: 'left' });
  });

  it('snaps to nodes within the proximity threshold', () => {
    expect(
      getConnectionDropTarget(nodes, { x: 385, y: 50 }, 'node-1', 20),
    ).toEqual({ nodeId: 'node-2', side: 'left' });
  });

  it('measures diagonal distance to corners', () => {
    // 10px right of and 30px above the frame corner, out of reach
    // despite both axis distances being near it
    expect(
      getConnectionDropTarget(nodes, { x: 390, y: -30 }, 'node-1', 20),
    ).toBeNull();
  });

  it('excludes the anchored node', () => {
    expect(
      getConnectionDropTarget(nodes, { x: 100, y: 50 }, 'node-1', 20),
    ).toBeNull();
  });

  it('targets the nearest of multiple nodes in reach', () => {
    const close: Record<string, CanvasNodeFrame> = {
      'node-1': { x: 0, y: 0, width: 200, height: 100 },
      'node-2': { x: 230, y: 0, width: 200, height: 100 },
    };

    expect(
      getConnectionDropTarget(close, { x: 220, y: 50 }, 'anchor', 30),
    ).toEqual({ nodeId: 'node-2', side: 'left' });
  });
});

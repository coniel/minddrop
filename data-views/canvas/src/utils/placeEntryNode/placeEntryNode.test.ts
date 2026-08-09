import { describe, expect, it } from 'vitest';
import { DEFAULT_NODE_WIDTH } from '../../constants';
import { CanvasViewNode } from '../../types';
import { placeEntryNode } from './placeEntryNode';

const node: CanvasViewNode = {
  type: 'entry',
  id: 'entry-a',
  x: 0,
  y: 0,
  width: 400,
};

describe('placeEntryNode', () => {
  it('appends a node for a new entry, centered on the point', () => {
    const result = placeEntryNode([node], 'entry-b', { x: 500, y: 200 });

    expect(result).toEqual([
      node,
      {
        type: 'entry',
        id: 'entry-b',
        x: 500 - DEFAULT_NODE_WIDTH / 2,
        y: 200,
        width: DEFAULT_NODE_WIDTH,
      },
    ]);
  });

  it('moves an already placed entry to the point', () => {
    const result = placeEntryNode([node], 'entry-a', { x: 500, y: 200 });

    // Centered using the node's own width
    expect(result).toEqual([{ ...node, x: 300, y: 200 }]);
  });

  it('rounds placement coordinates', () => {
    const [placed] = placeEntryNode([], 'entry-b', { x: 10.6, y: 20.4 });

    expect(placed.x).toBe(Math.round(10.6 - DEFAULT_NODE_WIDTH / 2));
    expect(placed.y).toBe(20);
  });
});

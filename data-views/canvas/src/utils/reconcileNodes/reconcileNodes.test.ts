import { describe, expect, it } from 'vitest';
import { DEFAULT_NODE_WIDTH } from '../../constants';
import { CanvasViewNode } from '../../types';
import { getUnplacedNodePositions } from '../getUnplacedNodePositions';
import { reconcileNodes } from './reconcileNodes';

const nodeA: CanvasViewNode = {
  type: 'entry',
  id: 'entry-a',
  x: 0,
  y: 0,
  width: 300,
};

const nodeB: CanvasViewNode = {
  type: 'entry',
  id: 'entry-b',
  x: 400,
  y: 100,
  width: 300,
};

describe('reconcileNodes', () => {
  it('keeps placed nodes whose entries are in the collection', () => {
    expect(reconcileNodes([nodeA, nodeB], ['entry-a', 'entry-b'])).toEqual([
      nodeA,
      nodeB,
    ]);
  });

  it('removes nodes whose entries are no longer in the collection', () => {
    expect(reconcileNodes([nodeA, nodeB], ['entry-a'])).toEqual([nodeA]);
  });

  it('appends nodes for unplaced entries', () => {
    const [position] = getUnplacedNodePositions([nodeA], 1);
    const result = reconcileNodes([nodeA], ['entry-a', 'entry-c']);

    expect(result).toEqual([
      nodeA,
      {
        type: 'entry',
        id: 'entry-c',
        x: position.x,
        y: position.y,
        width: DEFAULT_NODE_WIDTH,
      },
    ]);
  });

  it('places all entries of a fresh canvas', () => {
    const result = reconcileNodes([], ['entry-a', 'entry-b']);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('entry-a');
    // Placed side by side, not stacked
    expect(result[0].x).not.toBe(result[1].x);
  });

  it('returns the filtered nodes when everything is placed', () => {
    const result = reconcileNodes([nodeA], ['entry-a']);

    expect(result).toEqual([nodeA]);
  });
});

import { describe, expect, it } from 'vitest';
import { CanvasViewNode } from '../../types';
import { updateNodeFrame } from './updateNodeFrame';

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

describe('updateNodeFrame', () => {
  it('updates the target node frame', () => {
    const result = updateNodeFrame([nodeA, nodeB], 'entry-b', {
      x: 500,
      y: 200,
      width: 350,
    });

    expect(result).toEqual([nodeA, { ...nodeB, x: 500, y: 200, width: 350 }]);
  });

  it('returns an equivalent list when the node is missing', () => {
    expect(
      updateNodeFrame([nodeA], 'missing', { x: 1, y: 2, width: 3 }),
    ).toEqual([nodeA]);
  });
});

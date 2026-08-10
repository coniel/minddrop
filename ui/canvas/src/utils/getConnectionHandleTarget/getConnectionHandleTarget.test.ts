import { describe, expect, it } from 'vitest';
import { getConnectionHandleTarget } from './getConnectionHandleTarget';

const nodes = {
  'node-1': { x: 0, y: 0, width: 200, height: 100 },
  'node-2': { x: 300, y: 0, width: 200, height: 100 },
};

describe('getConnectionHandleTarget', () => {
  it('returns null away from all nodes', () => {
    expect(getConnectionHandleTarget(nodes, { x: 250, y: 50 }, 10)).toBeNull();
  });

  it('returns null inside a node away from its edges', () => {
    expect(getConnectionHandleTarget(nodes, { x: 100, y: 50 }, 10)).toBeNull();
  });

  it('detects a nearby edge from inside the node', () => {
    expect(getConnectionHandleTarget(nodes, { x: 195, y: 50 }, 10)).toEqual({
      nodeId: 'node-1',
      side: 'right',
    });
  });

  it('detects a nearby edge from outside the node', () => {
    expect(getConnectionHandleTarget(nodes, { x: 208, y: 50 }, 10)).toEqual({
      nodeId: 'node-1',
      side: 'right',
    });
  });

  it('picks the closest node when edges of several are near', () => {
    const adjacent = {
      'node-1': { x: 0, y: 0, width: 200, height: 100 },
      'node-2': { x: 212, y: 0, width: 200, height: 100 },
    };

    expect(getConnectionHandleTarget(adjacent, { x: 205, y: 50 }, 10)).toEqual({
      nodeId: 'node-1',
      side: 'right',
    });
    expect(getConnectionHandleTarget(adjacent, { x: 209, y: 50 }, 10)).toEqual({
      nodeId: 'node-2',
      side: 'left',
    });
  });
});

import { describe, expect, it } from 'vitest';
import { getVisibleSnapTargets } from './getVisibleSnapTargets';

const nodes = {
  'node-1': { x: 0, y: 0, width: 100, height: 100 },
  'node-2': { x: 200, y: 0, width: 100, height: 100 },
  'node-3': { x: 2000, y: 2000, width: 100, height: 100 },
};

const viewport = { x: 0, y: 0, width: 1000, height: 1000 };

describe('getVisibleSnapTargets', () => {
  it('returns the other nodes within the viewport', () => {
    expect(getVisibleSnapTargets(nodes, 'node-1', viewport)).toEqual([
      nodes['node-2'],
    ]);
  });

  it('omits the node itself', () => {
    expect(getVisibleSnapTargets(nodes, 'node-2', viewport)).toEqual([
      nodes['node-1'],
    ]);
  });

  it('returns all other nodes while the viewport is unmeasured', () => {
    expect(getVisibleSnapTargets(nodes, 'node-1', null)).toEqual([
      nodes['node-2'],
      nodes['node-3'],
    ]);
  });
});

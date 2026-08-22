import { describe, expect, it } from 'vitest';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { connectQueryNodeToNearest } from './connectQueryNodeToNearest';

const { query_1 } = QueryFixtures;

// The fixture's nodes: source at x 0 (220 wide), filter at
// x 300 (280 wide), results at x 600
const [sourceNode, filterNode, resultsNode] = query_1.nodes;

describe('connectQueryNodeToNearest', () => {
  it('connects the node to its nearest neighbours on both sides', () => {
    const connections = connectQueryNodeToNearest(
      { ...query_1, connections: [] },
      filterNode.id,
    );

    expect(connections).toEqual([
      expect.objectContaining({ from: sourceNode.id, to: filterNode.id }),
      expect.objectContaining({ from: filterNode.id, to: resultsNode.id }),
    ]);
  });

  it('connects a stack of roughly aligned neighbours', () => {
    // A second source stacked below the first, slightly offset
    const stackedSource = { ...sourceNode, id: 'query-node_stacked', x: 10 };

    const connections = connectQueryNodeToNearest(
      {
        ...query_1,
        nodes: [...query_1.nodes, stackedSource],
        connections: [],
      },
      filterNode.id,
    );

    expect(connections).toEqual([
      expect.objectContaining({ from: sourceNode.id, to: filterNode.id }),
      expect.objectContaining({ from: stackedSource.id, to: filterNode.id }),
      expect.objectContaining({ from: filterNode.id, to: resultsNode.id }),
    ]);
  });

  it('excludes neighbours beyond the stack window', () => {
    // A second source far left of the nearest one
    const farSource = { ...sourceNode, id: 'query-node_far', x: -300 };

    const connections = connectQueryNodeToNearest(
      {
        ...query_1,
        nodes: [...query_1.nodes, farSource],
        connections: [],
      },
      filterNode.id,
    );

    expect(connections).toEqual([
      expect.objectContaining({ from: sourceNode.id, to: filterNode.id }),
      expect.objectContaining({ from: filterNode.id, to: resultsNode.id }),
    ]);
  });

  it('skips sides the node has no port on', () => {
    // Sources have no input, so only the output side connects
    const connections = connectQueryNodeToNearest(
      { ...query_1, connections: [] },
      sourceNode.id,
    );

    expect(connections).toEqual([
      expect.objectContaining({ from: sourceNode.id, to: filterNode.id }),
    ]);
  });

  it('skips existing connections', () => {
    // The source is already connected into the filter
    const existing = query_1.connections[0];

    const connections = connectQueryNodeToNearest(
      { ...query_1, connections: [existing] },
      filterNode.id,
    );

    expect(connections).toEqual([
      existing,
      expect.objectContaining({ from: filterNode.id, to: resultsNode.id }),
    ]);
  });

  it('returns the connections unchanged when there is nothing to connect', () => {
    const connections = connectQueryNodeToNearest(
      { ...query_1, nodes: [filterNode], connections: [] },
      filterNode.id,
    );

    expect(connections).toEqual([]);
  });
});

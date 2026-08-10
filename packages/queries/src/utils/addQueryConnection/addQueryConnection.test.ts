import { describe, expect, it } from 'vitest';
import { query_1 } from '../../test-utils/queries.fixtures';
import { addQueryConnection } from './addQueryConnection';

// The fixture query's nodes, connected source → filter → results
const [sourceNode, filterNode, resultsNode] = query_1.nodes;

// The fixture query without any connections
const unconnectedQuery = { ...query_1, connections: [] };

describe('addQueryConnection', () => {
  it('adds a connection between two nodes', () => {
    const connections = addQueryConnection(
      unconnectedQuery,
      sourceNode.id,
      filterNode.id,
    );

    expect(connections).toEqual([
      { id: expect.any(String), from: sourceNode.id, to: filterNode.id },
    ]);
  });

  it('ignores self connections', () => {
    const connections = addQueryConnection(
      unconnectedQuery,
      filterNode.id,
      filterNode.id,
    );

    expect(connections).toEqual([]);
  });

  it('ignores duplicate connections', () => {
    const connections = addQueryConnection(
      query_1,
      sourceNode.id,
      filterNode.id,
    );

    expect(connections).toBe(query_1.connections);
  });

  it('ignores connections involving missing nodes', () => {
    const connections = addQueryConnection(
      unconnectedQuery,
      'missing',
      filterNode.id,
    );

    expect(connections).toEqual([]);
  });

  it('ignores connections out of the results node', () => {
    const connections = addQueryConnection(
      unconnectedQuery,
      resultsNode.id,
      filterNode.id,
    );

    expect(connections).toEqual([]);
  });

  it('ignores connections into a source node', () => {
    const connections = addQueryConnection(
      unconnectedQuery,
      filterNode.id,
      sourceNode.id,
    );

    expect(connections).toEqual([]);
  });

  it('ignores connections which would create a cycle', () => {
    // A second filter chained after the fixture's filter
    const secondFilter = { ...filterNode, id: 'query-node_filter-b' };
    const query = {
      ...query_1,
      nodes: [sourceNode, filterNode, secondFilter, resultsNode],
      connections: [
        { id: 'query-connection_a', from: sourceNode.id, to: filterNode.id },
        { id: 'query-connection_b', from: filterNode.id, to: secondFilter.id },
      ],
    };

    // Connecting the chain's end back to its start would loop
    const connections = addQueryConnection(
      query,
      secondFilter.id,
      filterNode.id,
    );

    expect(connections).toBe(query.connections);
  });
});

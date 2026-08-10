import { describe, expect, it } from 'vitest';
import { query_1 } from '../../test-utils/queries.fixtures';
import { removeQueryNodeConnections } from './removeQueryNodeConnections';

describe('removeQueryNodeConnections', () => {
  it("removes the node's incoming and outgoing connections", () => {
    // The filter node sits mid-flow with one incoming and one
    // outgoing connection
    const connections = removeQueryNodeConnections(
      query_1.connections,
      query_1.nodes[1].id,
    );

    expect(connections).toEqual([]);
  });

  it('keeps connections of other nodes', () => {
    // The source node only has an outgoing connection
    const connections = removeQueryNodeConnections(
      query_1.connections,
      query_1.nodes[0].id,
    );

    expect(connections).toEqual([query_1.connections[1]]);
  });

  it('returns the same reference when the node has no connections', () => {
    const connections = removeQueryNodeConnections(
      query_1.connections,
      'missing',
    );

    expect(connections).toBe(query_1.connections);
  });
});

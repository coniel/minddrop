import { describe, expect, it } from 'vitest';
import { query_1 } from '../../test-utils/queries.fixtures';
import { removeQueryNode } from './removeQueryNode';

// The fixture query's nodes, connected source → filter → results
const [sourceNode, filterNode, resultsNode] = query_1.nodes;

describe('removeQueryNode', () => {
  it('removes the node and its connections', () => {
    const { nodes, connections } = removeQueryNode(query_1, filterNode.id);

    // The filter node is dropped
    expect(nodes).toEqual([sourceNode, resultsNode]);

    // Both connections attached to the filter node are dropped
    expect(connections).toEqual([]);
  });

  it('keeps connections not attached to the node', () => {
    // Splice a limit node between the filter and results nodes
    const limitNode = {
      id: 'limit',
      type: 'limit' as const,
      x: 0,
      y: 0,
      count: 5,
    };
    const query = {
      ...query_1,
      nodes: [...query_1.nodes, limitNode],
      connections: [
        query_1.connections[0],
        { id: 'to-limit', from: filterNode.id, to: limitNode.id },
        { id: 'from-limit', from: limitNode.id, to: resultsNode.id },
      ],
    };

    const { connections } = removeQueryNode(query, limitNode.id);

    expect(connections).toEqual([query_1.connections[0]]);
  });

  it('does not remove the source node', () => {
    const { nodes, connections } = removeQueryNode(query_1, sourceNode.id);

    expect(nodes).toBe(query_1.nodes);
    expect(connections).toBe(query_1.connections);
  });

  it('does not remove the results node', () => {
    const { nodes, connections } = removeQueryNode(query_1, resultsNode.id);

    expect(nodes).toBe(query_1.nodes);
    expect(connections).toBe(query_1.connections);
  });

  it('returns the graph unchanged when the node does not exist', () => {
    const { nodes, connections } = removeQueryNode(query_1, 'missing');

    expect(nodes).toBe(query_1.nodes);
    expect(connections).toBe(query_1.connections);
  });
});

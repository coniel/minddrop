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
    const { connections } = removeQueryNode(query_1, sourceNode.id);

    expect(connections).toEqual([
      { id: expect.any(String), from: filterNode.id, to: resultsNode.id },
    ]);
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

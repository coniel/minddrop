import { describe, expect, it } from 'vitest';
import { query_1 } from '../../test-utils/queries.fixtures';
import { QueryFilterNode } from '../../types';
import { updateQueryNode } from './updateQueryNode';

// The fixture query's filter node
const filterNode = query_1.nodes[1] as QueryFilterNode;

describe('updateQueryNode', () => {
  it('updates the target node fields', () => {
    const nodes = updateQueryNode<QueryFilterNode>(
      query_1.nodes,
      filterNode.id,
      { operator: 'starts-with', value: 'bar' },
    );

    expect(nodes[1]).toEqual({
      ...filterNode,
      operator: 'starts-with',
      value: 'bar',
    });
  });

  it('leaves other nodes unchanged', () => {
    const nodes = updateQueryNode(query_1.nodes, filterNode.id, { x: 100 });

    expect(nodes[0]).toBe(query_1.nodes[0]);
    expect(nodes[2]).toBe(query_1.nodes[2]);
  });

  it('returns the nodes unchanged when the target does not exist', () => {
    const nodes = updateQueryNode(query_1.nodes, 'missing', { x: 100 });

    expect(nodes).toEqual(query_1.nodes);
  });
});

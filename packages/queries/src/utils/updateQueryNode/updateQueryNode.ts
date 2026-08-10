import { QueryNode } from '../../types';

/**
 * Returns the given nodes with the target node's fields
 * updated. Returns the nodes unchanged when the target does
 * not exist.
 *
 * @param nodes - The query's nodes.
 * @param nodeId - The ID of the node to update.
 * @param data - The node fields to update.
 *
 * @returns The updated nodes.
 */
export function updateQueryNode<TNode extends QueryNode>(
  nodes: QueryNode[],
  nodeId: string,
  data: Partial<Omit<TNode, 'id' | 'type'>>,
): QueryNode[] {
  // Merge the update into the target node
  return nodes.map((node) => {
    if (node.id !== nodeId) {
      return node;
    }

    return { ...node, ...data } as QueryNode;
  });
}

import { Query, QueryNode, QuerySourceNode } from '../types';

/**
 * Returns a query's source node, or null when the graph has
 * none.
 *
 * @param query - The query whose source node to get.
 *
 * @returns The source node, or null.
 */
export function getQuerySourceNode(query: Query): QuerySourceNode | null {
  return (
    query.nodes.find(
      (node: QueryNode): node is QuerySourceNode => node.type === 'source',
    ) ?? null
  );
}

import { Database, withImplicitMetadataProperties } from '@minddrop/databases';
import { Query } from '@minddrop/queries';
import { getQueryUpstreamDatabases } from '../getQueryUpstreamDatabases';

/**
 * Returns the source databases flowing into a filter or sort
 * node whose entries lack the node's configured property,
 * either by name or by type.
 *
 * Returns an empty array for other node types and unconfigured
 * nodes.
 *
 * @param query - The query containing the node.
 * @param nodeId - The ID of the node.
 *
 * @returns The mismatched source databases.
 */
export function getQueryMismatchedSourceDatabases(
  query: Query,
  nodeId: string,
): Database[] {
  const node = query.nodes.find((queryNode) => queryNode.id === nodeId);

  // Only property based nodes can mismatch their inputs
  if (node?.type !== 'filter' && node?.type !== 'sort') {
    return [];
  }

  // Unconfigured nodes accept any input
  if (!node.property || !node.propertyType) {
    return [];
  }

  // Collect the upstream databases lacking the property
  return getQueryUpstreamDatabases(query, nodeId).filter(
    (database) =>
      !withImplicitMetadataProperties(database.properties).some(
        (property) =>
          property.name === node.property &&
          property.type === node.propertyType,
      ),
  );
}

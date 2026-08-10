import { withImplicitTitleProperty } from '@minddrop/databases';
import { PropertySchema } from '@minddrop/properties';
import { Query } from '@minddrop/queries';
import { getQueryUpstreamDatabases } from '../getQueryUpstreamDatabases';

/**
 * Returns the merged property schemas of the databases upstream
 * of a query graph node, including the implicit title property.
 * Properties sharing a name across databases are merged into
 * the first occurrence.
 *
 * @param query - The query containing the node.
 * @param nodeId - The ID of the node whose upstream properties to get.
 *
 * @returns The merged upstream property schemas.
 */
export function getQueryUpstreamProperties(
  query: Query,
  nodeId: string,
): PropertySchema[] {
  const databases = getQueryUpstreamDatabases(query, nodeId);

  const merged: PropertySchema[] = [];

  // Merge each database's schema, first occurrence per name wins
  databases.forEach((database) => {
    withImplicitTitleProperty(database.properties).forEach((property) => {
      if (!merged.some((existing) => existing.name === property.name)) {
        merged.push(property);
      }
    });
  });

  return merged;
}

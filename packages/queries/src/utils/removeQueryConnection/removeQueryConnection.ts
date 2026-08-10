import { QueryConnection } from '../../types';

/**
 * Removes a connection from a query graph's connections.
 *
 * @param connections - The query's connections.
 * @param connectionId - The ID of the connection to remove.
 *
 * @returns The updated connections.
 */
export function removeQueryConnection(
  connections: QueryConnection[],
  connectionId: string,
): QueryConnection[] {
  // Drop the target connection
  return connections.filter((connection) => connection.id !== connectionId);
}

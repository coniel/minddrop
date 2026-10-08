import { Sql } from '@minddrop/sql';
import { SCHEMA_SQL } from '../sql/schema';

/**
 * Opens a workspace's connection through the registered test SQL
 * adapter and creates the databases schema in it. Each workspace
 * connected this way gets a database of its own.
 *
 * @param workspaceId - The ID of the workspace to connect.
 */
export function connectTestSqlWorkspace(workspaceId: string): void {
  // Open the workspace's connection
  Sql.connect(workspaceId);

  // Create the databases schema
  Sql.exec(workspaceId, SCHEMA_SQL);
}

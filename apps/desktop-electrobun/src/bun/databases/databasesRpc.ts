import type { Database, SqlInitializeResult } from '@minddrop/databases';
import { Databases } from '@minddrop/databases';

/**
 * RPC handler for initializing the SQL database with
 * all database and entry data for a workspace.
 */
export async function handleDatabasesSqlInitialize(params: {
  workspaceId: string;
  databases: Database[];
}): Promise<SqlInitializeResult> {
  return Databases.sql.initialize(params.workspaceId, params.databases);
}

import { Sql } from '@minddrop/sql';
import type { SqlOperation, SqlParam } from '@minddrop/sql';

/**
 * RPC handler for opening a workspace's SQL database.
 */
export async function handleSqlOpen(params: {
  workspaceId: string;
  path: string;
  schema: string;
  version: number;
}): Promise<{ schemaChanged: boolean }> {
  return Sql.open(params.workspaceId, params.path, {
    schema: params.schema,
    version: params.version,
  });
}

/**
 * RPC handler for executing raw SQL.
 */
export async function handleSqlExec(params: {
  workspaceId: string;
  sql: string;
}): Promise<void> {
  Sql.exec(params.workspaceId, params.sql);
}

/**
 * RPC handler for executing a parameterized statement.
 */
export async function handleSqlRun(params: {
  workspaceId: string;
  sql: string;
  params: SqlParam[];
}): Promise<void> {
  Sql.run(params.workspaceId, params.sql, ...params.params);
}

/**
 * RPC handler for querying a single row.
 */
export async function handleSqlGet(params: {
  workspaceId: string;
  sql: string;
  params: SqlParam[];
}): Promise<unknown> {
  return Sql.get(params.workspaceId, params.sql, ...params.params);
}

/**
 * RPC handler for querying all rows.
 */
export async function handleSqlAll(params: {
  workspaceId: string;
  sql: string;
  params: SqlParam[];
}): Promise<unknown[]> {
  return Sql.all(params.workspaceId, params.sql, ...params.params);
}

/**
 * RPC handler for executing operations in a transaction.
 */
export async function handleSqlTransaction(params: {
  workspaceId: string;
  operations: SqlOperation[];
}): Promise<void> {
  Sql.transaction(params.workspaceId, params.operations);
}

/**
 * RPC handler for closing a workspace's SQL connection.
 */
export async function handleSqlClose(params: {
  workspaceId: string;
}): Promise<void> {
  Sql.close(params.workspaceId);
}

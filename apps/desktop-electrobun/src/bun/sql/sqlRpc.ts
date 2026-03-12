import { Sql } from '@minddrop/sql';
import type { SqlOperation, SqlParam } from '@minddrop/sql';

/**
 * RPC handler for opening a SQL database.
 */
export async function handleSqlOpen(params: {
  path: string;
  schema: string;
  version: number;
}): Promise<{ schemaChanged: boolean }> {
  return Sql.open(params.path, {
    schema: params.schema,
    version: params.version,
  });
}

/**
 * RPC handler for executing raw SQL.
 */
export async function handleSqlExec(params: { sql: string }): Promise<void> {
  Sql.exec(params.sql);
}

/**
 * RPC handler for executing a parameterized statement.
 */
export async function handleSqlRun(params: {
  sql: string;
  params: SqlParam[];
}): Promise<void> {
  Sql.run(params.sql, ...params.params);
}

/**
 * RPC handler for querying a single row.
 */
export async function handleSqlGet(params: {
  sql: string;
  params: SqlParam[];
}): Promise<unknown> {
  return Sql.get(params.sql, ...params.params);
}

/**
 * RPC handler for querying all rows.
 */
export async function handleSqlAll(params: {
  sql: string;
  params: SqlParam[];
}): Promise<unknown[]> {
  return Sql.all(params.sql, ...params.params);
}

/**
 * RPC handler for executing operations in a transaction.
 */
export async function handleSqlTransaction(params: {
  operations: SqlOperation[];
}): Promise<void> {
  Sql.transaction(params.operations);
}

/**
 * RPC handler for closing the SQL connection.
 */
export async function handleSqlClose(): Promise<void> {
  Sql.close();
}

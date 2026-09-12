import { Fs } from '@minddrop/file-system';
import { getSqlAdapter, registerSqlAdapter } from '../SqlAdapter';
import type { SqlConnection, SqlOperation, SqlParam } from '../types';

// The open database connections, keyed by workspace ID
const connections = new Map<string, SqlConnection>();

// Re-export registerAdapter for the public API
export { registerSqlAdapter as registerAdapter };

/**
 * Opens or creates a workspace's SQL database at the given path.
 * Handles schema versioning: if the stored schema version
 * does not match the provided version, the database is
 * dropped and recreated from scratch.
 *
 * Replaces the workspace's existing connection, if any.
 *
 * @param workspaceId - The ID of the workspace the database belongs to.
 * @param path - The path of the database file.
 * @param options - The schema and its version.
 * @returns Whether the schema changed (database was recreated).
 */
export async function open(
  workspaceId: string,
  path: string,
  options: { schema: string; version: number },
): Promise<{ schemaChanged: boolean }> {
  // Close the workspace's existing connection if open
  close(workspaceId);

  // Ensure the directory exists
  const directory = path.replace(/\/[^/]+$/, '');
  await Fs.ensureDir(directory);

  const adapter = getSqlAdapter();
  let schemaChanged = false;

  // Check if existing database has a matching schema version
  try {
    const database = adapter.open(workspaceId, path);
    database.exec('PRAGMA foreign_keys = ON');

    const row = database.get(
      "SELECT value FROM meta WHERE key = 'schema_version'",
    ) as { value: string } | null;

    const storedVersion = row ? parseInt(row.value, 10) : 0;

    if (storedVersion !== options.version) {
      // Close and delete the old database
      database.close();

      // Remove the database file and WAL/SHM files
      await safeRemoveFile(path);
      await safeRemoveFile(`${path}-wal`);
      await safeRemoveFile(`${path}-shm`);

      schemaChanged = true;
    } else {
      // Schema matches, reuse the database
      database.exec('PRAGMA journal_mode = WAL');
      connections.set(workspaceId, database);

      return { schemaChanged: false };
    }
  } catch {
    // Database does not exist yet or is corrupt
    schemaChanged = true;
  }

  // Create a fresh database
  const database = adapter.open(workspaceId, path);

  // Enable WAL mode for better concurrent read/write performance
  database.exec('PRAGMA journal_mode = WAL');
  // Enable foreign keys
  database.exec('PRAGMA foreign_keys = ON');

  // Create tables using the provided schema
  database.exec(options.schema);

  // Store the schema version
  database.run(
    "INSERT OR REPLACE INTO meta (key, value) VALUES ('schema_version', ?)",
    String(options.version),
  );

  // Initialize the data version counter
  database.run(
    "INSERT OR IGNORE INTO meta (key, value) VALUES ('version', '0')",
  );

  connections.set(workspaceId, database);

  return { schemaChanged };
}

/**
 * Returns a workspace's database connection.
 * Throws if the workspace has no open connection.
 */
function getConnection(workspaceId: string): SqlConnection {
  const connection = connections.get(workspaceId);

  if (!connection) {
    throw new Error(
      `SQL database not open for workspace '${workspaceId}'. Call Sql.open() or Sql.connect() first.`,
    );
  }

  return connection;
}

/**
 * Executes raw SQL (DDL, multi-statement) against a workspace's
 * database.
 */
export function exec(workspaceId: string, sql: string): void {
  getConnection(workspaceId).exec(sql);
}

/**
 * Executes a statement with parameters (INSERT/UPDATE/DELETE)
 * against a workspace's database.
 */
export function run(
  workspaceId: string,
  sql: string,
  ...params: SqlParam[]
): void {
  getConnection(workspaceId).run(sql, ...params);
}

/**
 * Executes a query against a workspace's database and returns
 * the first matching row, or null if no rows match.
 */
export function get<T = unknown>(
  workspaceId: string,
  sql: string,
  ...params: SqlParam[]
): T | null {
  const result = getConnection(workspaceId).get(sql, ...params);

  return (result ?? null) as T | null;
}

/**
 * Executes a query against a workspace's database and returns
 * all matching rows.
 */
export function all<T = unknown>(
  workspaceId: string,
  sql: string,
  ...params: SqlParam[]
): T[] {
  return getConnection(workspaceId).all(sql, ...params) as T[];
}

/**
 * Executes an array of operations atomically in a transaction
 * against a workspace's database.
 */
export function transaction(
  workspaceId: string,
  operations: SqlOperation[],
): void {
  getConnection(workspaceId).transaction(operations);
}

/**
 * Opens a workspace's connection via the registered adapter
 * without opening a database file. Call where the database is
 * opened elsewhere, such as by a back end the adapter forwards
 * to.
 *
 * Replaces the workspace's existing connection, if any.
 *
 * @param workspaceId - The ID of the workspace to connect.
 */
export function connect(workspaceId: string): void {
  close(workspaceId);

  connections.set(workspaceId, getSqlAdapter().open(workspaceId, ''));
}

/**
 * Closes a workspace's database connection. Does nothing if the
 * workspace has no open connection.
 *
 * @param workspaceId - The ID of the workspace to disconnect.
 */
export function close(workspaceId: string): void {
  const connection = connections.get(workspaceId);

  if (!connection) {
    return;
  }

  connection.close();
  connections.delete(workspaceId);
}

/**
 * Closes every open database connection.
 */
export function closeAll(): void {
  [...connections.keys()].forEach(close);
}

/**
 * Removes a file if it exists. Silently ignores errors.
 */
async function safeRemoveFile(filePath: string): Promise<void> {
  try {
    if (await Fs.exists(filePath)) {
      await Fs.removeFile(filePath);
    }
  } catch {
    // Ignore errors (file may not exist)
  }
}

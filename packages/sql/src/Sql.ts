import { Fs } from '@minddrop/file-system';
import { getSqlAdapter, registerSqlAdapter } from './SqlAdapter';
import type { SqlConnection, SqlOperation, SqlParam } from './types';

// The currently active database connection
let connection: SqlConnection | null = null;

// Re-export registerAdapter for the public API
export { registerSqlAdapter as registerAdapter };

// Re-export getConfigPath for the public API
export { getSqlConfigPath as getConfigPath } from './sqlConfig';

/**
 * Opens or creates a SQL database at the given path.
 * Handles schema versioning: if the stored schema version
 * does not match the provided version, the database is
 * dropped and recreated from scratch.
 *
 * @returns Whether the schema changed (database was recreated).
 */
export async function open(
  path: string,
  options: { schema: string; version: number },
): Promise<{ schemaChanged: boolean }> {
  // Close existing connection if open
  if (connection) {
    connection.close();
    connection = null;
  }

  // Ensure the directory exists
  const directory = path.replace(/\/[^/]+$/, '');
  await Fs.ensureDir(directory);

  const adapter = getSqlAdapter();
  let schemaChanged = false;

  // Check if existing database has a matching schema version
  try {
    const database = adapter.open(path);
    database.exec('PRAGMA foreign_keys = ON');

    const row = database.get(
      "SELECT value FROM meta WHERE key = 'schema_version'",
    ) as { value: string } | null;

    const storedVersion = row ? parseInt(row.value, 10) : 0;

    if (storedVersion !== options.version) {
      console.log(
        `[sql] Schema version mismatch (stored: ${storedVersion}, current: ${options.version}), rebuilding`,
      );

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
      connection = database;

      return { schemaChanged: false };
    }
  } catch {
    // Database does not exist yet or is corrupt
    schemaChanged = true;
  }

  // Create a fresh database
  const database = adapter.open(path);

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

  connection = database;

  return { schemaChanged };
}

/**
 * Returns the currently active database connection.
 * Throws if no database has been opened.
 */
function getConnection(): SqlConnection {
  if (!connection) {
    throw new Error('SQL database not initialized. Call Sql.open() first.');
  }

  return connection;
}

/**
 * Executes raw SQL (DDL, multi-statement).
 */
export function exec(sql: string): void {
  getConnection().exec(sql);
}

/**
 * Executes a statement with parameters (INSERT/UPDATE/DELETE).
 */
export function run(sql: string, ...params: SqlParam[]): void {
  getConnection().run(sql, ...params);
}

/**
 * Executes a query and returns the first matching row,
 * or null if no rows match.
 */
export function get<T = unknown>(sql: string, ...params: SqlParam[]): T | null {
  const result = getConnection().get(sql, ...params);

  return (result ?? null) as T | null;
}

/**
 * Executes a query and returns all matching rows.
 */
export function all<T = unknown>(sql: string, ...params: SqlParam[]): T[] {
  return getConnection().all(sql, ...params) as T[];
}

/**
 * Executes an array of operations atomically in a transaction.
 */
export function transaction(operations: SqlOperation[]): void {
  getConnection().transaction(operations);
}

/**
 * Initializes the SQL connection via the registered adapter.
 * Call after the adapter has been registered and the database
 * has been opened by the backend.
 */
export function initialize(): void {
  const adapter = getSqlAdapter();

  connection = adapter.open('');
}

/**
 * Closes the active database connection.
 */
export function close(): void {
  if (connection) {
    connection.close();
    connection = null;
  }
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

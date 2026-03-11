/**
 * Valid parameter types for SQLite prepared statements.
 */
export type SqliteParam = string | number | boolean | null | Uint8Array;

/**
 * A minimal prepared statement interface covering only the
 * methods the search package uses. Platform adapters wrap
 * their native statement types to conform to this interface.
 */
export interface SqliteStatement {
  /**
   * Executes the statement with the given parameters.
   * Used for INSERT, UPDATE, DELETE operations.
   */
  run(...params: SqliteParam[]): void;

  /**
   * Executes the statement and returns the first matching row,
   * or null/undefined if no rows match.
   */
  get(...params: SqliteParam[]): unknown;

  /**
   * Executes the statement and returns all matching rows.
   */
  all(...params: SqliteParam[]): unknown[];
}

/**
 * A minimal SQLite database interface covering only the
 * methods the search package uses. Platform adapters wrap
 * their native database types to conform to this interface.
 */
export interface SqliteDatabase {
  /**
   * Prepares a SQL statement for execution.
   */
  prepare(sql: string): SqliteStatement;

  /**
   * Executes raw SQL (e.g. for schema creation, PRAGMA).
   */
  exec(sql: string): void;

  /**
   * Wraps a function in a transaction. Returns a callable
   * that executes the transaction when invoked.
   */
  transaction<T>(fn: () => T): () => T;

  /**
   * Closes the database connection.
   */
  close(): void;
}

/**
 * Factory interface for creating SQLite database connections.
 * Each platform registers an adapter that knows how to open
 * databases using the platform's native SQLite library.
 */
export interface SqliteAdapter {
  /**
   * Opens (or creates) a SQLite database at the given path.
   */
  open(path: string): SqliteDatabase;
}

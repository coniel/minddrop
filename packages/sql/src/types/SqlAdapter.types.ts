/**
 * Valid parameter types for SQL prepared statements.
 */
export type SqlParam = string | number | boolean | null | Uint8Array;

/**
 * A single SQL operation for use in transactions.
 */
export interface SqlOperation {
  /**
   * The parameterized SQL string.
   */
  sql: string;

  /**
   * The parameter values.
   */
  params: SqlParam[];
}

/**
 * A SQL database connection. Platform adapters wrap their
 * native database types to conform to this interface.
 */
export interface SqlConnection {
  /**
   * Executes raw SQL (e.g. for schema creation, PRAGMA).
   */
  exec(sql: string): void;

  /**
   * Executes a statement with parameters (INSERT/UPDATE/DELETE).
   */
  run(sql: string, ...params: SqlParam[]): void;

  /**
   * Executes a query and returns the first matching row,
   * or undefined if no rows match.
   */
  get(sql: string, ...params: SqlParam[]): unknown;

  /**
   * Executes a query and returns all matching rows.
   */
  all(sql: string, ...params: SqlParam[]): unknown[];

  /**
   * Executes an array of operations atomically in a transaction.
   * Rolls back on error.
   */
  transaction(operations: SqlOperation[]): void;

  /**
   * Closes the database connection.
   */
  close(): void;
}

/**
 * Factory interface for creating SQL database connections.
 * Each platform registers an adapter that knows how to open
 * databases using the platform's native SQL library.
 */
export interface SqlAdapter {
  /**
   * Opens (or creates) a SQL database at the given path.
   */
  open(path: string): SqlConnection;
}

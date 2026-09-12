import { DatabaseSync } from 'node:sqlite';
import type {
  SqlAdapter,
  SqlConnection,
  SqlOperation,
  SqlParam,
} from '@minddrop/sql';

export interface TestSqlAdapter extends SqlAdapter {
  /**
   * Closes every database opened through the adapter,
   * discarding their contents.
   */
  dispose(): void;
}

/**
 * Creates a SqlAdapter backed by in-memory node:sqlite
 * databases for use in tests. Register it with
 * `Sql.registerAdapter` and call `Sql.connect` to open a
 * workspace's in-memory connection.
 *
 * A database is kept for the path it was opened with and
 * handed back when that path is opened again, so an index
 * outlives the session which wrote it and the behaviours
 * which only happen on a second launch can be tested.
 * Connections opened without a path are keyed by workspace
 * instead, so each connected workspace gets its own database.
 *
 * @returns The test adapter.
 */
export function createTestSqlAdapter(): TestSqlAdapter {
  // The databases opened through the adapter, keyed by path,
  // standing in for the files a real adapter leaves on disk
  const databases = new Map<string, DatabaseSync>();

  return {
    open(workspaceId: string, path: string): SqlConnection {
      const database = openDatabase(databases, path || workspaceId);

      return {
        exec(sql: string): void {
          database.exec(sql);
        },

        run(sql: string, ...params: SqlParam[]): void {
          database.prepare(sql).run(...normalizeParams(params));
        },

        get(sql: string, ...params: SqlParam[]): unknown {
          return database.prepare(sql).get(...normalizeParams(params));
        },

        all(sql: string, ...params: SqlParam[]): unknown[] {
          return database.prepare(sql).all(...normalizeParams(params));
        },

        transaction(operations: SqlOperation[]): void {
          // Run all operations atomically, rolling back on error
          database.exec('BEGIN');

          try {
            for (const operation of operations) {
              database
                .prepare(operation.sql)
                .run(...normalizeParams(operation.params));
            }

            database.exec('COMMIT');
          } catch (error) {
            database.exec('ROLLBACK');

            throw error;
          }
        },

        close(): void {
          // Leave the database open so that reopening its path
          // hands back the same data, as reopening a database
          // file does. `Sql.open` closes the connection before
          // reopening the same path, which a closed in-memory
          // database could not survive.
        },
      };
    },

    dispose(): void {
      databases.forEach((database) => database.close());
      databases.clear();
    },
  };
}

/**
 * Returns the database opened under the given key, opening a
 * new one if the key has not been opened before.
 */
function openDatabase(
  databases: Map<string, DatabaseSync>,
  key: string,
): DatabaseSync {
  const existing = databases.get(key);

  if (existing) {
    return existing;
  }

  const database = new DatabaseSync(':memory:');

  databases.set(key, database);

  return database;
}

/**
 * Converts boolean parameters to integers, which node:sqlite
 * does not accept natively.
 */
function normalizeParams(
  params: SqlParam[],
): (string | number | null | Uint8Array)[] {
  return params.map((param) => {
    // Booleans bind as 1/0
    if (typeof param === 'boolean') {
      return param ? 1 : 0;
    }

    return param;
  });
}

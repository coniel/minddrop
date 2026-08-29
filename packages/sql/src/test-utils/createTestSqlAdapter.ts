import { DatabaseSync } from 'node:sqlite';
import type { MockFileSystem } from '@minddrop/file-system';
import type {
  SqlAdapter,
  SqlConnection,
  SqlOperation,
  SqlParam,
} from '../types';

/**
 * Creates a SqlAdapter backed by in-memory node:sqlite
 * databases for use in tests.
 *
 * Without a mock file system, every `open` call returns a
 * fresh in-memory database. With one, databases are keyed by
 * path and marked by a file in the mock file system, so a
 * database's state survives close/reopen (as an on-disk
 * database would) and removing the database file discards
 * the stored state.
 *
 * @param mockFileSystem - The mock file system used to track database files.
 * @returns The test SQL adapter.
 */
export function createTestSqlAdapter(
  mockFileSystem?: MockFileSystem,
): SqlAdapter {
  // In-memory databases keyed by the path they were opened with
  const databases = new Map<string, DatabaseSync>();

  return {
    open(path: string): SqlConnection {
      // Without path tracking, back each connection with a fresh database
      if (!mockFileSystem || !path) {
        return wrapDatabase(new DatabaseSync(':memory:'), true);
      }

      // Reuse the stored database while its file still exists
      const existing = databases.get(path);

      if (existing && mockFileSystem.exists(path)) {
        return wrapDatabase(existing, false);
      }

      // Create a fresh database for the path
      const database = new DatabaseSync(':memory:');
      databases.set(path, database);

      // Create the database file in the mock file system
      mockFileSystem.writeTextFile(path, '');

      return wrapDatabase(database, false);
    },
  };
}

/**
 * Wraps a node:sqlite database in the SqlConnection interface.
 *
 * @param database - The database to wrap.
 * @param closeable - Whether `close` closes the underlying database. Path-keyed databases stay open so their state survives reopening.
 * @returns The wrapped connection.
 */
function wrapDatabase(
  database: DatabaseSync,
  closeable: boolean,
): SqlConnection {
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
      // Keep path-keyed databases open so reopening observes their state
      if (closeable) {
        database.close();
      }
    },
  };
}

/**
 * Converts boolean parameters to integers, which node:sqlite
 * does not accept natively.
 *
 * @param params - The parameters to normalize.
 * @returns The normalized parameters.
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

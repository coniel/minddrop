import { DatabaseSync } from 'node:sqlite';
import type {
  SqlAdapter,
  SqlConnection,
  SqlOperation,
  SqlParam,
} from '@minddrop/sql';

/**
 * Creates a SqlAdapter backed by an in-memory node:sqlite
 * database for use in tests. Register it with
 * `Sql.registerAdapter` and call `Sql.initialize()` to open
 * the in-memory connection.
 */
export function createTestSqlAdapter(): SqlAdapter {
  return {
    open(): SqlConnection {
      const database = new DatabaseSync(':memory:');

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
          database.close();
        },
      };
    },
  };
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

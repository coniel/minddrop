import { Database } from 'bun:sqlite';
import type {
  SqlAdapter,
  SqlConnection,
  SqlOperation,
  SqlParam,
} from '@minddrop/sql';

/**
 * Creates a SqlAdapter that wraps Bun's native SQLite
 * database implementation.
 */
export function createBunSqlAdapter(): SqlAdapter {
  return {
    open(path: string): SqlConnection {
      const database = new Database(path);

      return {
        exec(sql: string): void {
          database.exec(sql);
        },

        run(sql: string, ...params: SqlParam[]): void {
          database.prepare(sql).run(...params);
        },

        get(sql: string, ...params: SqlParam[]): unknown {
          return database.prepare(sql).get(...params);
        },

        all(sql: string, ...params: SqlParam[]): unknown[] {
          return database.prepare(sql).all(...params);
        },

        transaction(operations: SqlOperation[]): void {
          // Cache prepared statements for repeated SQL strings
          // within the transaction
          const statementCache = new Map<
            string,
            ReturnType<typeof database.prepare>
          >();

          const transactionFn = database.transaction(() => {
            for (const operation of operations) {
              let statement = statementCache.get(operation.sql);

              if (!statement) {
                statement = database.prepare(operation.sql);
                statementCache.set(operation.sql, statement);
              }

              statement.run(...operation.params);
            }
          });

          transactionFn();
        },

        close(): void {
          database.close();
        },
      };
    },
  };
}

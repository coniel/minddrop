import { Database } from 'bun:sqlite';
import type {
  SqliteAdapter,
  SqliteDatabase,
  SqliteParam,
  SqliteStatement,
} from '@minddrop/search';

/**
 * Creates a SqliteAdapter that wraps Bun's native SQLite
 * database implementation.
 */
export function createBunSqliteAdapter(): SqliteAdapter {
  return {
    open(path: string): SqliteDatabase {
      const database = new Database(path);

      return {
        prepare(sql: string): SqliteStatement {
          const statement = database.prepare(sql);

          return {
            run: (...params: SqliteParam[]) => statement.run(...params),
            get: (...params: SqliteParam[]) => statement.get(...params),
            all: (...params: SqliteParam[]) => statement.all(...params),
          };
        },

        exec(sql: string): void {
          database.exec(sql);
        },

        transaction<T>(fn: () => T): () => T {
          return database.transaction(fn);
        },

        close(): void {
          database.close();
        },
      };
    },
  };
}

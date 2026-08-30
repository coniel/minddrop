import type {
  SqlAdapter,
  SqlConnection,
  SqlOperation,
  SqlParam,
} from '@minddrop/sql';
import { createTestSqlAdapter } from './createTestSqlAdapter';

export interface RecordedSqlStatement {
  /**
   * The executed SQL statement.
   */
  sql: string;

  /**
   * The parameters bound to the statement, in order.
   */
  params: SqlParam[];
}

// Statements executed through the recording adapter
const recordedStatements: RecordedSqlStatement[] = [];

/**
 * Returns the SQL statements executed through the recording
 * adapter so far, in execution order.
 *
 * @returns The recorded statements.
 */
export function getRecordedSqlStatements(): RecordedSqlStatement[] {
  return [...recordedStatements];
}

/**
 * Clears the recorded SQL statement log.
 */
export function clearRecordedSqlStatements(): void {
  recordedStatements.length = 0;
}

/**
 * Creates a SqlAdapter which executes against an in-memory test
 * database while recording every executed statement and its
 * parameters, allowing tests to assert SQL side effects as
 * recorded data.
 *
 * @returns The recording adapter.
 */
export function createRecordingSqlAdapter(): SqlAdapter {
  // Execute against the regular in-memory test adapter
  const adapter = createTestSqlAdapter();

  return {
    open(path: string): SqlConnection {
      const connection = adapter.open(path);

      return {
        exec(sql: string): void {
          // Record the statement before executing it
          recordedStatements.push({ sql, params: [] });
          connection.exec(sql);
        },

        run(sql: string, ...params: SqlParam[]): void {
          // Record the statement before executing it
          recordedStatements.push({ sql, params });
          connection.run(sql, ...params);
        },

        get(sql: string, ...params: SqlParam[]): unknown {
          // Record the statement before executing it
          recordedStatements.push({ sql, params });

          return connection.get(sql, ...params);
        },

        all(sql: string, ...params: SqlParam[]): unknown[] {
          // Record the statement before executing it
          recordedStatements.push({ sql, params });

          return connection.all(sql, ...params);
        },

        transaction(operations: SqlOperation[]): void {
          // Record each operation individually
          operations.forEach((operation) => {
            recordedStatements.push({
              sql: operation.sql,
              params: operation.params,
            });
          });

          connection.transaction(operations);
        },

        close(): void {
          connection.close();
        },
      };
    },
  };
}

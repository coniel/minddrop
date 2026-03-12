import { Sql } from '@minddrop/sql';
import type {
  SqlAdapter,
  SqlConnection,
  SqlOperation,
  SqlParam,
} from '@minddrop/sql';

/**
 * Registers a SQL adapter that forwards SQL operations
 * to the Bun process via RPC.
 */
export function registerSqlAdapterRpc(rpc: any): void {
  const adapter: SqlAdapter = {
    open(path: string): SqlConnection {
      return {
        exec(sql: string): void {
          rpc.request.sqlExec({ sql });
        },

        run(sql: string, ...params: SqlParam[]): void {
          rpc.request.sqlRun({ sql, params });
        },

        get(sql: string, ...params: SqlParam[]): unknown {
          return rpc.request.sqlGet({ sql, params });
        },

        all(sql: string, ...params: SqlParam[]): unknown[] {
          return rpc.request.sqlAll({ sql, params });
        },

        transaction(operations: SqlOperation[]): void {
          rpc.request.sqlTransaction({ operations });
        },

        close(): void {
          rpc.request.sqlClose({});
        },
      };
    },
  };

  Sql.registerAdapter(adapter);
}

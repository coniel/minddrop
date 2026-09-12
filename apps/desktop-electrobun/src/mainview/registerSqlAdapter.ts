import { Sql } from '@minddrop/sql';
import type {
  SqlAdapter,
  SqlConnection,
  SqlOperation,
  SqlParam,
} from '@minddrop/sql';
import type { WebviewRpcClient } from '../types';

/**
 * Registers a SQL adapter that forwards SQL operations
 * to the Bun process via RPC.
 */
export function registerSqlAdapterRpc(rpc: WebviewRpcClient): void {
  const adapter: SqlAdapter = {
    // The Bun process opens the database itself, so the path is unused
    open(workspaceId: string): SqlConnection {
      return {
        exec(sql: string): void {
          rpc.request.sqlExec({ workspaceId, sql });
        },

        run(sql: string, ...params: SqlParam[]): void {
          rpc.request.sqlRun({ workspaceId, sql, params });
        },

        get(sql: string, ...params: SqlParam[]): unknown {
          return rpc.request.sqlGet({ workspaceId, sql, params });
        },

        all(sql: string, ...params: SqlParam[]): unknown[] {
          // Resolves asynchronously despite the synchronous signature.
          // Renderer-side readers await the result, which is a no-op
          // under the truly synchronous adapters.
          return rpc.request.sqlAll({
            workspaceId,
            sql,
            params,
          }) as unknown as unknown[];
        },

        transaction(operations: SqlOperation[]): void {
          rpc.request.sqlTransaction({ workspaceId, operations });
        },

        close(): void {
          rpc.request.sqlClose({ workspaceId });
        },
      };
    },
  };

  Sql.registerAdapter(adapter);
}

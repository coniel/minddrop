// Minimal declarations for the node:sqlite module, which the
// workspace @types/node version does not yet cover. Used only
// by the in-memory test SQL adapter.
declare module 'node:sqlite' {
  type SqliteParam = string | number | bigint | null | Uint8Array;

  export interface StatementSync {
    run(...params: SqliteParam[]): unknown;
    get(...params: SqliteParam[]): unknown;
    all(...params: SqliteParam[]): unknown[];
  }

  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}

import { Sql } from '@minddrop/sql';

/**
 * Returns the current version counter.
 */
export function sqlGetVersion(): number {
  const row = Sql.get<{ value: string }>(
    "SELECT value FROM meta WHERE key = 'version'",
  );

  return row ? parseInt(row.value, 10) : 0;
}

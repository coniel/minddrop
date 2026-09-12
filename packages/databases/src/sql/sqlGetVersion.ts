import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';

/**
 * Returns the current version counter.
 *
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 */
export function sqlGetVersion(workspaceId?: string): number {
  const row = Sql.get<{ value: string }>(
    workspaceId ?? Workspaces.getActive().id,
    "SELECT value FROM meta WHERE key = 'version'",
  );

  return row ? parseInt(row.value, 10) : 0;
}

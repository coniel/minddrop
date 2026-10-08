import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';

/**
 * Retrieves all databases.
 *
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 */
export function sqlGetAllDatabases(workspaceId?: string): {
  id: string;
  name: string;
  path: string;
  icon: string;
  propertiesHash: string;
}[] {
  return Sql.all<{
    id: string;
    name: string;
    path: string;
    icon: string;
    propertiesHash: string;
  }>(
    workspaceId ?? Workspaces.getActive().id,
    'SELECT id, name, path, icon, properties_hash AS propertiesHash FROM databases',
  );
}

import { Sql } from '@minddrop/sql';

/**
 * Retrieves all databases.
 */
export function sqlGetAllDatabases(): {
  id: string;
  name: string;
  path: string;
  icon: string;
}[] {
  return Sql.all<{
    id: string;
    name: string;
    path: string;
    icon: string;
  }>('SELECT id, name, path, icon FROM databases');
}

import { sqlUpsertDatabase } from '../sql/sqlUpsertDatabase';
import { databases } from './fixtures';

/**
 * Indexes every fixture database in SQL.
 *
 * @param workspaceId - The workspace to index them into. Omit for the
 *   active workspace.
 */
export function seedSqlDatabases(workspaceId?: string): void {
  // Upsert each fixture database
  databases.forEach((database) => {
    sqlUpsertDatabase(
      {
        id: database.id,
        name: database.name,
        path: database.path,
        icon: database.icon,
        properties: database.properties,
      },
      { silent: true },
      workspaceId,
    );
  });
}

import { sqlUpsertDatabase } from '../sql/sqlUpsertDatabase';
import { databases } from './fixtures';

/**
 * Indexes every fixture database in SQL.
 */
export function seedSqlDatabases(): void {
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
    );
  });
}

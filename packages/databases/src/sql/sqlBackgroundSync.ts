import { getDatabaseSqlAdapter } from '../DatabaseSqlAdapter';

/**
 * Triggers a background filesystem scan to detect changes
 * that occurred while the app was not running. Results are
 * delivered via a message callback.
 */
export function sqlBackgroundSync(workspacePath: string): void {
  getDatabaseSqlAdapter().backgroundSync(workspacePath);
}

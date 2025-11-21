import { DatabaseAutomationActionConfigsStore } from '../DatabaseAutomationActionConfigsStore';
import { getDatabase } from '../getDatabase';
import { DatabaseAutomationActionConfig, DatabaseEntry } from '../types';

/**
 * Runs create-entry automations on the given entry.
 *
 * @param entry - The entry to run create-entry automations on.
 */
export function runCreateEntryDatabaseAutomations(entry: DatabaseEntry): void {
  // Get the entry's parent database
  const database = getDatabase(entry.database);

  // If the database has no automations, there's nothing to do
  if (!database.automations?.length) {
    return;
  }

  // Run create-entry automations on properties that have changed
  database.automations
    .filter((automation) => automation.type === 'create-entry')
    .forEach((automation) => {
      // Run the automation's actions
      automation.actions.forEach((action) => {
        // Get the action's config
        const actionConfig = DatabaseAutomationActionConfigsStore.get(
          action.type,
        );

        // If the action's config doesn't exist, there's nothing to do
        if (!actionConfig) {
          return;
        }

        // Run the action
        (actionConfig as DatabaseAutomationActionConfig).run(action, entry);
      });
    });
}

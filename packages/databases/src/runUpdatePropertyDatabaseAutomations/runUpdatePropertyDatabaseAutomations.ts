import { DatabaseAutomationActionConfigsStore } from '../DatabaseAutomationActionConfigsStore';
import { getDatabase } from '../getDatabase';
import { DatabaseEntry } from '../types';

/**
 * Runs update-property automations on the given entry.
 *
 * @param original - The original entry.
 * @param updated - The updated entry.
 */
export function runUpdatePropertyDatabaseAutomations(
  original: DatabaseEntry,
  updated: DatabaseEntry,
): void {
  // Get the entry's parent database
  const database = getDatabase(original.database);

  // If the database has no automations, there's nothing to do
  if (!database.automations?.length) {
    return;
  }

  // Run update-property automations on properties that have changed
  database.automations
    .filter((automation) => automation.type === 'update-property')
    .forEach((automation) => {
      const originalPropertyValue = original.properties[automation.property!];
      const updatedPropertyValue = updated.properties[automation.property!];

      // If the property values are the same, there's nothing to do
      if (originalPropertyValue === updatedPropertyValue) {
        return;
      }

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
        actionConfig.run(
          action,
          updated,
          updatedPropertyValue,
          originalPropertyValue,
        );
      });
    });
}

import { Events } from '@minddrop/events';
import { DatabaseAutomationActionConfigsStore } from '../DatabaseAutomationActionConfigsStore';
import { coreDatabaseAutomationActionConfigs } from '../automation-action-configs';
import {
  DatabaseEntryCreatedEvent,
  DatabaseEntryUpdatedEvent,
} from '../events';
import { runCreateEntryDatabaseAutomations } from '../runCreateEntryDatabaseAutomations';
import { runUpdatePropertyDatabaseAutomations } from '../runUpdatePropertyDatabaseAutomations';

const Listeners = {
  'create-entry': 'databases:automations:create-entry',
  'update-property': 'databases:automations:update-property',
};

/**
 * Initializes database automations. This includes loading core automation
 * action configs into the store, listening for new entries being created and
 * run create-entry automations, and listening for entries being updated and
 * run update-property automations.
 */
export function initializeDatabaseAutomations(): void {
  // Load core automation action configs into the store
  DatabaseAutomationActionConfigsStore.load(
    coreDatabaseAutomationActionConfigs,
  );

  // Listen for new entries being created and run create-entry automations
  Events.addListener(
    DatabaseEntryCreatedEvent,
    Listeners['create-entry'],
    (entry) => {
      runCreateEntryDatabaseAutomations(entry);

      // Also run update-property automations with empty properties
      // on the original entry as new properties are considered to be
      // 'updated' from nothing to something.
      runUpdatePropertyDatabaseAutomations({ ...entry, properties: {} }, entry);
    },
  );

  // Listen for entries being updated and run update-property automations
  Events.addListener(
    DatabaseEntryUpdatedEvent,
    Listeners['update-property'],
    ({ original, updated }) =>
      runUpdatePropertyDatabaseAutomations(original, updated),
  );
}

/**
 * Cleans up database automations. This includes cleariing the store of
 * automation action configs and removing all event listeners added by
 * initializeDatabaseAutomations.
 */
export function cleanupDatabaseAutomations(): void {
  DatabaseAutomationActionConfigsStore.clear();

  Events.removeListener(DatabaseEntryCreatedEvent, Listeners['create-entry']);
  Events.removeListener(
    DatabaseEntryUpdatedEvent,
    Listeners['update-property'],
  );
}

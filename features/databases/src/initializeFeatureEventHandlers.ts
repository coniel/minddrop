import { Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { onDeleteDatabase } from './event-handlers';
import { EventListenerId } from './events';

/**
 * Registers feature-level event handlers for database
 * lifecycle events.
 */
export function initializeDatabasesFeatureEventHandlers(): void {
  // Handle database deleted events
  Events.addListener(
    Databases.events.Deleted,
    `${EventListenerId}:view-state`,
    (data) => {
      onDeleteDatabase(data);
    },
  );
}

/**
 * Removes feature-level event handlers.
 */
export function cleanupDatabasesFeatureEventHandlers(): void {
  Events.removeListener(
    Databases.events.Deleted,
    `${EventListenerId}:view-state`,
  );
}

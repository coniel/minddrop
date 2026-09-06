import { DatabaseEntries, Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Tags } from '@minddrop/tags';
import {
  onDatabaseEntryDeleted,
  onDatabaseEntryRenamed,
  onDatabasePropertyRenamed,
  onDatabaseRenamed,
  onTagRenamed,
} from '../event-handlers';

/**
 * Initializes snapshots by subscribing to the content packages'
 * domain events, recording renames in the rename ledger as a side
 * effect. The content packages themselves know nothing about the
 * ledger.
 */
export function initializeSnapshots(): void {
  // Record entry renames in the rename ledger
  Events.on(DatabaseEntries.events.Renamed, 'snapshots', (data) =>
    onDatabaseEntryRenamed(data),
  );

  // Record database renames in the rename ledger
  Events.on(Databases.events.Renamed, 'snapshots', (data) =>
    onDatabaseRenamed(data),
  );

  // Record property renames in the rename ledger
  Events.on(Databases.events.PropertyRenamed, 'snapshots', (data) =>
    onDatabasePropertyRenamed(data),
  );

  // Retract dead untitled rename chains on entry deletion
  Events.on(DatabaseEntries.events.Deleted, 'snapshots', (data) =>
    onDatabaseEntryDeleted(data),
  );

  // Record tag renames in the rename ledger
  Events.on(Tags.events.Renamed, 'snapshots', (data) => onTagRenamed(data));
}

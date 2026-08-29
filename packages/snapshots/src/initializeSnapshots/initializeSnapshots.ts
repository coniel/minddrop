import {
  DatabaseEntryDeletedEvent,
  DatabaseEntryRenamedEvent,
  DatabasePropertyRenamedEvent,
  DatabaseRenamedEvent,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import {
  onDatabaseEntryDeleted,
  onDatabaseEntryRenamed,
  onDatabasePropertyRenamed,
  onDatabaseRenamed,
} from '../event-handlers';

/**
 * Initializes snapshots by subscribing to the content packages'
 * domain events, recording renames in the rename ledger as a side
 * effect. The content packages themselves know nothing about the
 * ledger.
 */
export function initializeSnapshots(): void {
  // Record entry renames in the rename ledger
  Events.on(DatabaseEntryRenamedEvent, 'snapshots', ({ data }) =>
    onDatabaseEntryRenamed(data),
  );

  // Record database renames in the rename ledger
  Events.on(DatabaseRenamedEvent, 'snapshots', ({ data }) =>
    onDatabaseRenamed(data),
  );

  // Record property renames in the rename ledger
  Events.on(DatabasePropertyRenamedEvent, 'snapshots', ({ data }) =>
    onDatabasePropertyRenamed(data),
  );

  // Retract dead untitled rename chains on entry deletion
  Events.on(DatabaseEntryDeletedEvent, 'snapshots', ({ data }) =>
    onDatabaseEntryDeleted(data),
  );
}

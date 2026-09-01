import {
  DatabaseEntryDeletedEvent,
  DatabaseEntryRenamedEvent,
  DatabaseEntryWrittenEvent,
  DatabasePropertyRenamedEvent,
  DatabaseRenamedEvent,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { TagRenamedEvent } from '@minddrop/tags';
import {
  onDatabaseEntryDeleted,
  onDatabaseEntryRenamed,
  onDatabaseEntryWritten,
  onDatabasePropertyRenamed,
  onDatabaseRenamed,
  onTagRenamed,
} from '../event-handlers';

/**
 * Initializes snapshots by subscribing to the content packages'
 * domain events, capturing snapshots and recording renames in the
 * rename ledger as a side effect. The content packages themselves
 * know nothing about snapshots.
 */
export function initializeSnapshots(): void {
  // Capture the contents an entry write replaced
  Events.on(DatabaseEntryWrittenEvent, 'snapshots', ({ data }) =>
    onDatabaseEntryWritten(data),
  );

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

  // Record tag renames in the rename ledger
  Events.on(TagRenamedEvent, 'snapshots', ({ data }) => onTagRenamed(data));
}

import { DesignUpdatedEventData } from '@minddrop/designs-next';
import { isEntityId } from '@minddrop/utils';
import { writeDatabaseDesigns } from '../../writeDatabaseDesigns';

/**
 * Called when a design is updated. If the design is owned by a
 * database, persists the updated designs to the database config.
 */
export function onDatabaseDesignUpdated(data: DesignUpdatedEventData): void {
  const { updated } = data;

  if (updated.owner && isEntityId(updated.owner, 'database')) {
    writeDatabaseDesigns(updated.owner);
  }
}

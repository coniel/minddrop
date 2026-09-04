import { DesignCreatedEventData } from '@minddrop/designs-next';
import { isEntityId } from '@minddrop/utils';
import { writeDatabaseDesigns } from '../../writeDatabaseDesigns';

/**
 * Called when a design is created. If the design is owned by a
 * database, persists the updated designs to the database config.
 */
export function onDatabaseDesignCreated(data: DesignCreatedEventData): void {
  if (data.owner && isEntityId(data.owner, 'database')) {
    writeDatabaseDesigns(data.owner);
  }
}

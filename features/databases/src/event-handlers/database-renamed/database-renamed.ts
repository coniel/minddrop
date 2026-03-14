import { DatabaseRenamedEventData } from '@minddrop/databases';
import { DatabaseViewStateStore } from '../../DatabaseViewStateStore';

/**
 * Migrates persisted view state when a database is renamed.
 * Rename changes the database ID, so the state entry must
 * be moved from the old ID to the new one.
 */
export function onRenameDatabase(data: DatabaseRenamedEventData): void {
  const existing = DatabaseViewStateStore.get(data.original.id);

  if (!existing) {
    return;
  }

  DatabaseViewStateStore.remove(data.original.id);
  DatabaseViewStateStore.set({
    ...existing,
    databaseId: data.updated.id,
  });
}

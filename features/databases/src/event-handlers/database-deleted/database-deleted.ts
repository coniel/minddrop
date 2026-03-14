import { DatabaseDeletedEventData } from '@minddrop/databases';
import { DatabaseViewStateStore } from '../../DatabaseViewStateStore';

/**
 * Removes persisted view state when a database is deleted.
 */
export function onDeleteDatabase(data: DatabaseDeletedEventData): void {
  DatabaseViewStateStore.remove(data.id);
}

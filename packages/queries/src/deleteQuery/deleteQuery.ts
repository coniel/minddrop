import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { QueriesStore } from '../QueriesStore';
import { QueryDeletedEvent, QueryDeletedEventData } from '../events';
import { getQuery } from '../getQuery';
import { getQueryFilePath } from '../utils';

/**
 * Deletes a query, removing it from the store and deleting it from the file
 * system.
 *
 * @param queryId - The ID of the query to delete.
 *
 * @dispatches queries:query:deleted
 */
export async function deleteQuery(queryId: string): Promise<void> {
  // Get the query
  const query = getQuery(queryId);

  // Delete the query from the store
  QueriesStore.remove(queryId);

  // Delete the query config from the file system
  await Fs.removeFile(getQueryFilePath(queryId));

  // Dispatch the query deleted event
  Events.dispatch<QueryDeletedEventData>(QueryDeletedEvent, query);
}

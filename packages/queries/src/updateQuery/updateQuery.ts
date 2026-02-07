import { Events } from '@minddrop/events';
import { QueriesStore } from '../QueriesStore';
import { QueryUpdatedEvent } from '../events';
import { getQuery } from '../getQuery';
import { Query } from '../types';
import { writeQueryConfig } from '../writeQueryConfig';

export type UpdateQueryData = Partial<Pick<Query, 'name' | 'filters' | 'sort'>>;
/**
 * Updates a query, updating it in the store and writing it to the file system.
 *
 * @param queryId - The ID of the query to update.
 * @param data - The query data.
 * @returns The updated query.
 *
 * @dispatches 'queries:query:updated' event
 */
export async function updateQuery(
  queryId: string,
  data: UpdateQueryData,
): Promise<Query> {
  // Get the query
  const query = getQuery(queryId);

  // Update the query
  const updatedQuery: Query = {
    ...query,
    ...data,
  };

  // Update the query in the store
  QueriesStore.update(queryId, updatedQuery);

  // Write the query config to the file system
  await writeQueryConfig(queryId);

  // Dispatch the query updated event
  Events.dispatch(QueryUpdatedEvent, {
    original: query,
    updated: updatedQuery,
  });

  return updatedQuery;
}

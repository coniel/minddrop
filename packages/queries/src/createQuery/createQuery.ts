import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
import { QueriesStore } from '../QueriesStore';
import { QueryCreatedEvent, QueryCreatedEventData } from '../events';
import { Query } from '../types';
import { writeQuery } from '../writeQuery';

/**
 * Creates a new query, adding it to the store and writing it to the file system.
 *
 * @param name - The name of the query, defaults to the query type name.
 *
 * @returns The created query.
 *
 * @dispatches queries:query:created
 */
export async function createQuery(name?: string): Promise<Query> {
  // Generate the query object
  const query: Query = {
    id: uuid(),
    created: new Date(),
    lastModified: new Date(),
    name: name || i18n.t('queries.labels.query'),
    filters: [],
    sort: [],
  };

  // Add the query to the store
  QueriesStore.add(query);

  // Write the query config to the file system
  await writeQuery(query.id);

  // Dispatch the query created event
  Events.dispatch<QueryCreatedEventData>(QueryCreatedEvent, query);

  return query;
}

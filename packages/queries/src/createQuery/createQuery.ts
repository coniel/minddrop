import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { entityId } from '@minddrop/utils';
import { QueriesStore } from '../QueriesStore';
import {
  DEFAULT_RESULTS_NODE_POSITION,
  DEFAULT_SOURCE_NODE_POSITION,
} from '../constants';
import { QueryCreatedEvent } from '../events';
import { Query } from '../types';
import { createQueryNode } from '../utils';
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
    id: entityId('query'),
    created: new Date(),
    lastModified: new Date(),
    name: name || i18n.t('queries.labels.query'),
    // Every query graph starts with an unconfigured source node
    // and its permanent results node, spaced to fit a filter
    // node between them
    nodes: [
      createQueryNode('source', DEFAULT_SOURCE_NODE_POSITION),
      createQueryNode('results', DEFAULT_RESULTS_NODE_POSITION),
    ],
    connections: [],
  };

  // Add the query to the store
  QueriesStore.set(query);

  // Write the query config to the file system
  await writeQuery(query.id);

  // Dispatch the query created event
  Events.dispatch(QueryCreatedEvent, query);

  return query;
}

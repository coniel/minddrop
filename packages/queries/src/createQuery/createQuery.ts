import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { Paths, uuid } from '@minddrop/utils';
import { QueriesStore } from '../QueriesStore';
import { QueriesDirectory } from '../constants';
import { QueryCreatedEvent } from '../events';
import { Query } from '../types';
import { writeQueryConfig } from '../writeQueryConfig';

/**
 * Creates a new query, adding it to the store and writing it to the file system.
 *
 * @returns The created query.
 *
 * @dispatches 'queries:query:created' event
 */
export async function createQuery(): Promise<Query> {
  // Use 'Query' as the default query name
  let queryName = i18n.t('queries.labels.query');

  // Generate the query path and name, incrementing the name if necessary
  const { path, increment } = await Fs.incrementalPath(
    Fs.concatPath(Paths.workspace, QueriesDirectory, `${queryName}.query`),
  );

  // Generate the query object
  const query: Query = {
    id: uuid(),
    created: new Date(),
    lastModified: new Date(),
    path,
    name: increment ? `${queryName} ${increment}` : queryName,
    filters: [],
    sort: [],
  };

  // Add the query to the store
  QueriesStore.add(query);

  // Write the query config to the file system
  await writeQueryConfig(query.id);

  // Dispatch the query created event
  Events.dispatch(QueryCreatedEvent, query);

  return query;
}

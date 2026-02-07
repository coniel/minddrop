import { Query } from './types';

export const QueryCreatedEvent = 'queries:query:created';
export const QueryUpdatedEvent = 'queries:query:updated';
export const QueryDeletedEvent = 'queries:query:deleted';

export type QueryCreatedEventData = Query;

export type QueryUpdatedEventData = {
  original: Query;
  updated: Query;
};

export type QueryDeletedEventData = Query;

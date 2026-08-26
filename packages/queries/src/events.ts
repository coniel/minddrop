import { Query } from './types';

export const QueryCreatedEvent = 'queries:query:created';
export const QueryUpdatedEvent = 'queries:query:updated';
export const QueryDeletedEvent = 'queries:query:deleted';
export const QueriesLoadedEvent = 'queries:loaded';

export type QueryCreatedEventData = Query;

export type QueryUpdatedEventData = {
  original: Query;
  updated: Query;
};

export type QueryDeletedEventData = Query;

export type QueriesLoadedEventData = Query[];

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'queries:query:created': QueryCreatedEventData;
    'queries:query:updated': QueryUpdatedEventData;
    'queries:query:deleted': QueryDeletedEventData;
    'queries:loaded': QueriesLoadedEventData;
  }
}

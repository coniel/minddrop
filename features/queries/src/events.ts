export const EventListenerId = 'queries-feature';
export const OpenQueriesViewEvent = 'queries:queries-view:open';
export const QueriesViewName = 'queries:view:queries';

export interface OpenQueriesViewEventData {
  /**
   * The ID of the query the view opens showing.
   */
  queryId?: string;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'queries:queries-view:open': OpenQueriesViewEventData | undefined;
  }
}

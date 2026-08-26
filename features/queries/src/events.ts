export const EventListenerId = 'queries-feature';
export const OpenQueriesViewEvent = 'queries:queries-view:open';
export const QueriesViewName = 'queries:view:queries';

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'queries:queries-view:open': void;
  }
}

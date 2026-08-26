export const EventListenerId = 'collections-feature';
export const OpenCollectionsViewEvent = 'collections:collections-view:open';
export const CollectionsViewName = 'collections:view:collections';

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'collections:collections-view:open': void;
  }
}

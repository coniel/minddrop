export const EventListenerId = 'collections-feature';
export const OpenCollectionsViewEvent = 'collections:collections-view:open';
export const CollectionsViewName = 'collections:view:collections';

export interface OpenCollectionsViewEventData {
  /**
   * The ID of the collection the view opens showing.
   */
  collectionId?: string;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'collections:collections-view:open':
      | OpenCollectionsViewEventData
      | undefined;
  }
}

import { Design } from './types';

export const DesignsLoadedEvent = 'designs-next:loaded';
export const DesignCreatedEvent = 'designs-next:design:created';
export const DesignUpdatedEvent = 'designs-next:design:updated';
export const DesignDeletedEvent = 'designs-next:design:deleted';

export type DesignsLoadedEventData = Design[];
export type DesignCreatedEventData = Design;
export type DesignDeletedEventData = Design;

export interface DesignUpdatedEventData {
  /**
   * The design as it was before the update.
   */
  original: Design;

  /**
   * The design as it is after the update.
   */
  updated: Design;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'designs-next:loaded': DesignsLoadedEventData;
    'designs-next:design:created': DesignCreatedEventData;
    'designs-next:design:updated': DesignUpdatedEventData;
    'designs-next:design:deleted': DesignDeletedEventData;
  }
}

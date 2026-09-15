import { ContentView, ContentViewType } from './types';

/*****************************
 * ContentView Events
 *****************************/

export const ContentViewCreatedEvent = 'content-views:content-view:created';
export const ContentViewUpdatedEvent = 'content-views:content-view:updated';
export const ContentViewDeletedEvent = 'content-views:content-view:deleted';
export const ContentViewsLoadedEvent = 'content-views:loaded';

export type ContentViewCreatedEventData = ContentView;
export type ContentViewUpdatedEventData = {
  original: ContentView;
  updated: ContentView;
};
export type ContentViewDeletedEventData = ContentView;
export type ContentViewsLoadedEventData = ContentView[];

/*****************************
 * ContentView Type Events
 *****************************/

export const ContentViewTypeRegisteredEvent =
  'content-views:content-view-type:registered';
export const ContentViewTypeUnregisteredEvent =
  'content-views:content-view-type:unregistered';

export type ContentViewTypeRegisteredEventData = ContentViewType;
export type ContentViewTypeUnregisteredEventData = ContentViewType;

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'content-views:content-view:created': ContentViewCreatedEventData;
    'content-views:content-view:updated': ContentViewUpdatedEventData;
    'content-views:content-view:deleted': ContentViewDeletedEventData;
    'content-views:loaded': ContentViewsLoadedEventData;
    'content-views:content-view-type:registered': ContentViewTypeRegisteredEventData;
    'content-views:content-view-type:unregistered': ContentViewTypeUnregisteredEventData;
  }
}

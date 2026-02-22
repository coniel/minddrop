import { View, ViewType } from './types';

/*****************************
 * View Events
 *****************************/

export const ViewCreatedEvent = 'views:view:created';
export const ViewUpdatedEvent = 'views:view:updated';
export const ViewDeletedEvent = 'views:view:deleted';
export const ViewsLoadedEvent = 'views:loaded';

export type ViewCreatedEventData = View;
export type ViewUpdatedEventData = {
  original: View;
  updated: View;
};
export type ViewDeletedEventData = View;
export type ViewsLoadedEventData = View[];

/*****************************
 * View Type Events
 *****************************/

export const ViewTypeRegisteredEvent = 'views:view-type:registered';
export const ViewTypeUnregisteredEvent = 'views:view-type:unregistered';

export type ViewTypeRegisteredEventData = ViewType;
export type ViewTypeUnregisteredEventData = ViewType;

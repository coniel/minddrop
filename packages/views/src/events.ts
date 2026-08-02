import { DataView, DataViewType } from './types';

/*****************************
 * DataView Events
 *****************************/

export const ViewCreatedEvent = 'views:view:created';
export const ViewUpdatedEvent = 'views:view:updated';
export const ViewDeletedEvent = 'views:view:deleted';
export const ViewsLoadedEvent = 'views:loaded';

export type ViewCreatedEventData = DataView;
export type ViewUpdatedEventData = {
  original: DataView;
  updated: DataView;
};
export type ViewDeletedEventData = DataView;
export type ViewsLoadedEventData = DataView[];

/*****************************
 * DataView Type Events
 *****************************/

export const ViewTypeRegisteredEvent = 'views:view-type:registered';
export const ViewTypeUnregisteredEvent = 'views:view-type:unregistered';

export type ViewTypeRegisteredEventData = DataViewType;
export type ViewTypeUnregisteredEventData = DataViewType;

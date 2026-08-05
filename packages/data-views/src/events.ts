import { DataView, DataViewType } from './types';

/*****************************
 * DataView Events
 *****************************/

export const DataViewCreatedEvent = 'data-views:data-view:created';
export const DataViewUpdatedEvent = 'data-views:data-view:updated';
export const DataViewDeletedEvent = 'data-views:data-view:deleted';
export const DataViewsLoadedEvent = 'data-views:loaded';

export type DataViewCreatedEventData = DataView;
export type DataViewUpdatedEventData = {
  original: DataView;
  updated: DataView;
};
export type DataViewDeletedEventData = DataView;
export type DataViewsLoadedEventData = DataView[];

/*****************************
 * DataView Type Events
 *****************************/

export const DataViewTypeRegisteredEvent =
  'data-views:data-view-type:registered';
export const DataViewTypeUnregisteredEvent =
  'data-views:data-view-type:unregistered';

export type DataViewTypeRegisteredEventData = DataViewType;
export type DataViewTypeUnregisteredEventData = DataViewType;

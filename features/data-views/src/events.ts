import { BaseOpenViewEventData } from '@minddrop/views';

export const EventListenerId = 'data-views-feature';
export const OpenDataViewViewEvent = 'data-views:data-view-view:open';
export const OpenDataViewsViewEvent = 'data-views:data-views-view:open';
export const OpenNewDataViewViewEvent = 'data-views:new-data-view-view:open';
export const DataViewViewName = 'data-views:view:data-view';
export const DataViewsViewName = 'data-views:view:data-views';
export const NewDataViewViewName = 'data-views:view:new-data-view';

// View instance id of the singleton new data view view, shared so
// the view can close itself once the data view is created
export const NewDataViewViewId = 'data-views:new-data-view';

export interface OpenDataViewViewEventData extends BaseOpenViewEventData {
  /**
   * The ID of the data view to open.
   */
  dataViewId: string;
}

/**
 * Data of the open data views view event, carrying only the pane
 * fields.
 */
export type OpenDataViewsViewEventData = BaseOpenViewEventData;

export interface OpenNewDataViewViewEventData extends BaseOpenViewEventData {
  /**
   * The type of data view to create.
   */
  viewType: string;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'data-views:data-view-view:open': OpenDataViewViewEventData;
    'data-views:data-views-view:open': OpenDataViewsViewEventData;
    'data-views:new-data-view-view:open': OpenNewDataViewViewEventData;
  }
}

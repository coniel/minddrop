export const EventListenerId = 'data-views-feature';
export const OpenDataViewViewEvent = 'data-views:data-view-view:open';
export const OpenDataViewsViewEvent = 'data-views:data-views-view:open';
export const DataViewViewName = 'data-views:view:data-view';
export const DataViewsViewName = 'data-views:view:data-views';

export interface OpenDataViewViewEventData {
  /**
   * The ID of the data view to open.
   */
  dataViewId: string;
}

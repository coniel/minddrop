import { BaseOpenViewEventData } from '@minddrop/views';

export const EventListenerId = 'content-views-feature';
export const OpenContentViewViewEvent = 'content-views:content-view-view:open';
export const OpenContentViewsViewEvent =
  'content-views:content-views-view:open';
export const OpenNewContentViewViewEvent =
  'content-views:new-content-view-view:open';
export const ContentViewViewName = 'content-views:view:content-view';
export const ContentViewsViewName = 'content-views:view:content-views';
export const NewContentViewViewName = 'content-views:view:new-content-view';

// View instance id of the singleton new content view view, shared so
// the view can close itself once the content view is created.
export const NewContentViewViewId = 'content-views:new-content-view';

export interface OpenContentViewViewEventData extends BaseOpenViewEventData {
  /**
   * The ID of the content view to open.
   */
  contentViewId: string;
}

/**
 * Data of the open content views view event, carrying only the pane
 * fields.
 */
export type OpenContentViewsViewEventData = BaseOpenViewEventData;

export interface OpenNewContentViewViewEventData extends BaseOpenViewEventData {
  /**
   * The type of content view to create.
   */
  viewType: string;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'content-views:content-view-view:open': OpenContentViewViewEventData;
    'content-views:content-views-view:open': OpenContentViewsViewEventData;
    'content-views:new-content-view-view:open': OpenNewContentViewViewEventData;
  }
}

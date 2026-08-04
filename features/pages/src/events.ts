export const EventListenerId = 'pages-feature';
export const OpenNewPageDialogEvent = 'pages:new-page-dialog:open';
export const OpenPageViewEvent = 'pages:page-view:open';
export const PageViewName = 'pages:view:page';

export interface OpenPageViewEventData {
  /**
   * The ID of the page to open.
   */
  pageId: string;
}

export const EventListenerId = 'spaces-feature';
export const OpenNewSpaceDialogEvent = 'spaces:new-space-dialog:open';
export const OpenSpaceViewEvent = 'spaces:space-view:open';
export const SpaceViewName = 'spaces:view:space';

export interface OpenSpaceViewEventData {
  /**
   * The ID of the space to open.
   */
  spaceId: string;
}

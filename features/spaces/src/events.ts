export const EventListenerId = 'spaces-feature';
export const OpenNewSpaceDialogEvent = 'spaces:new-space-dialog:open';
export const OpenSpaceViewEvent = 'spaces:space-view:open';
export const OpenSpacesViewEvent = 'spaces:spaces-view:open';
export const SpaceViewName = 'spaces:view:space';
export const SpacesViewName = 'spaces:view:spaces';

export interface OpenSpaceViewEventData {
  /**
   * The ID of the space to open.
   */
  spaceId: string;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'spaces:new-space-dialog:open': void;
    'spaces:space-view:open': OpenSpaceViewEventData;
    'spaces:spaces-view:open': void;
  }
}

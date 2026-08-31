export const EventListenerId = 'tags-feature';
export const OpenTagsViewEvent = 'tags:tags-view:open';
export const TagsViewName = 'tags:view:tags';

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'tags:tags-view:open': void;
  }
}

import { Tag } from './types';

export const TagCreatedEvent = 'tags:tag:created';
export const TagUpdatedEvent = 'tags:tag:updated';
export const TagRenamedEvent = 'tags:tag:renamed';
export const TagDeletedEvent = 'tags:tag:deleted';
export const TagsLoadedEvent = 'tags:loaded';

export type TagCreatedEventData = Tag;

export type TagUpdatedEventData = {
  original: Tag;
  updated: Tag;
};

export type TagRenamedEventData = {
  original: Tag;
  updated: Tag;
};

export type TagDeletedEventData = Tag;

export type TagsLoadedEventData = Tag[];

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'tags:tag:created': TagCreatedEventData;
    'tags:tag:updated': TagUpdatedEventData;
    'tags:tag:renamed': TagRenamedEventData;
    'tags:tag:deleted': TagDeletedEventData;
    'tags:loaded': TagsLoadedEventData;
  }
}

import { Tag, TagGroup } from './types';

export const TagCreatedEvent = 'tags:tag:created';
export const TagUpdatedEvent = 'tags:tag:updated';
export const TagRenamedEvent = 'tags:tag:renamed';
export const TagDeletedEvent = 'tags:tag:deleted';
export const TagsLoadedEvent = 'tags:loaded';
export const TagGroupCreatedEvent = 'tags:group:created';
export const TagGroupUpdatedEvent = 'tags:group:updated';
export const TagGroupDeletedEvent = 'tags:group:deleted';
export const TagGroupsLoadedEvent = 'tags:groups:loaded';
export const OpenTagsViewEvent = 'tags:tags-view:open';

export type OpenTagsViewEventData = {
  /**
   * Where to open the tags view. Defaults to in-place.
   */
  openMode?: 'in-place' | 'new-tab';
};

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

export type TagGroupCreatedEventData = TagGroup;

export type TagGroupUpdatedEventData = {
  original: TagGroup;
  updated: TagGroup;
};

export type TagGroupDeletedEventData = TagGroup;

export type TagGroupsLoadedEventData = TagGroup[];

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'tags:tag:created': TagCreatedEventData;
    'tags:tag:updated': TagUpdatedEventData;
    'tags:tag:renamed': TagRenamedEventData;
    'tags:tag:deleted': TagDeletedEventData;
    'tags:loaded': TagsLoadedEventData;
    'tags:group:created': TagGroupCreatedEventData;
    'tags:group:updated': TagGroupUpdatedEventData;
    'tags:group:deleted': TagGroupDeletedEventData;
    'tags:groups:loaded': TagGroupsLoadedEventData;
    'tags:tags-view:open': OpenTagsViewEventData | undefined;
  }
}

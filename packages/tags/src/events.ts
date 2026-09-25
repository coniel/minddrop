import { HistoryAction } from '@minddrop/history';
import { Tag } from './types';

export const TagCreatedEvent = 'tags:tag:created';
export const TagUpdatedEvent = 'tags:tag:updated';
export const TagRenamedEvent = 'tags:tag:renamed';
export const TagDeletedEvent = 'tags:tag:deleted';
export const TagsLoadedEvent = 'tags:loaded';
export const OpenTagsViewEvent = 'tags:tags-view:open';

export type OpenTagsViewEventData = {
  /**
   * Where to open the tags view. Defaults to in-place.
   */
  openMode?: 'in-place' | 'new-tab';

  /**
   * The ID of the tag the view opens showing.
   */
  tagId?: string;
};

export type TagCreatedEventData = Tag;

export type TagUpdatedEventData = {
  original: Tag;
  updated: Tag;
};

export type TagRenamedEventData = {
  original: Tag;
  updated: Tag;

  /**
   * The action performing the rename.
   */
  action: HistoryAction;
};

export interface TagDeletedEventData extends Tag {
  /**
   * The action performing the deletion.
   */
  action: HistoryAction;
}

export type TagsLoadedEventData = Tag[];

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'tags:tag:created': TagCreatedEventData;
    'tags:tag:updated': TagUpdatedEventData;
    'tags:tag:renamed': TagRenamedEventData;
    'tags:tag:deleted': TagDeletedEventData;
    'tags:loaded': TagsLoadedEventData;
    'tags:tags-view:open': OpenTagsViewEventData | undefined;
  }
}

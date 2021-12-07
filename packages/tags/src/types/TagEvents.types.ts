import { EventListenerCallback } from '@minddrop/core';
import { Tag, TagChanges } from './Tag.types';

export type CreateTagEvent = 'tags:create';
export type UpdateTagEvent = 'tags:update';
export type DeleteTagEvent = 'tags:delete';
export type LoadTagsEvent = 'tags:load';
export type ClearTagsEvent = 'tags:clear';

export type CreateTagEventData = Tag;
export type DeleteTagEventData = Tag;
export type LoadTagsEventData = Tag[];

export interface UpdateTagEventData {
  /**
   * The tag data prior to being updated.
   */
  before: Tag;

  /**
   * The updated tag data.
   */
  after: Tag;

  /**
   * The changes made to the tag data.
   */
  changes: TagChanges;
}

export type CreateTagEventCallback = EventListenerCallback<
  CreateTagEvent,
  CreateTagEventData
>;
export type UpdateTagEventCallback = EventListenerCallback<
  UpdateTagEvent,
  UpdateTagEventData
>;
export type DeleteTagEventCallback = EventListenerCallback<
  DeleteTagEvent,
  DeleteTagEventData
>;
export type LoadTagsEventCallback = EventListenerCallback<
  LoadTagsEvent,
  LoadTagsEventData
>;
export type ClearTagsEventCallback = EventListenerCallback<ClearTagsEvent>;

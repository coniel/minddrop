import { Tag, UpdateTagData } from './Tag.types';

export type CreateTagEvent = 'create-tag';
export type UpdateTagEvent = 'update-tag';
export type DeleteTagEvent = 'delete-tag';

export type CreateTagEventData = Tag;
export type DeleteTagEventData = Tag;

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
  changes: UpdateTagData;
}

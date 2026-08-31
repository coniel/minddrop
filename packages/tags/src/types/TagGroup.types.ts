import { EntityId } from '@minddrop/utils';

export type TagGroupId = EntityId<'tag-group'>;

export interface TagGroup {
  /**
   * A unique identifier for the tag group.
   */
  id: TagGroupId;

  /**
   * The user defined name of the group. Unique across all groups
   * (case-insensitive).
   */
  name: string;

  /**
   * The date the group was created.
   */
  created: Date;

  /**
   * The date the group was last modified.
   */
  lastModified: Date;
}

export type UpdateTagGroupData = Partial<Pick<TagGroup, 'name'>>;

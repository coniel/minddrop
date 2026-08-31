import { ContentColor } from '@minddrop/ui-theme';
import { EntityId } from '@minddrop/utils';
import { TagGroupId } from './TagGroup.types';

export type TagId = EntityId<'tag'>;

export interface Tag {
  /**
   * A unique identifier for the tag.
   */
  id: TagId;

  /**
   * The user defined name of the tag. Unique across all tags
   * (case-insensitive) as entry property values reference tags
   * by name.
   */
  name: string;

  /**
   * The display color of the tag.
   */
  color: ContentColor;

  /**
   * The ID of the group the tag belongs to. Absent for ungrouped
   * tags.
   */
  group?: TagGroupId;

  /**
   * The date the tag was created.
   */
  created: Date;

  /**
   * The date the tag was last modified.
   */
  lastModified: Date;
}

export type UpdateTagData = Partial<Pick<Tag, 'name' | 'color'>> & {
  /**
   * The ID of the group to assign the tag to, or null to ungroup
   * it.
   */
  group?: TagGroupId | null;
};

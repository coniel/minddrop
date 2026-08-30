import { ContentColor } from '@minddrop/ui-theme';
import { EntityId } from '@minddrop/utils';

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
   * The date the tag was created.
   */
  created: Date;

  /**
   * The date the tag was last modified.
   */
  lastModified: Date;
}

export type UpdateTagData = Partial<Pick<Tag, 'name' | 'color'>>;

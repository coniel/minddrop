import { EntityId } from '@minddrop/utils';
import type { EntityGroupEntityType } from '../constants';

export type EntityGroupId = EntityId<typeof EntityGroupEntityType>;

export interface EntityGroup {
  /**
   * A unique identifier for the group.
   */
  id: EntityGroupId;

  /**
   * The registered group type the group belongs to.
   */
  type: string;

  /**
   * The name of the group.
   */
  name: string;

  /**
   * The IDs of the group's items, in the order they are listed. A
   * group holds only the grouping: the entity an item points at is
   * unaware of the groups listing it.
   */
  items: string[];

  /**
   * The date the group was created.
   */
  created: Date;

  /**
   * The date the group was last modified.
   */
  lastModified: Date;
}

export type UpdateEntityGroupData = Partial<Pick<EntityGroup, 'name'>>;

export interface EntityGroupSet {
  /**
   * The group type the set holds the groups of.
   */
  type: string;

  /**
   * The type's groups, in the order they are listed.
   */
  groups: EntityGroup[];
}

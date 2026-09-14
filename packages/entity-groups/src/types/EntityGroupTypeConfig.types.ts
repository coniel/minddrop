import { EventName } from '@minddrop/events';
import { EntityGroupId } from './EntityGroup.types';

export interface ProtectedEntityGroupConfig {
  /**
   * The group's ID, fixed by the app rather than minted.
   */
  id: EntityGroupId;

  /**
   * The group's name.
   */
  name: string;
}

export interface EntityGroupTypeConfig {
  /**
   * Identifies the group type, and names the file its groups are
   * stored in.
   */
  id: string;

  /**
   * The entity type names a group of this type can hold, matching
   * the type prefix of its items' IDs.
   */
  itemTypes: string[];

  /**
   * Whether an item can belong to more than one of the type's
   * groups. When false, adding an item to a group removes it from
   * the group which held it.
   *
   * @default false
   */
  multiMembership?: boolean;

  /**
   * Whether the type's groups take items dragged in from outside
   * them: out of another type's groups, or from no group at all.
   * When false, only items dragged out of the type's own groups can
   * be dropped into them.
   *
   * @default false
   */
  acceptsExternalItems?: boolean;

  /**
   * The groups the app provides, in the order they are appended to
   * a stored list which is missing them. They are ordered among the
   * user's own groups but cannot otherwise be edited.
   */
  protectedGroups?: ProtectedEntityGroupConfig[];

  /**
   * Events which mean one of the type's items has been deleted, so
   * that the groups holding it drop it. Their data is the deleted
   * entity.
   */
  itemDeletedEvents?: EventName[];
}

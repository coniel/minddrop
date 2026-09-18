import type { UiIconName } from '@minddrop/ui-icons';
import { EntityGroupId } from './types';

/**
 * The entity type name of an entity group, used as the type prefix
 * of its ID.
 */
export const EntityGroupEntityType = 'entity-group';

/**
 * The name of the directory the groups are stored in, holding one
 * file per group type.
 */
export const EntityGroupsDirName = 'entity-groups';

/**
 * The ID of the virtual group standing for the items in none of a
 * type's groups, for a type which sets `ungrouped`. Never stored.
 */
export const UngroupedEntityGroupId: EntityGroupId = `${EntityGroupEntityType}_ungrouped`;

/**
 * The icon used to represent a group in the UI, for group types
 * which have no icon of their own.
 */
export const EntityGroupIcon: UiIconName = 'folder';

/**
 * The icon of the action which creates a group.
 */
export const NewEntityGroupIcon: UiIconName = 'folder-plus';

/**
 * The icon of the action which takes an item out of a group.
 */
export const RemoveFromEntityGroupIcon: UiIconName = 'folder-minus';

/**
 * The icon of the action which moves an item to another group.
 */
export const MoveToEntityGroupIcon: UiIconName = 'folder-input';

/**
 * The icon of the action which adds an item to a further group,
 * leaving it in the groups already holding it.
 */
export const AddToEntityGroupIcon: UiIconName = 'folder-symlink';

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
 * The ID of the virtual group holding the items in none of a type's
 * groups, for a type which sets `ungrouped`. Never stored.
 */
export const UngroupedEntityGroupId: EntityGroupId = `${EntityGroupEntityType}_ungrouped`;

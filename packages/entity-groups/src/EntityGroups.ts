import { NotRegisteredError } from '@minddrop/stores';
import { EntityGroupTypesRegistry } from './EntityGroupTypesRegistry';
import { EntityGroupEntityType } from './constants';
import {
  EntityGroupNotFoundError,
  ProtectedEntityGroupError,
  UnsupportedEntityGroupItemError,
} from './errors';
import {
  EntityGroupCreatedEvent,
  EntityGroupDeletedEvent,
  EntityGroupUpdatedEvent,
  EntityGroupsLoadedEvent,
  EntityGroupsReorderedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: EntityGroupCreatedEvent,
  Updated: EntityGroupUpdatedEvent,
  Deleted: EntityGroupDeletedEvent,
  Reordered: EntityGroupsReorderedEvent,
  Loaded: EntityGroupsLoadedEvent,
} as const;

export const errors = {
  NotFound: EntityGroupNotFoundError,
  Protected: ProtectedEntityGroupError,
  NotRegistered: NotRegisteredError,
  UnsupportedItem: UnsupportedEntityGroupItemError,
};

export const constants = {
  EntityType: EntityGroupEntityType,
};

export const getConfig = EntityGroupTypesRegistry.get;

export { initializeEntityGroups as initialize } from './initializeEntityGroups';
export { loadWorkspaceEntityGroups as loadWorkspace } from './loadWorkspaceEntityGroups';
export { registerEntityGroupType as registerType } from './registerEntityGroupType';
export { unregisterEntityGroupType as unregisterType } from './unregisterEntityGroupType';
export { createEntityGroup as create } from './createEntityGroup';
export { getEntityGroup as get } from './getEntityGroup';
export { getAllEntityGroups as getAll } from './getAllEntityGroups';
export { getEntityGroupsForItem as getForItem } from './getEntityGroupsForItem';
export {
  isProtectedEntityGroup as isProtected,
  resolveEntityGroupId as resolveId,
} from './utils';
export { updateEntityGroup as update } from './updateEntityGroup';
export { deleteEntityGroup as delete } from './deleteEntityGroup';
export { reorderEntityGroups as reorder } from './reorderEntityGroups';
export { addEntityGroupItem as addItem } from './addEntityGroupItem';
export { moveEntityGroupItem as moveItem } from './moveEntityGroupItem';
export { removeEntityGroupItem as removeItem } from './removeEntityGroupItem';
export { reorderEntityGroupItems as reorderItems } from './reorderEntityGroupItems';
export { useEntityGroupsForItem as useForItem } from './useEntityGroupsForItem';
export {
  EntityGroupsStore as Store,
  useEntityGroup as use,
  useEntityGroups as useAll,
} from './EntityGroupsStore';

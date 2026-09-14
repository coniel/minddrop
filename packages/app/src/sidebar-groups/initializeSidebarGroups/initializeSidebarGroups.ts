import { EntityGroups } from '@minddrop/entity-groups';
import { sidebarGroupsTypeConfig } from '../sidebarGroupsTypeConfig';

/**
 * Registers the sidebar's entity group type.
 *
 * Must be called before the entity groups are loaded.
 */
export function initializeSidebarGroups(): void {
  EntityGroups.registerType(sidebarGroupsTypeConfig);
}

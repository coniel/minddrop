import { EntityGroups } from '@minddrop/entity-groups';
import { SidebarGroupsTypeConfig } from '../SidebarGroupsTypeConfig';

/**
 * Registers the sidebar's entity group type.
 *
 * Must be called before the entity groups are loaded.
 */
export function initializeSidebarGroups(): void {
  EntityGroups.registerType(SidebarGroupsTypeConfig);
}

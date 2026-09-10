import { EntityGroups } from '@minddrop/entity-groups';
import { sidebarGroupsTypeConfig } from '../sidebarGroupsTypeConfig';

/**
 * Registers the sidebar's entity group type. Called before the
 * entity groups are loaded, which is what reads the sidebar's groups
 * off the file system.
 */
export function initializeSidebarGroups(): void {
  EntityGroups.registerType(sidebarGroupsTypeConfig);
}

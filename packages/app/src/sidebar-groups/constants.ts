import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { EntityGroups } from '@minddrop/entity-groups';
import { Queries } from '@minddrop/queries';
import { Spaces } from '@minddrop/spaces';
import { Tags } from '@minddrop/tags';

/**
 * The entity group type the sidebar's groups belong to.
 */
export const SidebarGroupsType = 'sidebar-groups';

/**
 * The entity types a sidebar group can hold, matching the type
 * prefix of the items' IDs.
 */
export const SidebarGroupItemTypes = [
  Databases.constants.EntityType,
  DatabaseEntries.constants.EntityType,
  DataViews.constants.EntityType,
  Spaces.constants.EntityType,
  Collections.constants.EntityType,
  Queries.constants.EntityType,
  Tags.constants.EntityType,
];

/**
 * The library group, listing the app's main views.
 */
export const LibrarySidebarGroupId = EntityGroups.resolveId('sidebar-library');

/**
 * The databases group, listing every database in the workspace.
 */
export const DatabasesSidebarGroupId =
  EntityGroups.resolveId('sidebar-databases');

/**
 * The sidebar groups the app provides, in the order they are
 * appended to a stored list which is missing them. They are ordered
 * among the user's own groups but cannot otherwise be edited: their
 * name and contents are the app's. The names are stored so that the
 * file reads plainly, and are shown translated rather than as
 * stored.
 */
export const ProtectedSidebarGroups = [
  { id: LibrarySidebarGroupId, name: 'Library' },
  { id: DatabasesSidebarGroupId, name: 'Databases' },
];

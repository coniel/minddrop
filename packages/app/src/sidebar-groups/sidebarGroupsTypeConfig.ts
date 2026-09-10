import { DataViews } from '@minddrop/data-views';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { Spaces } from '@minddrop/spaces';
import {
  ProtectedSidebarGroups,
  SidebarGroupItemTypes,
  SidebarGroupsType,
} from './constants';

/**
 * The sidebar's entity group type. Sidebar groups gather things for
 * display rather than filing them away, so an item can sit in
 * several of them, and the app provides the library and databases
 * groups.
 */
export const sidebarGroupsTypeConfig: EntityGroupTypeConfig = {
  id: SidebarGroupsType,
  itemTypes: SidebarGroupItemTypes,
  multiMembership: true,
  protectedGroups: ProtectedSidebarGroups,
  itemDeletedEvents: [
    Databases.events.Deleted,
    DatabaseEntries.events.Deleted,
    DataViews.events.Deleted,
    Spaces.events.Deleted,
  ],
};

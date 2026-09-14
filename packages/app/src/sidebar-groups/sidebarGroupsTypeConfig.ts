import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { Queries } from '@minddrop/queries';
import { Spaces } from '@minddrop/spaces';
import { Tags } from '@minddrop/tags';
import {
  ProtectedSidebarGroups,
  SidebarGroupItemTypes,
  SidebarGroupsType,
} from './constants';

/**
 * The sidebar's entity group type. Sidebar groups gather things for
 * display rather than filing them away, so an item can sit in
 * several of them and be dragged in from anywhere in the app, and
 * the app provides the library and databases groups.
 */
export const sidebarGroupsTypeConfig: EntityGroupTypeConfig = {
  id: SidebarGroupsType,
  itemTypes: SidebarGroupItemTypes,
  multiMembership: true,
  acceptsExternalItems: true,
  protectedGroups: ProtectedSidebarGroups,
  itemDeletedEvents: [
    Databases.events.Deleted,
    DatabaseEntries.events.Deleted,
    DataViews.events.Deleted,
    Spaces.events.Deleted,
    Collections.events.Deleted,
    Queries.events.Deleted,
    Tags.events.Deleted,
  ],
};

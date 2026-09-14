import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { EntityGroup, EntityGroupId } from '@minddrop/entity-groups';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { SpaceFixtures } from '@minddrop/spaces/test-utils';
import { TagFixtures } from '@minddrop/tags/test-utils';
import {
  DatabasesSidebarGroupId,
  LibrarySidebarGroupId,
  SidebarGroupsType,
} from '../sidebar-groups';

// The groups the app provides. Their stored names deliberately
// differ from the labels the app shows them under, which is what
// the user sees translated.
export const sidebarGroup_library: EntityGroup = {
  id: LibrarySidebarGroupId,
  type: SidebarGroupsType,
  name: 'Stored library name',
  items: [],
};

export const sidebarGroup_databases: EntityGroup = {
  id: DatabasesSidebarGroupId,
  type: SidebarGroupsType,
  name: 'Stored databases name',
  items: [],
};

export const protectedSidebarGroups = [
  sidebarGroup_library,
  sidebarGroup_databases,
];

/**
 * A sidebar group holding one of each item type the sidebar can
 * list, so that every renderer is exercised.
 */
export const sidebarGroup_1: EntityGroup = {
  id: 'entity-group_sidebar_1' as EntityGroupId,
  type: SidebarGroupsType,
  name: 'My group',
  items: [
    DatabaseFixtures.objectDatabase.id,
    DatabaseFixtures.objectEntry1.id,
    DataViewFixtures.dataView_gallery_1.id,
    SpaceFixtures.space_1.id,
    CollectionFixtures.collection_1.id,
    QueryFixtures.query_1.id,
    TagFixtures.tag_1.id,
  ],
};

/**
 * A second sidebar group, empty, for the actions which move an item
 * from one group to another.
 */
export const sidebarGroup_2: EntityGroup = {
  id: 'entity-group_sidebar_2' as EntityGroupId,
  type: SidebarGroupsType,
  name: 'My other group',
  items: [],
};

export const sidebarGroups = [
  sidebarGroup_1,
  sidebarGroup_2,
  ...protectedSidebarGroups,
];
